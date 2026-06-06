<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\MemberNoteController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TournamentRegistrationController;
use App\Http\Controllers\UserController;
use App\Models\Group;
use App\Models\User;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

  Route::post('/logout', [AuthController::class, 'logout']);

  Route::apiResource('users', UserController::class);
  Route::get('/parents', function () {
    return response()->json(
      User::where('role_as', 'parent')->get()
    );
  });
  Route::get('/groups/all', function () {
    return response()->json(
      Group::all()
    );
  });
  Route::apiResource('locations', LocationController::class);
  Route::apiResource('groups', GroupController::class);
  Route::apiResource('activities', ActivityController::class);
  Route::apiResource('members', MemberController::class);
  Route::apiResource('attendances', AttendanceController::class);
  Route::post('payments/monthly', [PaymentController::class, 'createMonthlyPayments']);
  Route::apiResource('payments', PaymentController::class);
  Route::apiResource('member-notes', MemberNoteController::class);
  Route::apiResource('tournament-registrations', TournamentRegistrationController::class);
});
