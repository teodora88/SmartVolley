<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $members = Member::when($request->group_id, function ($query, $groupId) {
            return $query->where('group_id', $groupId);
        })
            ->when($request->user_id, function ($query, $userId) {
                return $query->where('user_id', $userId);
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
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birthday' => 'nullable|date',
            'height' => 'nullable|numeric|min:50|max:250',
            'weight' => 'nullable|numeric|min:10|max:200',
            'user_id' => 'nullable|exists:users,id',
            'group_id' => 'nullable|exists:groups,id',
        ]);

        $member = Member::create($fields);

        return response()->json([
            'message' => 'Clan je uspesno kreiran!',
            'member' => $member,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member)
    {
        return response()->json($member);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member)
    {
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
    public function destroy(Member $member)
    {
        $member->delete();

        return response()->json([
            'message' => 'Clan je uspesno obrisan!'
        ], 200);
    }
}
