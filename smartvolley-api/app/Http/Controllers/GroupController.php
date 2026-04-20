<?php

namespace App\Http\Controllers;

use App\Enums\GroupCategory;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $groups = Group::all();
        return response()->json($groups);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'category' => ['required', new Enum(GroupCategory::class)],
            'location_id' => 'required|exists:locations,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $group = Group::create($fields);
        return response()->json([
            'message' => 'Grupa je uspesno kreirana!',
            'group' => $group,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group)
    {
        return response()->json($group);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Group $group)
    {
        $fields = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => ['sometimes', new Enum(GroupCategory::class)],
            'location_id' => 'nullable|exists:locations,id',
            'user_id' => 'nullable|exists:users,id',
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
    public function destroy(Group $group)
    {
        $group->delete();

        return response()->json([
            'message' => 'Grupa je uspesno obrisana!'
        ], 200);
    }
}
