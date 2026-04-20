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
            'date' => fake()->dateTimeBetween('2026-01-01', '2026-04-20')->format('Y-m-d'),
            'time' => fake()->randomElement([
                '16:00:00',
                '17:30:00',
                '19:00:00',
            ]),
            'type' => $type = fake()->randomElement([
                ActivityType::PRACTICE,
                ActivityType::PRACTICE,
                ActivityType::PRACTICE,
                ActivityType::PRACTICE,
                ActivityType::PRACTICE,
                ActivityType::PRACTICE,
                ActivityType::PRACTICE,
                ActivityType::GAME,
                ActivityType::GAME,
                ActivityType::TOURNAMENT,
            ]),
            'status' => fake()->randomElement([
                ActivityStatus::COMPLETED,
                ActivityStatus::COMPLETED,
                ActivityStatus::COMPLETED,
                ActivityStatus::COMPLETED,
                ActivityStatus::SCHEDULED,
                ActivityStatus::CANCELED,
            ]),
            'group_id' => Group::pluck('id')->random(),
            'location_id' => $type === ActivityType::PRACTICE ? Location::pluck('id')->random() : null,
            'other_location' => $type !== ActivityType::PRACTICE ? fake()->streetAddress() : null,
        ];
    }
}
