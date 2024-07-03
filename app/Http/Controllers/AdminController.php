<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function users(): \Inertia\Response
    {
        return Inertia::render('Admin/Users', [
            'users' => User::query()->with(['role','posts','ranges'])->get(),
            'posts' => Post::query()->get(),
            'roles' => Role::query()->get()
        ]);
    }
}
