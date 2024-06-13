<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AtelierController;
use App\Http\Controllers\ComptabiliteController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Pieces.tsx');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('atelier')
    ->middleware(['auth','role:atelier'])
    ->group(function () {
        Route::get('/pieces', [AtelierController::class, 'pieces'])->name('pieces-atelier');
});

Route::prefix('comptabilite')
    ->middleware(['auth','role:comptabilite'])
    ->group(function () {
        Route::get('/dashboard', [ComptabiliteController::class, 'dashboard'])->name('dashboard-comptabilite');
});

Route::prefix('admin')
    ->middleware(['auth','role:admin'])
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard-admin');
    });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
