<?php

namespace Database\Seeders;

use App\Models\Operation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OperationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $operations = [
            [
                "name" => "Découpe de bois",
                "time" => "08:00:00",
                "post_id" => 1,
                "machine_id" => 1
            ],
            [
                "name" => "Ponçage fin",
                "time" => "02:30:00",
                "post_id" => 2,
                "machine_id" => 2
            ],
            [
                "name" => "Assemblage des pièces",
                "time" => "04:15:00",
                "post_id" => 3,
                "machine_id" => 3
            ],
            [
                "name" => "Peinture des surfaces",
                "time" => "05:45:00",
                "post_id" => 4,
                "machine_id" => 4
            ],
            [
                "name" => "Vernissage",
                "time" => "03:30:00",
                "post_id" => 2,
                "machine_id" => 5
            ],
            [
                "name" => "Contrôle qualité",
                "time" => "02:00:00",
                "post_id" => 5,
                "machine_id" => 6
            ],
            [
                "name" => "Emballage final",
                "time" => "01:45:00",
                "post_id" => 6,
                "machine_id" => 7
            ],
            [
                "name" => "Assemblage mécanique",
                "time" => "06:30:00",
                "post_id" => 7,
                "machine_id" => 8
            ],
            [
                "name" => "Test fonctionnel",
                "time" => "03:15:00",
                "post_id" => 8,
                "machine_id" => 9
            ],
            [
                "name" => "Finition esthétique",
                "time" => "04:45:00",
                "post_id" => 9,
                "machine_id" => 10
            ]
        ];

        foreach ($operations as $operation) {
            Operation::query()->create([
                'name' => $operation['name'],
                'time' => $operation['time'],
                'post_id' => $operation['post_id'],
                'machine_id' => $operation['machine_id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
