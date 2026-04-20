<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $name = fake()->firstName(),
            'last_name' => $last_name = fake()->lastName(),
            'username' => "{$name}_{$last_name}_" . fake()->randomNumber(5),
            'password' => static::$password ??= Hash::make('password'),
            'phone_number' => '+381' . fake()->numerify('6#########'),
            'role_as' => UserRole::PARENT,
            'remember_token' => Str::random(10),
        ];
    }
}
