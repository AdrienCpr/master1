<?php

namespace Database\Seeders;

use App\Models\Quote;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class QuotesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Quote::query()->create([
            'date' => Carbon::create('2024', '06', '25'),
            'date_limit' => Carbon::create('2024', '07', '25'),
            'user_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Quote::query()->create([
            'date' => Carbon::create('2024', '06', '26'),
            'date_limit' => Carbon::create('2024', '07', '26'),
            'user_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Quote::query()->create([
            'date' => Carbon::create('2024', '06', '27'),
            'date_limit' => Carbon::create('2024', '07', '27'),
            'user_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Quote::query()->create([
            'date' => Carbon::create('2024', '06', '28'),
            'date_limit' => Carbon::create('2024', '07', '28'),
            'user_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        Quote::query()->create([
            'date' => Carbon::create('2024', '06', '28'),
            'date_limit' => Carbon::create('2024', '07', '28'),
            'user_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Quote::query()->create([
            'date' => Carbon::create('2024', '06', '28'),
            'date_limit' => Carbon::create('2024', '07', '28'),
            'user_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Quote::query()->create([
            'date' => Carbon::create('2024', '06', '28'),
            'date_limit' => Carbon::create('2024', '07', '28'),
            'user_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Quote::query()->create([
            'date' => Carbon::create('2024', '06', '28'),
            'date_limit' => Carbon::create('2024', '07', '28'),
            'user_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Quote::query()->create([
            'date' => Carbon::create('2024', '06', '28'),
            'date_limit' => Carbon::create('2024', '07', '28'),
            'user_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Quote::query()->create([
            'date' => Carbon::create('2024', '06', '28'),
            'date_limit' => Carbon::create('2024', '07', '28'),
            'user_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Quote::query()->create([
            'date' => Carbon::create('2024', '06', '28'),
            'date_limit' => Carbon::create('2024', '07', '28'),
            'user_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
