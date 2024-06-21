<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        Post::query()->create([
           "name" => $request['name']
        ]);

        return redirect()->route('posts-atelier');
    }

    public function update(Request $request, Post $post): \Illuminate\Http\RedirectResponse
    {
        $post->update([
            "name" => $request["name"]
        ]);

        return redirect()->route('posts-atelier');
    }

    public function destroy(Post $post): \Illuminate\Http\RedirectResponse
    {
        $post->delete();

        return redirect()->route('posts-atelier');
    }
}
