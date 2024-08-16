<?php

namespace App\Http\Resources;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\GameResource;
class TournamentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $user = Auth::user();
        $isFavorite = $user->tournaments()->where('_id',$this->id)->exists();

        return [
            'id' => $this->id,
            'name' => $this->ime,
            'place' => $this->mesto,
            'teams' => $this->broj_timova,
            'logo'=>$this->logo,
            'games' => GameResource::collection($this->matches),
            'isFavorite'=> $isFavorite
        ];
    }
}
