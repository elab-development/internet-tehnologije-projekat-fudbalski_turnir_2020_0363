<?php



namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;
class Player extends Eloquent
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $collection = 'players';

    protected $fillable = [
        'imePrezime', 
        'godine', 
        
    ];

    protected $casts = [
       
    ];

    public function stats_player():HasMany
    {
        return $this->hasMany(PlayerStats::class);
    }


    public function team():BelongsToMany
    {
        return $this->belongsToMany(Team::class);
    }
}
