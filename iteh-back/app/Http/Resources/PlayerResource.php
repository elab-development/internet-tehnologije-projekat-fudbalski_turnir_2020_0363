<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PlayerStatsResource;

class PlayerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $gameId = $request->route('id'); 
    

        
        $playerStats = $this->stats_player()->firstWhere('game_id', $gameId);
        
       

        return [
            'id' => $this->id,
            'name' => $this->imePrezime,
            'number' => $this->godine,
            'player_stats' => $playerStats ? new PlayerStatsResource($playerStats) : null,
            'cumulative_stats' => $this->cumulative_stats,
        ];
    }
}
