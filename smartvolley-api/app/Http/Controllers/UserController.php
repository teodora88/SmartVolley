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
    public function index(Request $request)
    {

        if ($request->user()->role_as !== UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $users = User::when($request->role_as, function ($query, $role) {
            return $query->where('role_as', $role);
        })
            ->when($request->search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            })
            ->get();

        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        if ($request->user()->role_as !== UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|unique:users|max:255',
            'password' => 'required|string|min:6',
            'phone_number' => 'required|string',
            'role_as' => ['required', new Enum(UserRole::class)],
        ], [
            'name.required' => 'Ime je obavezno.',
            'last_name.required' => 'Prezime je obavezno.',
            'username.required' => 'Korisničko ime je obavezno.',
            'username.unique' => 'Korisničko ime je već zauzeto.',
            'password.required' => 'Lozinka je obavezna.',
            'password.min' => 'Lozinka mora imati najmanje 6 karaktera.',
            'phone_number.required' => 'Broj telefona je obavezan.',
            'role_as.required' => 'Uloga je obavezna.',
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
    public function show(User $user, Request $request)
    {

        if ($request->user()->role_as !== UserRole::ADMIN && $request->user()->id !== $user->id) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {

        if ($request->user()->role_as !== UserRole::ADMIN && $request->user()->id !== $user->id) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        $fields = $request->validate([
            'name' => 'sometimes|filled|string|max:255',
            'last_name' => 'sometimes|filled|string|max:255',
            'username' => 'sometimes|filled|string|unique:users,username,' . $user->id . '|max:255',
            'password' => 'sometimes|string|min:6',
            'phone_number' => 'sometimes|filled|string',
            'role_as' => ['sometimes', 'filled', new Enum(UserRole::class)],
        ], [
            'name.filled' => 'Ime ne sme biti prazno.',
            'last_name.filled' => 'Prezime ne sme biti prazno.',
            'username.filled' => 'Korisničko ime ne sme biti prazno.',
            'phone_number.filled' => 'Broj telefona ne sme biti prazan.',
            'role_as.filled' => 'Uloga ne sme biti prazna.',
        ]);

        if (isset($fields['password'])) {
            $fields['password'] = Hash::make($fields['password']);
        }

        $user->update($fields);

        return response()->json([
            'message' => 'Podaci uspesno promenjeni!',
            'user' => $user,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, Request $request)
    {

        if ($request->user()->role_as !== UserRole::ADMIN) {
            return response()->json([
                'message' => 'Nemate pristup ovoj akciji!'
            ], 403);
        }

        try {
            $user->delete();
            return response()->json([
                'message' => 'Korisnik je uspešno obrisan!'
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Korisnik ne može biti obrisan jer ima povezane članove!'
            ], 409);
        }
    }
}
