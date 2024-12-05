<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Http\Resources\GameResource;

class MatchStatsUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public $game_id;

    public function __construct($game_id)
    {
        $this->game_id = $game_id;
    }

    public function broadcastOn()
    {
        return new Channel('game.' . $this->game_id);
    }

    public function broadcastAs()
    {
        return 'match-stats-updated';
    }

    public function broadcastWith()
    {
        return [
            'data' => $this->game_id
        ];
    }
}
