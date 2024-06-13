<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard(): \Inertia\Response
    {
        return Inertia::render('Admin/Pieces');
    }
}
