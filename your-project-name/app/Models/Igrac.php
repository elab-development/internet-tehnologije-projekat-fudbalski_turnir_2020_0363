<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;

class Igrac extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'igraci';
    protected $fillable = ['imeprezime', 'broj', 'statistika'];
}
