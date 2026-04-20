<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Location::create([
            'name' => 'OS Nikola Tesla',
            'address' => 'Banatsko Karadjordjevo',
        ]);

        Location::create([
            'name' => 'OS Milos Crnjanski',
            'address' => 'Srpski Itebej',
        ]);
    }
}
