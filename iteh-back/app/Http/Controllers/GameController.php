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
            $game = Game::findOrFail($id);



          
            $gameStats = $game->stats_game;
            $gameStats->sut_u_okvir_domacin = array_sum($request->input('home_team.players.shotsOnTarget'));
            $gameStats->sut_van_okvira_domacin = array_sum($request->input('home_team.players.shotsOffTarget'));
            $gameStats->sut_u_okvir_gost = array_sum($request->input('away_team.players.shotsOnTarget'));
            $gameStats->sut_van_okvira_gost = array_sum($request->input('away_team.players.shotsOffTarget'));
            $gameStats->broj_suteva_domacin= $gameStats->sut_u_okvir_domacin +   $gameStats->sut_van_okvira_domacin;
            $gameStats->broj_suteva_gost=$gameStats->sut_u_okvir_gost +  $gameStats->sut_van_okvira_gost;
            $gameStats->posed_lopte_domacin = $request->input('home_team.possession');
            $gameStats->posed_lopte_gost = $request->input('away_team.possession');
            $gameStats->save();

           
            $homeTeamStats = $request->input('home_team.players');
            $totalHomeGoals = 0; 
            foreach ($homeTeamStats['id'] as $index => $playerId) {
                $playerStats = PlayerStats::where('game_id', $id)
                                        ->where('player_id', $playerId)
                                        ->firstOrFail();
                $playerStats->broj_golova = $homeTeamStats['goals'][$index];
                $totalHomeGoals += $homeTeamStats['goals'][$index];
                $playerStats->broj_asistencija = $homeTeamStats['assists'][$index];
                $playerStats->broj_zutih_kartona = $homeTeamStats['yellowCards'][$index];
                $playerStats->broj_crvenih_kartona = $homeTeamStats['redCards'][$index];
                $playerStats->broj_suta_u_ovkir = $homeTeamStats['shotsOnTarget'][$index];
                $playerStats->broj_suta_van_okvira = $homeTeamStats['shotsOffTarget'][$index];
                $playerStats->save();
            }

            $awayTeamStats = $request->input('away_team.players');
            $totalAwayGoals = 0; 
            foreach ($awayTeamStats['id'] as $index => $playerId) {
                $playerStats = PlayerStats::where('game_id', $id)
                                        ->where('player_id', $playerId)
                                        ->firstOrFail();
                $playerStats->broj_golova = $awayTeamStats['goals'][$index];
                $totalAwayGoals += $awayTeamStats['goals'][$index]; 
                $playerStats->broj_asistencija = $awayTeamStats['assists'][$index];
                $playerStats->broj_zutih_kartona = $awayTeamStats['yellowCards'][$index];
                $playerStats->broj_crvenih_kartona = $awayTeamStats['redCards'][$index];
                $playerStats->broj_suta_u_ovkir = $awayTeamStats['shotsOnTarget'][$index];
                $playerStats->broj_suta_van_okvira = $awayTeamStats['shotsOffTarget'][$index];
                $playerStats->save();
            }

          
            $game->broj_golova_domacin = $totalHomeGoals;
            $game->broj_golova_gost = $totalAwayGoals;
            $game->save();

            return response()->json(['message' => 'Game and player stats updated successfully']);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
        
    }
}
