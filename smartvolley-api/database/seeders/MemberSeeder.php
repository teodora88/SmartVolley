<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Member::factory(18)->create(['group_id' => 1]);
        Member::factory(18)->create(['group_id' => 2]);
        Member::factory(17)->create(['group_id' => 3]);
        Member::factory(17)->create(['group_id' => 4]);
    }
}
