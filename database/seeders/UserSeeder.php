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
        $users = [
            ['name' => 'Atelier User', 'email' => 'atelier@atelier.com', 'role_id' => 1],
            ['name' => 'Comptabilite User', 'email' => 'comptabilite@comptabilite.com', 'role_id' => 2],
            ['name' => 'Admin User', 'email' => 'admin@admin.com', 'role_id' => 3],
            ['name' => 'Atelier User 2', 'email' => 'atelier2@atelier.com', 'role_id' => 1],
            ['name' => 'Atelier User 3', 'email' => 'atelier3@atelier.com', 'role_id' => 1],
            ['name' => 'Atelier User 4', 'email' => 'atelier4@atelier.com', 'role_id' => 1],
            ['name' => 'Responsable User 1', 'email' => 'responsable1@atelier.com', 'role_id' => 4],
            ['name' => 'Responsable User 2', 'email' => 'responsable2@atelier.com', 'role_id' => 4],
            ['name' => 'Responsable User 3', 'email' => 'responsable3@atelier.com', 'role_id' => 4],
            ['name' => 'Responsable User 4', 'email' => 'responsable4@atelier.com', 'role_id' => 4],

        ];

        foreach ($users as $user) {
            User::query()->create([
                'name' => $user['name'],
                'email' => $user['email'],
                'role_id' => $user['role_id'],
                'password' => bcrypt('password')
            ]);
        }
    }
}
