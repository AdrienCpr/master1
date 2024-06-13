<?php

namespace Database\Seeders;

use App\Models\PieceRef;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PieceRefSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pieceRefs = [];

        for ($i = 1; $i <= 5; $i++) {
            $pieceRefs[] = [
                'piece_to_create_id' => $i,
                'piece_need_id' => rand(6, 10),
                'quantity' => rand(10, 50),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        PieceRef::query()->insert($pieceRefs);
    }
}
