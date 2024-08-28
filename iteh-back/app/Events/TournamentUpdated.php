<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Http\Resources\TournamentResource;
class TournamentUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;
    public $tournament_id;

    public function __construct($tournament_id)
    {
        $this->tournament_id = $tournament_id;
    }

    public function broadcastOn()
    {
        return new Channel('tournament.' . $this->tournament_id);
    }

    public function broadcastAs()
    {
        return 'tournament-stats-updated';
    }

    public function broadcastWith()
    {
        return [
            'data' => $this->tournament_id
        ];
    }
}
