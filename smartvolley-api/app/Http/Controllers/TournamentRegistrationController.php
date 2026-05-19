<?php

namespace App\Http\Controllers;

use App\Enums\ActivityType;
use App\Enums\UserRole;
use App\Models\Activity;
use App\Models\Group;
use App\Models\Member;
use App\Models\TournamentRegistration;
use Illuminate\Http\Request;

class TournamentRegistrationController extends Controller
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

            $registrations = TournamentRegistration::whereIn('member_id', $memberIds)
                ->when($request->member_id, function ($query, $memberId) {
                    return $query->where('member_id', $memberId);
                })
                ->when($request->activity_id, function ($query, $activityId) {
                    return $query->where('activity_id', $activityId);
                })
                ->get();

            return response()->json($registrations);
        }

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        $activityIds = Activity::whereIn('group_id', $coachGroupIds)
            ->where('type', ActivityType::TOURNAMENT)
            ->pluck('id');

        $registrations = TournamentRegistration::whereIn('activity_id', $activityIds)
            ->when($request->activity_id, function ($query, $activityId) {
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
        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        $activityIds = Activity::whereIn('group_id', $coachGroupIds)
            ->where('type', ActivityType::TOURNAMENT)
            ->pluck('id');

        if ($request->activity_id && !$activityIds->contains($request->activity_id)) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

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
    public function show(TournamentRegistration $tournamentRegistration, Request $request)
    {
        if ($request->user()->role_as === UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        if ($request->user()->role_as === UserRole::PARENT) {
            $memberIds = Member::where('user_id', $request->user()->id)->pluck('id');

            if (!$memberIds->contains($tournamentRegistration->member_id)) {
                return response()->json([
                    'message' => 'Nemate pristup ovoj akciji!'
                ], 403);
            }
        }

        if ($request->user()->role_as === UserRole::COACH) {
            $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
            $activityIds = Activity::whereIn('group_id', $coachGroupIds)
                ->where('type', ActivityType::TOURNAMENT)
                ->pluck('id');

            if (!$activityIds->contains($tournamentRegistration->activity_id)) {
                return response()->json([
                    'message' => 'Nemate pristup ovoj akciji!'
                ], 403);
            }
        }

        return response()->json($tournamentRegistration);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TournamentRegistration $tournamentRegistration)
    {
        if ($request->user()->role_as !== UserRole::PARENT) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $memberIds = Member::where('user_id', $request->user()->id)->pluck('id');

        if (!$memberIds->contains($tournamentRegistration->member_id)) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

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
    public function destroy(TournamentRegistration $tournamentRegistration, Request $request)
    {
        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        $activityIds = Activity::whereIn('group_id', $coachGroupIds)
            ->where('type', ActivityType::TOURNAMENT)
            ->pluck('id');

        if (!$activityIds->contains($tournamentRegistration->activity_id)) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $tournamentRegistration->delete();

        return response()->json([
            'message' => 'Registracija je uspesno obrisana!'
        ], 200);
    }
}
