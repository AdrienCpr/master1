<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SuppliersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Supplier::query()->create([
            'name' => "Supplier 1"
        ]);

        Supplier::query()->create([
            'name' => "Supplier 2"
        ]);

        Supplier::query()->create([
            'name' => "Supplier 3"
        ]);

        Supplier::query()->create([
            'name' => "Supplier 4"
        ]);

        Supplier::query()->create([
            'name' => "Supplier 5"
        ]);
    }
}
