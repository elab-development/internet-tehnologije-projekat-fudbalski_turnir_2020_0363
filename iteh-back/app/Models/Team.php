<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;

class Team extends Eloquent

{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $collection = 'teams';

    protected $fillable = [
        'ime', 
        
    ];


    public function games():HasMany{
        return $this->hasMany(Game::class);
    }

    public function tournaments():BelongsToMany{
        return $this->belongsToMany(Tournament::class);
    }



    

    public function players():BelongsToMany
    {
        return $this->belongsToMany(Player::class);
    }
}
