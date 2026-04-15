<?php

namespace App\Models;

use App\Enums\GroupCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    /** @use HasFactory<\Database\Factories\GroupFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'location_id',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'category' => GroupCategory::class,
        ];
    }

    public function members()
    {
        return $this->hasMany(Member::class);
    }
}
