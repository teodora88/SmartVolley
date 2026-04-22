<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberNote extends Model
{
    /** @use HasFactory<\Database\Factories\MemberNoteFactory> */
    use HasFactory;

    protected $fillable = [
        'body',
        'member_id'
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
