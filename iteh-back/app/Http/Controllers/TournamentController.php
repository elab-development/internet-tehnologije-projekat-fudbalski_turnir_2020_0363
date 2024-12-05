<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\TournamentResource;
use App\Models\Tournament;
use Illuminate\Http\Request;
use MongoDB\Driver\Exception\Exception as MongoDBException;
use App\Models\Game;
use App\Models\GameStats;
use App\Models\PlayerStats;
use App\Models\Team;
use App\Models\Player;
use MongoDB\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;  
class TournamentController extends Controller
{
    public function index()
    {
        try {
            $tournaments = Tournament::all(); 
            return TournamentResource::collection($tournaments);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'place' => 'required|string',
            'logo' => 'nullable|string',
            'teams' => 'required|array',
            'teams.*.name' => 'required|string',
            'teams.*.id' => 'nullable|string',
            'numTeams' => 'required|integer',
            'teams.*.players' => 'required|array',
            'teams.*.players.*.name' => 'required|string',
            'teams.*.players.*.number' => 'required|integer|between:16,40',
            'teams.*.players.*.id' => 'nullable|string',
        ]);
    
        $client = DB::connection('mongodb')->getMongoClient();
        $session = $client->startSession();
        $session->startTransaction();
    
        try {
            $tournament = Tournament::create([
                'ime' => $validated['name'],
                'mesto' => $validated['place'],
                'logo' => $validated['logo'],
                'broj_timova' => $validated['numTeams'],
            ]);
    
            $teams = [];
            foreach ($validated['teams'] as $teamData) {
                if (is_null($teamData['id'])) {
                    $team = Team::create([
                        'ime' => $teamData['name'],
                    ]);
    
                    $tournament->teams()->save($team);
                } else {
                    $team = Team::find($teamData['id']);
                    if (!$team) {
                        $session->abortTransaction();
                        return response()->json(['success' => false, 'message' => 'Team not found'], 404);
                    }
    
                    $tournament->teams()->save($team);
                }
    
                foreach ($teamData['players'] as $playerData) {
                    if (is_null($playerData['id'])) {
                        $player = new Player();
                        $player->imePrezime = $playerData['name'];
                        $player->godine = $playerData['number'];
                        

                        $team->players()->save($player);
                            
                         
                    } else {
                        $player = Player::find($playerData['id']);
                        $existingStats = $player->stats_player;


                        if (!$player) {
                            $session->abortTransaction();
                            return response()->json(['success' => false, 'message' => 'Player not found'], 404);
                        }
                        $team->players()->save($player);
                       
                    }
                }
    
                $teams[] = $team;
            }
    
           
            $numGames = $validated['numTeams'] - 1;
            $brojUtakmice = $numGames;
    
            while (count($teams) > 1) {
                
                $tim1 = array_splice($teams, array_rand($teams), 1)[0];
                $tim2 = array_splice($teams, array_rand($teams), 1)[0];
    
                $game = Game::create([
                    'broj_utakmice' => $brojUtakmice,
                    'status'=>'not_started',
                    'broj_golova_domacin' => 0,
                    'broj_golova_gost' => 0,
                    'tim1' => $tim1->_id, 
                    'tim2' => $tim2->_id, 
                    'pobednik' => null, 
                    'tournament_id' => $tournament->_id 
                ]);

                $gameStats = GameStats::create([
                    'broj_suteva_domacin'=>0,
                    'broj_suteva_gost'=>0,
                    'sut_u_okvir_domacin'=>0,
                    'sut_van_okvira_domacin'=>0,
                    'sut_u_okvir_gost'=>0,
                    'sut_van_okvira_gost'=>0,
                    'posed_lopte_domacin'=>50,
                    'posed_lopte_gost'=>50
                ]);
                $game->stats_game()->save($gameStats);
                

                foreach ([$tim1, $tim2] as $team) {
                    foreach ($team->players as $player) {
                        $playerStats = PlayerStats::create([
                            'broj_golova' => 0,
                            'broj_asistencija' => 0,
                            'broj_zutih_kartona' => 0,
                            'broj_crvenih_kartona' => 0,
                            'broj_suta_u_ovkir' => 0,
                            'broj_suta_van_okvira' => 0,
                            'player_id' => $player->_id,
                            'game_id' => $game->_id 
                        ]);

                        $player->stats_player()->save($playerStats);
                    }
                }
                

                $game->team1()->associate($tim1);
                $game->team2()->associate($tim2);
                $game->tournament()->associate($tournament);
                $game->save();
                $brojUtakmice--;
            }
    
          
            while ($brojUtakmice > 0) {
                $game = Game::create([
                    'broj_utakmice' => $brojUtakmice,
                    'status'=>'not_started',
                    'broj_golova_domacin' => 0,
                    'broj_golova_gost' => 0,
                    'tim1' => null, 
                    'tim2' => null,
                    'pobednik' => null, 
                    'tournament_id' => $tournament->_id
                ]);

                $gameStats = GameStats::create([
                    'broj_suteva_domacin'=>0,
                    'broj_suteva_gost'=>0,
                    'sut_u_okvir_domacin'=>0,
                    'sut_van_okvira_domacin'=>0,
                    'sut_u_okvir_gost'=>0,
                    'sut_van_okvira_gost'=>0,
                    'posed_lopte_domacin'=>50,
                    'posed_lopte_gost'=>50
                ]);
                $game->stats_game()->save($gameStats);
             
                $game->tournament()->associate($tournament);
                $game->save();
    
                $brojUtakmice--;
            }
    
            $session->commitTransaction();
    
            return response()->json(['success' => true, 'tournament' => $tournament], 201);
        } catch (MongoDBException $e) {
            \Log::error($e->getMessage());
            $session->abortTransaction();
            return response()->json(['success' => false, 'message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
   
    
    
    

    public function show($id)
    {
        try{
            $tournament = Tournament::findOrFail($id);
            return new TournamentResource($tournament);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
  
    }

    public function update(Request $request, $id)
    {
        try{
            $tournament = Tournament::findOrFail($id);
            $tournament->update($request->all());
            return response()->json($tournament, 200);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
       
    }

    public function destroy($id)
    {
        try{
            Tournament::destroy($id);
            return response()->json(null, 204);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
       
    }

    public function addToFavorite(Request $request,$id){
        try{
            $user = Auth::user();
            $tournament = Tournament::findOrFail($id);
            $user->tournaments()->save($tournament);
            return response()->json(['success' => true, 'message' => 'Uspesno dodat turnir u omiljene: ' ], 200);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['success' => false,'message' => 'Nije uspesno dodat turnir u omiljene'], 500);
        }

      
    }

    public function removeFromFavorites(Request $request,$id){
        
        try{
            $user = Auth::user();
            $tournament = Tournament::findOrFail($id);
            $user->tournaments()->detach($tournament->_id);
            $tournament->users()->detach($user->_id);
            
            return response()->json(['success' => true, 'message' => 'Uspesno uklonjen turnir iz omiljenih: ' ], 200);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['success' => false,'message' => 'Nije uspesno uklonjen turnir iz omiljenih'], 500);
        }
       
    }

    public function getFavorites(Request $request){
        try{
            $user = Auth::user();
            return TournamentResource::collection($user->tournaments);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['success' => false, 'message' => 'Ne mogu da se vrate turniri: ' . $e->getMessage()], 500);
        }
    }
  
}
