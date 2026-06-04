<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->user()->role_as === UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji.'
            ], 403);
        }

        $locations = Location::all();
        return response()->json($locations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji.'
            ], 403);
        }

        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255'
        ]);

        $location = Location::create($fields);

        return response()->json([
            'message' => 'Lokacija je uspešno kreirana.',
            'location' => $location,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location, Request $request)
    {
        if ($request->user()->role_as === UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji.'
            ], 403);
        }

        return response()->json($location);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Location $location)
    {
        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji.'
            ], 403);
        }

        $fields = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255'
        ]);

        $location->update($fields);

        return response()->json([
            'message' => 'Podaci uspešno promenjeni.',
            'location' => $location,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location, Request $request)
    {
        if ($request->user()->role_as !== UserRole::COACH) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji.'
            ], 403);
        }

        try {
            $location->delete();
            return response()->json([
                'message' => 'Lokacija je uspešno obrisana.'
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Lokacija ne može biti obrisana jer ima povezane aktivnosti.'
            ], 409);
        }
    }
}
