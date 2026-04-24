<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Member;
use App\Models\TournamentRegistration;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TournamentRegistration>
 */
class TournamentRegistrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'is_registered' => fake()->boolean(),
            'activity_id' => Activity::where('type', 'tournament')->pluck('id')->random(),
            'member_id' => Member::pluck('id')->random(),
        ];
    }
}
