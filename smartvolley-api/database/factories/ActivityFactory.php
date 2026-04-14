<?php

namespace Database\Factories;

use App\Enums\ActivityStatus;
use App\Enums\ActivityType;
use App\Models\Activity;
use App\Models\Group;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Activity>
 */
class ActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => fake()->date(), 
            'time' => fake()->time(),
            'type' => fake()->randomElement(ActivityType::cases()),
            'status' => fake()-> randomElement(ActivityStatus::cases()),
            'group_id' => Group::pluck('id')->random(),
            'location_id' => $locationId = fake()->boolean() ? Location::pluck('id')->random() : null,
            'other_location' => $locationId ? null : fake()->streetAddress(),
        ];
    }
}
