<?php

namespace Database\Seeders;

use App\Models\Piece;
use App\Models\Range;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RangeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fabricatedPieces = Piece::query()->where('type', 'fabriqué')->get();
        $atelierResponsableUsers = User::query()->where('role_id', 4)->get();

        foreach ($fabricatedPieces as $piece) {
            $user = $atelierResponsableUsers->random();

            Range::query()->create([
                'user_id' => $user->id,
                'piece_id' => $piece->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
