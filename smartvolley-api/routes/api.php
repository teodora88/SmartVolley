<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('users', UserController::class);

Route::apiResource('locations', LocationController::class);

Route::apiResource('groups', GroupController::class);

Route::apiResource('activities', ActivityController::class);

Route::apiResource('members', MemberController::class);