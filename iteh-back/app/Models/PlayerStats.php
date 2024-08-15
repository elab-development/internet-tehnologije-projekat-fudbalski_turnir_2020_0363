<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model as Eloquent;
use MongoDB\Laravel\Relations\BelongsTo;

class PlayerStats extends Eloquent
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'player_stats';


    protected $fillable = [
        'broj_golova', 
        'broj_asistencija', 
        'broj_zutih_kartona',
        'broj_crvenih_kartona',
        'broj_suta_u_ovkir',
        'broj_suta_van_okvira',
        'player_id',
        'game_id'
        
    ];

    public function player():BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function game():BelongsTo
    {
        return $this->belongsTo(Game::class);
    }


}
