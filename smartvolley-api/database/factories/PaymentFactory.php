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
            'month' => fake()->dateTimeBetween('2026-01-01', '2026-04-20')->format('m-Y'),
            'price' => fake()->randomElement([
                2600,
                2600,
                2600,
                2600,
                1300,
            ]),
            'is_paid' => $is_paid = fake()->boolean(70),
            'date' => $is_paid ? fake()->dateTimeBetween('2026-01-01', '2026-04-20')->format('Y-m-d') : null,
            'member_id' => Member::pluck('id')->random(),
        ];
    }
}
