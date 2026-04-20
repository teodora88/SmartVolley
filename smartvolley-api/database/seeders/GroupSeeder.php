<?php

namespace Database\Seeders;

use App\Enums\GroupCategory;
use App\Models\Group;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Group::create(['name' => 'Skolica 1', 'category' => GroupCategory::SCHOOL, 'location_id' => 1, 'user_id' => 2]);
        Group::create(['name' => 'Skolica 2', 'category' => GroupCategory::SCHOOL, 'location_id' => 1, 'user_id' => 3]);
        Group::create(['name' => 'Pionirke', 'category' => GroupCategory::PIONEERS, 'location_id' => 1, 'user_id' => 2]);
        Group::create(['name' => 'Skolica 3', 'category' => GroupCategory::SCHOOL, 'location_id' => 2, 'user_id' => 4]);
    }
}
