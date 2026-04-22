<?php

namespace App\Http\Controllers;

use App\Models\MemberNote;
use Illuminate\Http\Request;

class MemberNoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $memberNotes = MemberNote::when($request->member_id, function ($query, $memberId){
            return $query-> where('member_id', $memberId);
        })->get();

        return response()->json($memberNotes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'body' => 'required|string',
            'member_id' => 'required|exists:members,id'
        ]);

        $memberNote = MemberNote::create($fields);

        return response()->json([
            'message' => 'Evaluacija uspesno kreirana',
            'memberNote' => $memberNote,
        ],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(MemberNote $memberNote)
    {
        return response()->json($memberNote);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MemberNote $memberNote)
    {
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
    public function destroy(MemberNote $memberNote)
    {
        $memberNote->delete();

        return response()->json([
            'message' => 'Evaluacija uspesno obrisana!'
        ],200);
    }
}
