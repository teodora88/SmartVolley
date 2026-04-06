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
        return Location::all();
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

        return $location;
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location)
    {
        return $location;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Location $location)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255'
        ]);

        $location->update($fields);

        return $location;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location)
    {
        $location->delete();

        return [ 'message' => 'The location was deleted'];
    }
}
