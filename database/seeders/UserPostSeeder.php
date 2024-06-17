<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\UserPost;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserPostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $atelierUsers = User::query()->where('role_id', 1)->get();
        $posts = Post::all();

        foreach ($atelierUsers as $user) {
            $assignedPosts = $posts->random(rand(1, $posts->count()));

            foreach ($assignedPosts as $post) {
                UserPost::query()->create([
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
