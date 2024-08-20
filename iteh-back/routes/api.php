<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlayerController;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


//igraci

Route::middleware('auth:sanctum')->group(function () {
    Route::get('players/cumulative_stats', [PlayerController::class, 'getAllPlayersWithAllStatistics']);
    Route::get('players', [PlayerController::class, 'index']);
    Route::get('players/{id}', [PlayerController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('players', [PlayerController::class, 'store']);
        Route::put('players/{id}', [PlayerController::class, 'update']);
        Route::delete('players/{id}', [PlayerController::class, 'destroy']);
    });
});

use App\Http\Controllers\TeamController;

//teams

Route::middleware('auth:sanctum')->group(function () {
    Route::get('teams', [TeamController::class, 'index']);
    Route::get('teams/{id}', [TeamController::class, 'show']);
    
    Route::middleware('role:admin')->group(function () {
        Route::post('teams', [TeamController::class, 'store']);
        Route::put('teams/{id}', [TeamController::class, 'update']);
        Route::delete('teams/{id}', [TeamController::class, 'destroy']);
    });
});

use App\Http\Controllers\GameController;

//games

Route::middleware('auth:sanctum')->group(function () {
    Route::get('games', [GameController::class, 'index']);
    Route::get('games/{id}', [GameController::class, 'show']);
     
    Route::middleware('role:admin')->group(function () {   
        Route::post('games', [GameController::class, 'store']);
        Route::put('games/{id}', [GameController::class, 'update']);
        Route::delete('games/{id}', [GameController::class, 'destroy']);
    });
});

use App\Http\Controllers\TournamentController;

//tournaments

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tournaments', TournamentController::class)->only([
        'index', 'show'
    ]);
   

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('tournaments', TournamentController::class)->only([
            'store', 'update', 'destroy'
        ]);
    });
});
