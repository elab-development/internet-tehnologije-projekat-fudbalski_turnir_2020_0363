<?php

namespace App\Http\Controllers;
use App\Http\Resources\TeamResource;
use App\Models\Team;
use App\Models\Player;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        try {
            $teams = Team::all(); 
            return TeamResource::collection($teams);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function store(Request $request)
{
    try {
      
        $team = Team::create($request->only('ime'));

       
        foreach ($request->input('igraci') as $player) {
          
            if (!empty($player['id'])) {
                $playerDB = Player::find($player['id']);
                if ($playerDB) {
                   
                    $team->players()->attach($playerDB);
                }
            } else {
                
                $newPlayer = new Player([
                    'imePrezime' => $player['imePrezime'],
                    'godine' => $player['godine'],
                ]);
                $newPlayer->save();
                $team->players()->attach($newPlayer);
            }
        }

        return response()->json($team, 201);
    } catch (\Exception $e) {
        \Log::error($e->getMessage());
        return response()->json(['error' => 'An error occurred'], 500);
    }
}


    public function show($id)
    {
        try{
            $team = Team::with('players')->findOrFail($id);
        return new TeamResource($team);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
        
    }

   
        public function update(Request $request, $id)
        {
            try {
           
                $team = Team::findOrFail($id);
        
                
                $team->update($request->only('ime'));
   
                $existingPlayers = $team->players->pluck('id')->toArray();
        
           
                $newPlayers = [];
        
            
                foreach ($request->input('igraci') as $player) {
                    if (!empty($player['id'])) {
                   
                        $playerDB = Player::find($player['id']);
                        if ($playerDB) {
                           
                            $newPlayers[] = $playerDB->id;
                        }
                    } else {
                     
                        $newPlayer = new Player([
                            'imePrezime' => $player['imePrezime'],
                            'godine' => $player['godine'],
                        ]);
                        $newPlayer->save();
                        $newPlayers[] = $newPlayer->id;
                    }
                }
        
              
                $team->players()->sync($newPlayers);
        
                return response()->json($team, 200);
            } catch (\Exception $e) {
                \Log::error($e->getMessage());
                return response()->json(['error' => 'An error occurred'], 500);
            }
        }
        
     
    

    public function destroy($id)
    {
        try{
            $team = Team::findOrFail($id);
            $team->players()->detach();
            $team->delete();
    
            return response()->json(null, 204);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
      
    }
}
