<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = [
            [
                'name' => 'Client 1',
            ],
            [
                'name' => 'Client 2',
            ],
            [
                'name' => 'Client 3',
            ],
            [
                'name' => 'Client 4',
            ]
        ];

        foreach ($clients as $client){
            Client::query()->create($client);
        }
    }
}
