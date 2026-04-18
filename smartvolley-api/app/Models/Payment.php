<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;

    protected $fillable = [
        'date',
        'month',
        'price',
        'is_paid',
        'member_id'
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
