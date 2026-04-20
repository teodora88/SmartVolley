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
        $activity = Activity::where('type', 'practice')->inRandomOrder()->first();

        return [
            'is_present' => $is_present = fake()->boolean(80), 
            'excuse' => $is_present ? null : fake()->optional()->sentence(),
            'activity_id' => $activity->id,
            'member_id' => Member::where('group_id', $activity->group_id)->pluck('id')->random(),
        ];
    }
}
