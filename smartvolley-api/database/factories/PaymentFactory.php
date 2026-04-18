<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'month' => fake()->date('m-Y'),
            'price' => fake()->randomFloat(2, 1500, 3000),
            'is_paid' => $is_paid = fake()->boolean(70),
            'date' => $is_paid ? fake()->date() : null,
            'member_id' => Member::pluck('id')->random(),
        ];
    }
}
