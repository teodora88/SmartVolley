<?php

namespace App\Http\Controllers;

use App\Enums\ActivityType;
use App\Enums\UserRole;
use App\Models\Activity;
use App\Models\Attendance;
use App\Models\Group;
use App\Models\Member;
use Illuminate\Http\Request;

class AttendanceController extends Controller
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

            $attendances = Attendance::whereIn('member_id', $memberIds)
                ->when($request->member_id, function ($query, $memberId) {
                    return $query->where('member_id', $memberId);
                })
                ->when($request->activity_id, function ($query, $activityId) {
                    return $query->where('activity_id', $activityId);
                })
                ->get();

            return response()->json($attendances);
        }

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        $activityIds = Activity::whereIn('group_id', $coachGroupIds)
            ->where('type', ActivityType::PRACTICE)
            ->pluck('id');

        $attendances = Attendance::whereIn('activity_id', $activityIds)
            ->when($request->activity_id, function ($query, $activityId) {
                return $query->where('activity_id', $activityId);
            })
            ->when($request->member_id, function ($query, $memberId) {
                return $query->where('member_id', $memberId);
            })
            ->get();

        return response()->json($attendances);
    }

    /**
     * Store a newly created resource in storage.
     */

    // store se uglavnom kreira automatski kroz ActivityController
    // koristi se samo u posebnim slucajevima
    public function store(Request $request)
    {

        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        $activityIds = Activity::whereIn('group_id', $coachGroupIds)
            ->where('type', ActivityType::PRACTICE)
            ->pluck('id');

        if ($request->activity_id && !$activityIds->contains($request->activity_id)) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $fields = $request->validate([
            'is_present' => 'nullable|boolean',
            'excuse' => 'nullable|string',
            'activity_id' => 'required|exists:activities,id',
            'member_id' => 'required|exists:members,id',
        ]);

        $attendance = Attendance::create($fields);

        return response()->json([
            'message' => 'Evidencija je uspesno kreirana!',
            'attendance' => $attendance,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance, Request $request)
    {
        if ($request->user()->role_as === UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        if ($request->user()->role_as === UserRole::PARENT) {
            $memberIds = Member::where('user_id', $request->user()->id)->pluck('id');

            if (!$memberIds->contains($attendance->member_id)) {
                return response()->json([
                    'message' => 'Nemate pristup ovoj akciji!'
                ], 403);
            }
        }

        if ($request->user()->role_as === UserRole::COACH) {
            $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
            $activityIds = Activity::whereIn('group_id', $coachGroupIds)
                ->where('type', ActivityType::PRACTICE)
                ->pluck('id');

            if (!$activityIds->contains($attendance->activity_id)) {
                return response()->json([
                    'message' => 'Nemate pristup ovoj akciji!'
                ], 403);
            }
        }

        return response()->json($attendance);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendance $attendance)
    {
        if ($request->user()->role_as === UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        if ($request->user()->role_as === UserRole::PARENT) {
            $memberIds = Member::where('user_id', $request->user()->id)->pluck('id');

            if (!$memberIds->contains($attendance->member_id)) {
                return response()->json([
                    'message' => 'Nemate pristup ovoj akciji!'
                ], 403);
            }

            $fields = $request->validate([
                'excuse' => 'nullable|string',
            ]);

            $attendance->update($fields);

            return response()->json([
                'message' => 'Evidencija je uspesno azurirana!',
                'attendance' => $attendance,
            ]);
        }

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        $activityIds = Activity::whereIn('group_id', $coachGroupIds)
            ->where('type', ActivityType::PRACTICE)
            ->pluck('id');

        if (!$activityIds->contains($attendance->activity_id)) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $fields = $request->validate([
            'is_present' => 'nullable|boolean',
            'excuse' => 'nullable|string',
        ]);

        $attendance->update($fields);

        return response()->json([
            'message' => 'Evidencija je uspesno azurirana!',
            'attendance' => $attendance,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // koristi se kada clan napusti grupu
    // a nije obrisan iz sistema
    public function destroy(Attendance $attendance, Request $request)
    {

        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $coachGroupIds = Group::where('user_id', $request->user()->id)->pluck('id');
        $activityIds = Activity::whereIn('group_id', $coachGroupIds)
            ->where('type', ActivityType::PRACTICE)
            ->pluck('id');

        if (!$activityIds->contains($attendance->activity_id)) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $attendance->delete();

        return response()->json([
            'message' => 'Evidencija je uspesno obrisana!'
        ], 200);
    }
}
