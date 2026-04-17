<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Attendance;
use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'is_present' => $is_present = fake()->boolean(),
            'excuse' => $is_present ? null : fake()->optional()->sentence(),
            'activity_id' => Activity::pluck('id')->random(),
            'member_id' => Member::pluck('id')->random(),
        ];
    }
}
