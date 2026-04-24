<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            LocationSeeder::class,
            GroupSeeder::class,
            ActivitySeeder::class,
            MemberSeeder::class,
            AttendanceSeeder::class,
            PaymentSeeder::class,
            MemberNoteSeeder::class,
            TournamentRegistrationSeeder::class,
        ]);
        
    }
}
