<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserPost;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        User::query()->create([
            'name' => $request['name'],
            'email' => $request['email'],
            'role_id' => $request['role_id'],
            'password' => bcrypt($request['password'])
        ]);

        return redirect()->route('users-admin');
    }

    public function update(Request $request, User $user): \Illuminate\Http\RedirectResponse
    {
        if ($user->role_id === "1") {
            UserPost::query()->where('user_id', $user->id)->delete();
        }

        $user->update([
            'name' => $request['name'],
            'email' => $request['email'],
            'role_id' => $request['role_id']
        ]);

        if ($request['password']) {
            $user->update([
                'password' => bcrypt($request['password'])
            ]);
        }

        if ($user->role_id === "1") {
            foreach ($request['posts'] as $post) {
                UserPost::query()->create([
                    "user_id" => $user->id,
                    "post_id" => $post,
                ]);
            }
        }

        return redirect()->route('users-admin');
    }

    public function destroy(User $user): \Illuminate\Http\RedirectResponse
    {
        $user->delete();

        return redirect()->route('users-admin');
    }
}
