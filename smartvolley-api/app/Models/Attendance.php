<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    /** @use HasFactory<\Database\Factories\AttendanceFactory> */
    use HasFactory;

    protected $fillable = [
        'is_present',
        'excuse',
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
