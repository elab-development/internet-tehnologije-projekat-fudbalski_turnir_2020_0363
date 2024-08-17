<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;
use App\Http\Resources\PlayerResource;
class PlayerController extends Controller
{
    public function index()
    {
        try {
            $players = Player::all();
            return PlayerResource::collection($players);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function store(Request $request)
    {
        try{
            $player = Player::create($request->all());
            return response()->json($player, 201);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
       
    }

    public function show($id)
    {
        try{
            $player = Player::findOrFail($id);
            \Log::info($player);
            return response()->json(new PlayerResource($player));
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
      
    }

    public function update(Request $request, $id)
    {
        try{
            $player = Player::findOrFail($id);
            $player->update($request->all());
            return response()->json($player, 200);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
      
    }

    public function destroy($id)
    {
        try{
            Player::destroy($id);
        return response()->json(null, 204);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
        
    }

   

}
