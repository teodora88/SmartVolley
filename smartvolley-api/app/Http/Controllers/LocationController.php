<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations = Location::all();
        return response()->json($locations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255'
        ]);

        $location = Location::create($fields);

        return response()->json([
            'message' => 'Lokacija je uspesno kreirana!',
            'location' => $location,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location)
    {
        return response()->json($location);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Location $location)
    {
        $fields = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255'
        ]);

        $location->update($fields);

        return response()->json([
            'message' => 'Podaci uspesno promenjeni!',
            'location' => $location,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location)
    {
        try {
            $location->delete();
            return response()->json([
                'message' => 'Lokacija je uspesno obrisana!'
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Lokacija ne moze biti obrisana jer ima povezane aktivnosti!'
            ], 409);
        }
    }
}
