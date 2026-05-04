<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request){
        $request->validate([
            'username' => 'required|string',
            'password'=> 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if(!$user || !Hash::check($request->password, $user->password)){
            return response()->json([
                'message' => 'Pogresni kredencijali!',
            ], 401);
        }

        $token = $user->createToken($user->name);

        return response()->json([
            'message'=> 'Uspesno ste se prijavili!',
            'user' => $user,
            'token' => $token->plainTextToken,
        ]);
    }

    public function logout(Request $request){
        //$request->user()->tokens()->delete(); //BRISEMO SVE TOKENE KOJE TAJ USER IMA
        $request->user()->currentAccessToken()->delete(); // BRISEMO SAMO POSLEDNJI KREIRANI TOKEN ZA TOG USERA

        return response()->json([
            'message' => 'Uspesno ste se odjavili!'
        ]);
    }
}
