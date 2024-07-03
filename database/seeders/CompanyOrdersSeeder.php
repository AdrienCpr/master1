<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanyOrdersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'supplier_id' => 1,
                'date' => Carbon::create('2023', '01', '15'),
                'delivery_date' => Carbon::create('2023', '02', '15'),
                'real_delivery_date' => Carbon::create('2023', '02', '14'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'supplier_id' => 2,
                'date' => Carbon::create('2023', '03', '10'),
                'delivery_date' => Carbon::create('2023', '04', '10'),
                'real_delivery_date' => Carbon::create('2023', '04', '12'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('company_orders')->insert($data);
    }
}
