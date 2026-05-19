<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Group;
use App\Models\Member;
use App\Models\MemberNote;
use Illuminate\Http\Request;

class MemberNoteController extends Controller
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
            $memberIds = Member::where('user_id', $request->user()->id)->pluck('id');

            if ($request->member_id && !$memberIds->contains($request->member_id)) {
                return response()->json([
                    'message' => 'Nemate pristup ovoj akciji!'
                ], 403);
            }

            $memberNotes = MemberNote::whereIn('member_id', $memberIds)
                ->when($request->member_id, function ($query, $memberId) {
                    return $query->where('member_id', $memberId);
                })
                ->get();

            return response()->json($memberNotes);
        }

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        $memberIds = Member::whereIn('group_id', $coachGroupIds)->pluck('id');

        $memberNotes = MemberNote::whereIn('member_id', $memberIds)
            ->when($request->member_id, function ($query, $memberId) {
                return $query->where('member_id', $memberId);
            })
            ->get();

        return response()->json($memberNotes);
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

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        $memberIds = Member::whereIn('group_id', $coachGroupIds)->pluck('id');

        if ($request->member_id && !$memberIds->contains($request->member_id)) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $fields = $request->validate([
            'body' => 'required|string',
            'member_id' => 'required|exists:members,id'
        ]);

        $memberNote = MemberNote::create($fields);

        return response()->json([
            'message' => 'Evaluacija uspesno kreirana',
            'memberNote' => $memberNote,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(MemberNote $memberNote, Request $request)
    {
        if ($request->user()->role_as === UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        if ($request->user()->role_as === UserRole::PARENT) {
            $memberIds = Member::where('user_id', $request->user()->id)->pluck('id');

            if (!$memberIds->contains($memberNote->member_id)) {
                return response()->json([
                    'message' => 'Nemate pristup ovoj akciji!'
                ], 403);
            }
        }

        if ($request->user()->role_as === UserRole::COACH) {
            $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
            $memberIds = Member::whereIn('group_id', $coachGroupIds)->pluck('id');

            if (!$memberIds->contains($memberNote->member_id)) {
                return response()->json([
                    'message' => 'Nemate pristup ovoj akciji!'
                ], 403);
            }
        }

        return response()->json($memberNote);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MemberNote $memberNote)
    {
        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        $memberIds = Member::whereIn('group_id', $coachGroupIds)->pluck('id');

        if (!$memberIds->contains($memberNote->member_id)) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $fields = $request->validate([
            'body' => 'sometimes|string'
        ]);

        $memberNote->update($fields);

        return response()->json([
            'message' => 'Evaluacija uspesno izmenjena!',
            'memberNote' => $memberNote,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MemberNote $memberNote, Request $request)
    {
        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        $memberIds = Member::whereIn('group_id', $coachGroupIds)->pluck('id');

        if (!$memberIds->contains($memberNote->member_id)) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $memberNote->delete();

        return response()->json([
            'message' => 'Evaluacija uspesno obrisana!'
        ], 200);
    }
}
