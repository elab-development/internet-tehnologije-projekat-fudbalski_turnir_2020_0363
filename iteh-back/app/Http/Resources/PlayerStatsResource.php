<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlayerStatsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
        'id'=>$this->_id,
        'broj_golova'=>$this->broj_golova,
        'broj_asistencija'=>$this->broj_asistencija,
        'broj_zutih_kartona'=>$this->broj_zutih_kartona,
        'broj_crvenih_kartona'=>$this->broj_crvenih_kartona,
        'broj_suta_u_ovkir'=>$this->broj_suta_u_ovkir,
        'broj_suta_van_okvira'=>$this->broj_suta_van_okvira,
        'player_id'=>$this->player_id,
        'game_id'=>$this->game_id
           
        ];
    }
}