<?php

namespace App\Http\Controllers;

use App\Enums\GroupCategory;
use App\Enums\UserRole;
use App\Models\Group;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class GroupController extends Controller
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
            $groupIds = Member::where('user_id', $request->user()->id)->pluck('group_id');
            $groups = Group::whereIn('id', $groupIds)->get();
            return response()->json($groups);
        }

        $groups = Group::where('user_id', $request->user()->id)->get();
        return response()->json($groups);
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
            'category' => ['required', new Enum(GroupCategory::class)],
            'location_id' => 'required|exists:locations,id',
        ]);

        $fields['user_id'] = $request->user()->id;

        $group = Group::create($fields);
        return response()->json([
            'message' => 'Grupa je uspesno kreirana!',
            'group' => $group,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group, Request $request)
    {
        if ($request->user()->role_as === UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        if ($request->user()->role_as === UserRole::COACH && $group->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        if ($request->user()->role_as === UserRole::PARENT) {
            $groupIds = Member::where('user_id', $request->user()->id)->pluck('group_id');

            if (!$groupIds->contains($group->id)) {
                return response()->json([
                    'message' => 'Nemate pristup ovoj akciji!'
                ], 403);
            }
        }

        return response()->json($group);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Group $group)
    {
        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        if ($group->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $fields = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => ['sometimes', new Enum(GroupCategory::class)],
            'location_id' => 'nullable|exists:locations,id',
        ]);

        $group->update($fields);

        return response()->json([
            'message' => 'Podaci uspesno promenjeni!',
            'group' => $group,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group, Request $request)
    {

        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        if ($group->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $group->delete();

        return response()->json([
            'message' => 'Grupa je uspesno obrisana!'
        ], 200);
    }
}
