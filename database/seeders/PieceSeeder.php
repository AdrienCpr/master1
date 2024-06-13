<?php

namespace Database\Seeders;

use App\Models\Piece;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PieceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $typesNeed = ['matières premières', 'acheté'];
        $pieces = [];

        for ($i = 1; $i <= 5; $i++) {
            $pieces[] = [
                'ref' => 'P' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => 'Piece ' . Str::random(5),
                'type' => 'fabriqué',
                'price' => rand(100, 200),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        for ($i = 6; $i <= 10; $i++) {
            $pieces[] = [
                'ref' => 'P' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => 'Piece ' . Str::random(5),
                'type' => $typesNeed[array_rand($typesNeed)],
                'price' => rand(100, 200),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Piece::query()->insert($pieces);
    }
}
