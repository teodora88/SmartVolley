<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    /** @use HasFactory<\Database\Factories\LocationFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'address'
    ];

    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }
}
