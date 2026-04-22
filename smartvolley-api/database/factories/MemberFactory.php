<?php

namespace Database\Factories;

//use App\Models\Group;
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
            'name' => fake()->firstName('female'),
            'last_name'=> fake()->lastName(),
            'birthday' => fake()->dateTimeBetween('2012-01-01', '2019-12-31')->format('Y-m-d'),
            'height' => fake()->randomFloat(2, 130, 175),
            'weight' => fake()->randomFloat(2, 25, 65),
            'user_id' => User::where('role_as', 'parent')->pluck('id')->random(),
            //'group_id' => Group::pluck('id')->random(),
        ];
    }
}
