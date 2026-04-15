<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Member>
 */
class MemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->firstName(),
            'last_name'=> fake()->lastName(),
            'birthday' => fake()->date(),
            'height' => fake()->randomFloat(2, 120, 200),
            'weight' => fake()->randomFloat(2, 30, 100),
            'note' =>fake()->optional()->sentence(),
            'user_id' => User::pluck('id')->random(),
            'group_id' => Group::pluck('id')->random(),
        ];
    }
}
