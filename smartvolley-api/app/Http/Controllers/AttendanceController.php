<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $attendances = Attendance::when($request->activity_id, function ($query, $activityId) {
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
    public function store(Request $request)
    {
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
    public function show(Attendance $attendance)
    {
        return response()->json($attendance);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendance $attendance)
    {
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
    public function destroy(Attendance $attendance)
    {
        $attendance->delete();

        return response()->json([
            'message' => 'Evidencija je uspesno obrisana!'
        ], 200);
    }
}
