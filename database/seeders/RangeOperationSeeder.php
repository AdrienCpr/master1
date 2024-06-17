<?php

namespace Database\Seeders;

use App\Models\Operation;
use App\Models\Range;
use App\Models\RangeOperation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RangeOperationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ranges = Range::all();
        $operations = Operation::all();

        foreach ($ranges as $range) {
            $numberOfOperations = rand(1, 5);
            $selectedOperations = $operations->random($numberOfOperations);

            foreach ($selectedOperations as $operation) {
                RangeOperation::query()->create([
                    'range_id' => $range->id,
                    'operation_id' => $operation->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
