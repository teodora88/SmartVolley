<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Enum;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|unique:users|max:255',
            'password' => 'required|string|min:6',
            'phone_number' => 'nullable|string',
            'role_as' => ['required', new Enum(UserRole::class) ],
        ]);

        $fields['password'] = Hash::make($fields['password']);

        $user = User::create($fields);

        return response()->json([
            'message' => 'Korisnik je uspesno kreiran!',
            'user' => $user
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $fields = $request->validate([
            'name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone_number' => 'nullable|string',
        ]);

        $user->update($fields);

        return response()->json([
            'message' => 'Podaci uspesno promenjeni!',
            'user' => $user,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Korisnik je uspesno obrisan!'
        ]);
    }
}
