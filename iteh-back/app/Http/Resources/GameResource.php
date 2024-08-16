<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status'=>$this->status,
            'num_game' => $this->broj_utakmice,
            'goals_home' => $this->broj_golova_domacin,
            'goals_away'=>$this->broj_golova_gost,
            'home_team' => new TeamResource($this->team1),
            'away_team' => new TeamResource($this->team2),
            'winner' => new TeamResource($this->winner),
            'game_stats'=>new GameStatsResource($this->stats_game)
           
        ];
    }
}