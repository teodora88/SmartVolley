<?php

namespace App\Http\Controllers;

use App\Models\TournamentRegistration;
use Illuminate\Http\Request;

class TournamentRegistrationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $registrations = TournamentRegistration::when($request->activity_id, function ($query, $activityId) {
            return $query->where('activity_id', $activityId);
        })
            ->when($request->member_id, function ($query, $memberId) {
                return $query->where('member_id', $memberId);
            })
            ->get();

        return response()->json($registrations);
    }

    /**
     * Store a newly created resource in storage.
     */

    // registraciju za turnir pravimo automatski kroz ActivityController
    // store metodu koristimo u posebnim slucajevima
    public function store(Request $request)
    {
        $fields = $request->validate([
            'is_registered' => 'nullable|boolean',
            'activity_id' => 'required|exists:activities,id',
            'member_id' => 'required|exists:members,id',
        ]);

        $registration = TournamentRegistration::create($fields);

        return response()->json([
            'message' => 'Registracija je uspesno kreirana!',
            'registration' => $registration,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TournamentRegistration $tournamentRegistration)
    {
        return response()->json($tournamentRegistration);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TournamentRegistration $tournamentRegistration)
    {
        $fields = $request->validate([
            'is_registered' => 'required|boolean',
        ]);

        $tournamentRegistration->update($fields);

        return response()->json([
            'message' => 'Registracija je uspesno azurirana!',
            'registration' => $tournamentRegistration,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TournamentRegistration $tournamentRegistration)
    {
        $tournamentRegistration->delete();

        return response()->json([
            'message' => 'Registracija je uspesno obrisana!'
        ], 200);
    }
}
