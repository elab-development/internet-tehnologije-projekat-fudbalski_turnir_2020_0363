<?php

namespace App\Http\Controllers;
use App\Http\Resources\GameResource;
use App\Models\Game;
use App\Models\Team;
use Illuminate\Http\Request;
use App\Models\PlayerStats;

class GameController extends Controller
{
    public function index()
    {
        try {
            $games = Game::all();
            return GameResource::collection($games);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function store(Request $request)
    {
        try{
            $game = Game::create($request->all());
            return response()->json($game, 201);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function show($id)
    {
        try{
            $game = Game::findOrFail($id);
            return new GameResource($game);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
      
    }



   
 
    public function update(Request $request, $id)
    {

        try{

            $game = Game::findOrFail($id);
            $game->update($request->all());
            return response()->json(['message' => 'Game updated successfully']);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
        
    }


    

    public function destroy($id)
    {
        try{
            Game::destroy($id);
            return response()->json(null, 204);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
        
    }
}
