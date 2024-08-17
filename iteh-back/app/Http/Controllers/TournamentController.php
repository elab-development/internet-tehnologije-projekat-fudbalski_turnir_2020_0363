<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\TournamentResource;
use App\Models\Tournament;
use Illuminate\Http\Request;
use MongoDB\Driver\Exception\Exception as MongoDBException;


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

    }
   
    
    
    

    public function show($id)
    {
        try{
            $tournament = Tournament::findOrFail($id);
            //return new TournamentResource($tournament);
            return response()->json($tournament, 200);
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

  

  
}
