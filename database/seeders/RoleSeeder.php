<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::query()->create([
            'name' => "atelier"
        ]);

        Role::query()->create([
            'name' => "comptabilite"
        ]);

        Role::query()->create([
            'name' => "admin"
        ]);
    }
}
