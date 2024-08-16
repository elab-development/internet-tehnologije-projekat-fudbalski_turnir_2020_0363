<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;
class Tournament extends Eloquent
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $collection = 'tournaments';

    protected $fillable = [
        'ime', 
        'mesto', 
        'logo',
        'broj_timova',
        
    ];

    protected $casts = [
       
        
    ];



    public function teams():BelongsToMany{
        return $this->belongsToMany(Team::class);
    }


    public function matches():HasMany
    {
        return $this->hasMany(Game::class);
    }


    public function users():BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}

