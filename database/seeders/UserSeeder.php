<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->create([
            'name' => 'Atelier User',
            'email' => 'atelier@atelier.com',
            'role_id' => 1,
            'password' => bcrypt('password')
        ]);

        User::query()->create([
            'name' => 'Comptabilite User',
            'email' => 'comptabilite@comptabilite.com',
            'role_id' => 2,
            'password' => bcrypt('password')
        ]);

        User::query()->create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'role_id' => 3,
            'password' => bcrypt('password')
        ]);
    }
}
