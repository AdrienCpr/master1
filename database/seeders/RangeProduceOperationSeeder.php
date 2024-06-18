<?php

namespace Database\Seeders;

use App\Models\Machine;
use App\Models\Operation;
use App\Models\Post;
use App\Models\RangeProduce;
use App\Models\RangeProduceOperation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RangeProduceOperationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rangeProduces = RangeProduce::with('range')->get();
        $machines = Machine::all();
        $posts = Post::all();

        foreach ($rangeProduces as $rangeProduce) {
            $operations = $rangeProduce->range->operations;

            foreach ($operations as $operation) {
                RangeProduceOperation::query()->create([
                    'range_produce_id' => $rangeProduce->id,
                    'operation_id' => $operation->id,
                    'machine_id' => $machines->random()->id,
                    'post_id' => $posts->random()->id,
                    'time' => now()->subMinutes(rand(1, 480))->format('H:i:s'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
