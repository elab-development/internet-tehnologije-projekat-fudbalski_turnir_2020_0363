<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


use App\Http\Controllers\PlayerController;

//igraci

Route::middleware('auth:sanctum')->group(function () {
    Route::get('players', [PlayerController::class, 'index']);
    Route::get('players/{id}', [PlayerController::class, 'show']);
    Route::post('players', [PlayerController::class, 'store']);
    Route::put('players/{id}', [PlayerController::class, 'update']);
    Route::delete('players/{id}', [PlayerController::class, 'destroy']);
   
});

