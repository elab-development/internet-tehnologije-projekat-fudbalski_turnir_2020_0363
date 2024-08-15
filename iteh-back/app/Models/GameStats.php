<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model as Eloquent;
use MongoDB\Laravel\Relations\BelongsTo;

class GameStats extends Eloquent
{

    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'game_stats';

   

    protected $fillable = [
        'broj_suteva_domacin', 
        'broj_suteva_gost', 
        'sut_u_okvir_domacin',
        'sut_van_okvira_domacin',
        'sut_u_okvir_gost',
        'sut_van_okvira_gost',
        'posed_lopte_domacin',
        'posed_lopte_gost',
        
    ];

    public function matches():BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}
