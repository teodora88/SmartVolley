<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\MemberNote;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MemberNote>
 */
class MemberNoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'body' => fake()->text(), 
            'member_id' => Member::pluck('id')->random(),
        ];
    }
}
