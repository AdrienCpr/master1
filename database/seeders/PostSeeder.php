<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = [
            'Coupeur du bois',
            'Scieur',
            'Ponceur',
            'Peintre',
            'Vernisseur',
            'Menuisier',
            'Ebéniste',
            'Fraiseur',
            'Soudeur',
            'Electricien',
            'Plombier',
            'Technicien de maintenance',
            'Monteur',
            'Opérateur CNC',
            'Opérateur de presse',
            'Opérateur robotique',
            'Inspecteur qualité',
            'Superviseur de production',
            'Planificateur de production',
            'Ingénieur de production',
        ];

        foreach ($posts as $post) {
            Post::query()->create([
                'name' => $post,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
