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
            'role_as' => UserRole::ADMIN,
        ]);

        User::factory(12)->create();
    }
}
