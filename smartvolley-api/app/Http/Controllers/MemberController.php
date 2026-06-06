<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Attendance;
use App\Models\Group;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->user()->role_as === UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        if ($request->user()->role_as === UserRole::PARENT) {
            $members = Member::with('group')->where('user_id', $request->user()->id)->get();
            return response()->json($members);
        }

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');

        $members = Member::with('group')
            ->whereIn('group_id', $coachGroupIds)
            ->when($request->group_id, function ($query, $groupId) {
                return $query->where('group_id', $groupId);
            })
            ->when($request->search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            })
            ->get();

        return response()->json($members);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birthday' => 'nullable|date',
            'height' => 'nullable|numeric|min:50|max:250',
            'weight' => 'nullable|numeric|min:10|max:200',
            'user_id' => 'nullable|exists:users,id',
            'group_id' => 'required|exists:groups,id',
        ], [
            'name.required' => 'Ime je obavezno.',
            'last_name.required' => 'Prezime je obavezno.',
            'group_id.required' => 'Grupa je obavezna.',
            'group_id.exists' => 'Izabrana grupa ne postoji.',
        ]);

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        if (!$coachGroupIds->contains($fields['group_id'])) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji.'
            ], 403);
        }

        $member = Member::create($fields);

        return response()->json([
            'message' => 'Član je uspešno kreiran.',
            'member' => $member,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member, Request $request)
    {
        if ($request->user()->role_as === UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        if ($request->user()->role_as === UserRole::PARENT && $member->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        if ($request->user()->role_as === UserRole::COACH) {
            $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
            if (!$coachGroupIds->contains($member->group_id)) {
                return response()->json([
                    'message' => 'Nemate pristup ovoj akciji!'
                ], 403);
            }
        }

        return response()->json($member->load('group'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member)
    {
        if ($request->user()->role_as === UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        if ($request->user()->role_as === UserRole::PARENT) {
            if ($member->user_id !== $request->user()->id) {
                return response()->json([
                    'message' => 'Nemate pristup ovoj akciji!'
                ], 403);
            }

            $fields = $request->validate([
                'birthday' => 'nullable|date',
                'height' => 'nullable|numeric|min:50|max:250',
                'weight' => 'nullable|numeric|min:10|max:200',
            ]);

            $member->update($fields);

            return response()->json([
                'message' => 'Podaci uspesno promenjeni!',
                'member' => $member,
            ]);
        }

        // ako trener salje samo group_id - premestanje u tudju grupu
        if ($request->has('group_id') && count($request->all()) === 1) {
            $fields = $request->validate([
                'group_id' => 'required|exists:groups,id',
            ]);

            // proveravamo da nova grupa ne pripada ovom treneru
            $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
            if ($coachGroupIds->contains($fields['group_id'])) {
                return response()->json([
                    'message' => 'Koristite opciju izmeni za prebacivanje u sopstvenu grupu!'
                ], 422);
            }

            // brisemo predstojeće attendance redove
            Attendance::where('member_id', $member->id)
                ->whereHas('activity', function ($query) {
                    $query->where('status', 'scheduled');
                })
                ->delete();

            $member->update($fields);

            return response()->json([
                'message' => 'Član je uspešno premešten u drugu grupu.',
                'member' => $member,
            ]);
        }

        // regularna izmena - samo za clanove sopstvene grupe
        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        if (!$coachGroupIds->contains($member->group_id)) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $fields = $request->validate([
            'name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'birthday' => 'nullable|date',
            'height' => 'nullable|numeric|min:50|max:250',
            'weight' => 'nullable|numeric|min:10|max:200',
            'user_id' => 'nullable|exists:users,id',
            'group_id' => 'nullable|exists:groups,id',
        ]);

        // ako se menja grupa, obrisi predstojeće attendance redove
        // kako član ne bi ostao na spisku stare grupe
        if (isset($fields['group_id']) && $fields['group_id'] != $member->group_id) {
            Attendance::where('member_id', $member->id)
                ->whereHas('activity', function ($query) {
                    $query->where('status', 'scheduled');
                })
                ->delete();
        }

        $member->update($fields);

        return response()->json([
            'message' => 'Podaci uspesno promenjeni!',
            'member' => $member,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member, Request $request)
    {

        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        if (!$coachGroupIds->contains($member->group_id)) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $member->delete();

        return response()->json([
            'message' => 'Clan je uspesno obrisan!'
        ], 200);
    }
}
