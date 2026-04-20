<?php

namespace Database\Factories;

use App\Enums\GroupCategory;
use App\Models\Group;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Group>
 */
class GroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'category' => fake()->randomElement(GroupCategory::cases()),
            'user_id' => User::where('role_as', 'coach')->pluck('id')->random(),
            'location_id' => Location::pluck('id')->random(),

        ];
    }
}
