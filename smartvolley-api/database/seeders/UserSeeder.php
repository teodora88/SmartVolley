<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Teodora',
            'last_name' => 'Nikolic',
            'username' => 'teodora_admin',
            'password' => Hash::make('admin123'),
            'phone_number' => '+381678787878',
            'role_as' => UserRole::ADMIN,
        ]);

        User::factory(3)->create(['role_as' => UserRole::COACH]);
        User::factory(60)->create(['role_as' => UserRole::PARENT]);
    }
}
