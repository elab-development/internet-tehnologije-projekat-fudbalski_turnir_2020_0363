<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameStatsResource extends JsonResource
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
        'broj_suteva_domacin'=>$this->broj_suteva_domacin,
        'broj_suteva_gost'=>$this->broj_suteva_gost, 
        'sut_u_okvir_domacin'=>$this->sut_u_okvir_domacin ,
        'sut_van_okvira_domacin'=>$this-> sut_van_okvira_domacin,
        'sut_u_okvir_gost'=>$this-> sut_u_okvir_gost,
        'sut_van_okvira_gost'=>$this-> sut_van_okvira_gost,
        'posed_lopte_domacin'=>$this-> posed_lopte_domacin,
        'posed_lopte_gost'=>$this-> posed_lopte_gost
           
        ];
    }
}