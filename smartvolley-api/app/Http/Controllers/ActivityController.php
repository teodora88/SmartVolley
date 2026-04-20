<?php

namespace App\Http\Controllers;

use App\Enums\ActivityStatus;
use App\Enums\ActivityType;
use App\Models\Activity;
use App\Models\Attendance;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $activities = Activity::when($request->group_id, function ($query, $groupId) {
            return $query->where('group_id', $groupId);
        })
            ->when($request->type, function ($query, $type) {
                return $query->where('type', $type);
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->get();

        return response()->json($activities);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'date' => 'required|date',
            'time' => 'required|date_format:H:i:s',
            'type' => ['required', new Enum(ActivityType::class)],
            'group_id' => 'required|exists:groups,id',
            'location_id' => 'nullable|exists:locations,id',
            'other_location' => 'nullable|string|max:255',
        ]);

        if (!$request->location_id && !$request->other_location) {
            return response()->json([
                'message' => 'Mora biti unesena lokacija!'
            ], 422);
        }

        if ($request->location_id && $request->other_location) {
            return response()->json([
                'message' => 'Ne mogu biti unesene obe lokacije istovremeno!'
            ], 422);
        }

        $activity = Activity::create($fields);

        // za tip trening automatski kreiramo evidenciju prisutnosti
        // za svakog clana grupe sa is_present = null
        // roditelj moze unapred da opravda izostanak
        if ($activity->type === ActivityType::PRACTICE) {
            $members = Member::where('group_id', $activity->group_id)->get();
            foreach ($members as $member) {
                Attendance::create([
                    'activity_id' => $activity->id,
                    'member_id' => $member->id,
                    'is_present' => null,
                ]);
            }
            return response()->json([
                'message' => 'Trening je uspesno kreiran!',
                'activity' => $activity,
            ], 201);
        }

        return response()->json([
            'message' => 'Aktivnost je uspesno kreirana!',
            'activity' => $activity,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Activity $activity)
    {
        return response()->json($activity);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Activity $activity)
    {
        $fields = $request->validate([
            'date' => 'sometimes|date',
            'time' => 'sometimes|date_format:H:i:s',
            'status' => ['sometimes', new Enum(ActivityStatus::class)],
            'location_id' => 'nullable|exists:locations,id',
            'other_location' => 'nullable|string|max:255',
        ]);

        if ($request->has('location_id') && $request->location_id) {
            $fields['other_location'] = null;
        }

        if ($request->has('other_location') && $request->other_location) {
            $fields['location_id'] = null;
        }

        $activity->update($fields);

        // kada trener zavodi prisutnost, proveravamo da li ima novih clanova
        // koji su se pridruzili grupi nakon kreiranja treninga
        // firstOrCreate - nam kreira novi red samo za nove clanove, nema dupliranja
        if ($activity->status === ActivityStatus::COMPLETED) {
            $members = Member::where('group_id', $activity->group_id)->get();
            foreach ($members as $member) {
                Attendance::firstOrCreate([
                    'activity_id' => $activity->id,
                    'member_id' => $member->id,
                ], [
                    'is_present' => null,
                ]);
            }
        }

        return response()->json([
            'message' => 'Podaci uspesno promenjeni!',
            'activity' => $activity,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Activity $activity)
    {
        $activity->delete();

        return response()->json([
            'message' => 'Aktivnost je uspesno obrisana!'
        ], 200);
    }
}
