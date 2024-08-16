<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Relations\HasOne;
use MongoDB\Laravel\Relations\HasMany;
use MongoDB\Laravel\Eloquent\Model as Eloquent;
use MongoDB\Laravel\Relations\BelongsTo;
class Game extends Eloquent
{
    use HasFactory;


    protected $connection = 'mongodb';
    protected $collection = 'games';

    protected $fillable = [
        'broj_utakmice',
        'broj_golova_domacin',
        'broj_golova_gost',
        'tim1',
        'tim2',
        'pobednik',
        'tournament_id',
        'status'
     
       
    ];

    public function stats_game():HasOne
    {
        return $this->hasOne(GameStats::class);
    }

    public function stats_player():HasMany{
        return $this->hasMany(PlayerStats::class);
    }
    

    public function tournament():BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    public function team1():BelongsTo
    {
        return $this->belongsTo(Team::class, 'tim1');
    }

    public function team2():BelongsTo
    {
        return $this->belongsTo(Team::class, 'tim2');
    }

    public function winner():BelongsTo
    {
        return $this->belongsTo(Team::class, 'pobednik');
    }
}
