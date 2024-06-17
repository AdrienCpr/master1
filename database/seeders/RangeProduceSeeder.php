<?php

namespace Database\Seeders;

use App\Models\Range;
use App\Models\RangeProduce;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RangeProduceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ranges = Range::all();

        foreach ($ranges as $range){
            $numProductions = rand(1, 5);

            for ($i = 0; $i < $numProductions; $i++) {
                RangeProduce::query()->create([
                    "range_id" => $range->id
                ]);
            }
        }
    }
}
