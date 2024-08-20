<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;
use App\Http\Resources\PlayerResource;
use Illuminate\Support\Facades\Log;
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
    public function getAllPlayersWithAllStatistics(Request $request)
{
    try {
       
        $perPage = $request->input('perPage', 20);

       
        $players = Player::paginate($perPage);

 
        foreach ($players as $player) {
            $stats = $player->stats_player;

            $cumulativeStats = [
                'broj_golova' => $stats->sum('broj_golova'),
                'broj_asistencija' => $stats->sum('broj_asistencija'),
                'broj_zutih_kartona' => $stats->sum('broj_zutih_kartona'),
                'broj_crvenih_kartona' => $stats->sum('broj_crvenih_kartona'),
                'broj_suta_u_okvir' => $stats->sum('broj_suta_u_ovkir'),
                'broj_suta_van_okvira' => $stats->sum('broj_suta_van_okvira'),
            ];

      
            $player->cumulative_stats = $cumulativeStats;
        }

      
        return PlayerResource::collection($players);
    } catch (\Exception $e) {
        \Log::error($e->getMessage());
        return response()->json(['error' => 'Greska u citanju podataka'], 500);
    }
}

   

}
