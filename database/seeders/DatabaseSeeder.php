<?php

namespace Database\Seeders;

use App\Models\QuotePiece;
use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            PieceSeeder::class,
            PieceRefSeeder::class,
            PostSeeder::class,
            UserPostSeeder::class,
            RangeSeeder::class,
            MachineSeeder::class,
            OperationSeeder::class,
            RangeOperationSeeder::class,
            RangeProduceSeeder::class,
            RangeProduceOperationSeeder::class,
            QuotesSeeder::class,
            QuotesPiecesSeeder::class
        ]);
    }
}
