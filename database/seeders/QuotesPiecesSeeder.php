<?php

namespace Database\Seeders;

use App\Models\QuotePiece;
use Illuminate\Database\Seeder;

class QuotesPiecesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        QuotePiece::query()->create([
            'piece_id' => 1,
            'quote_id' => 1,
            'price' => 100.50,
            'quantity' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        QuotePiece::query()->create([
            'piece_id' => 3,
            'quote_id' => 1,
            'price' => 100.50,
            'quantity' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        QuotePiece::query()->create([
            'piece_id' => 5,
            'quote_id' => 1,
            'price' => 100.50,
            'quantity' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        QuotePiece::query()->create([
            'piece_id' => 1,
            'quote_id' => 2,
            'price' => 200.75,
            'quantity' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        QuotePiece::query()->create([
            'piece_id' => 5,
            'quote_id' => 2,
            'price' => 200.75,
            'quantity' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        QuotePiece::query()->create([
            'piece_id' => 2,
            'quote_id' => 2,
            'price' => 200.75,
            'quantity' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        QuotePiece::query()->create([
            'piece_id' => 3,
            'quote_id' => 1,
            'price' => 150.00,
            'quantity' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        QuotePiece::query()->create([
            'piece_id' => 4,
            'quote_id' => 3,
            'price' => 250.20,
            'quantity' => 5,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
