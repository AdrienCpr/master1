<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanyOrderPiecesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'piece_id' => 1,
                'company_order_id' => 1,
                'price' => 100.50,
                'quantity' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'piece_id' => 2,
                'company_order_id' => 1,
                'price' => 200.75,
                'quantity' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'piece_id' => 1,
                'company_order_id' => 2,
                'price' => 150.00,
                'quantity' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('company_order_pieces')->insert($data);
    }
}
