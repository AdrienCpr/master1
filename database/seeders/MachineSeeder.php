<?php

namespace Database\Seeders;

use App\Models\Machine;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MachineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $machines = [
            'Scie circulaire',
            'Ponceuse à bande',
            'Perceuse à colonne',
            'Tour à bois',
            'Scie à ruban',
            'Raboteuse',
            'Dégauchisseuse',
            'Toupie',
            'Fraiseuse',
            'Scie sauteuse',
            'Scie à onglet',
            'Cisaille guillotine',
            'Plieuse de tôle',
            'Soudage MIG',
            'Soudage TIG',
            'Presse hydraulique',
            'Grue à portique',
            'Pont roulant',
            'Assembleuse automatique',
            'Imprimante 3D'
        ];

        foreach ($machines as $machine) {
            Machine::query()->create([
                'name' => $machine,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
