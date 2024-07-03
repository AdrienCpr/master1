<?php

namespace Database\Seeders;

use App\Models\OrderPiece;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderPiecesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orderPieces = [
            [
                'piece_id' => 1,
                'order_id' => 1,
                'price' => 10.99,
                'quantity' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($orderPieces as $orderPieceData) {
            OrderPiece::query()->create($orderPieceData);
        }
    }
}
