<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TournamentRegistration extends Model
{
    /** @use HasFactory<\Database\Factories\TournamentRegistrationFactory> */
    use HasFactory;

    protected $fillable = [
        'is_registered',
        'activity_id',
        'member_id'
    ];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
