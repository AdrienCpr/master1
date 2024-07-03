<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AtelierController;
use App\Http\Controllers\CompanyOrderController;
use App\Http\Controllers\ComptabiliteController;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PieceController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\RangeController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Route::get('/', function () {
//    return Inertia::render('Welcome', [
//        'canLogin' => Route::has('login'),
//        'canRegister' => Route::has('register'),
//        'laravelVersion' => Application::VERSION,
//        'phpVersion' => PHP_VERSION,
//    ]);
//});

//Route::get('/dashboard', function () {
////    return Inertia::render('Pieces.tsx');
//    return redirect()->route('pieces-atelier');
//})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('atelier')
    ->middleware(['auth','role:atelier|responsable'])
    ->group(function () {
        Route::get('/pieces', [AtelierController::class, 'pieces'])->name('pieces-atelier');
        Route::post('/pieces', [PieceController::class, 'store'])->name('pieces.store');
        Route::get('/pieces/{piece}/edit', [PieceController::class, 'edit'])->name('pieces.edit');
        Route::put('/pieces/{piece}', [PieceController::class, 'update'])->name('pieces.update');
        Route::delete('/pieces/{piece}', [PieceController::class, 'destroy'])->name('pieces.destroy');

        Route::get('/employees', [AtelierController::class, 'employees'])->name('employees-atelier');

        Route::get('/ranges', [AtelierController::class, 'ranges'])->name('ranges-atelier');
        Route::post('/ranges', [RangeController::class, 'store'])->name('ranges.store');
        Route::get('/ranges/{range}/edit', [RangeController::class, 'edit'])->name('ranges.edit');
        Route::put('/ranges/{range}', [RangeController::class, 'update'])->name('ranges.update');
        Route::delete('/ranges/{range}', [RangeController::class, 'destroy'])->name('ranges.destroy');

        Route::post('/ranges/produce', [RangeController::class, 'produce'])->name('ranges.produce');

        Route::get('/ranges-history', [AtelierController::class, 'rangesHistory'])->name('ranges-history-atelier');

        Route::get('/operations', [AtelierController::class, 'operations'])->name('operations-atelier');
        Route::post('/operations', [OperationController::class, 'store'])->name('operations.store');
        Route::get('/operations/{operation}/edit', [OperationController::class, 'edit'])->name('operations.edit');
        Route::put('/operations/{operation}', [OperationController::class, 'update'])->name('operations.update');
        Route::delete('/operations/{operation}', [OperationController::class, 'destroy'])->name('operations.destroy');

        Route::get('/posts', [AtelierController::class, 'posts'])->name('posts-atelier');
        Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
        Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
        Route::put('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
        Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

        Route::get('/machines', [AtelierController::class, 'machines'])->name('machines-atelier');
        Route::post('/machines', [MachineController::class, 'store'])->name('machines.store');
        Route::get('/machines/{machine}/edit', [MachineController::class, 'edit'])->name('machines.edit');
        Route::put('/machines/{machine}', [MachineController::class, 'update'])->name('machines.update');
        Route::delete('/machines/{machine}', [MachineController::class, 'destroy'])->name('machines.destroy');

    });

Route::prefix('comptabilite')
    ->middleware(['auth','role:comptabilite'])
    ->group(function () {
        Route::get('/quotes', [ComptabiliteController::class, 'quotes'])->name('quotes-comptabilite');
        Route::post('/quotes', [QuoteController::class, 'store'])->name('quotes.store');
        Route::put('/quotes/{quote}/edit', [QuoteController::class, 'edit'])->name('quotes.update');
        Route::post('/clients', [QuoteController::class, 'client'])->name('clients.store');

        Route::get('/orders', [ComptabiliteController::class, 'orders'])->name('orders-comptabilite');
        Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
        Route::get('/orders/{id}/download', [OrderController::class, 'download'])->name('orders.download');

        Route::get('/company-orders', [ComptabiliteController::class, 'companyOrders'])->name('company-orders-comptabilite');
        Route::post('/company-orders', [CompanyOrderController::class, 'store'])->name('company-orders.store');
        Route::put('/company-orders/{companyOrder}/edit', [CompanyOrderController::class, 'edit'])->name('company-orders.update');
        Route::delete('/company-orders/{companyOrder}', [CompanyOrderController::class, 'delete'])->name('company-orders.destroy');
        Route::get('/company-orders/{yearMonth}', [CompanyOrderController::class, 'downloadCSV'])->name('company-order.csv');
        Route::post('/company-orders/suppliers', [CompanyOrderController::class, 'suppliers'])->name('suppliers.store');


    });

Route::prefix('admin')
    ->middleware(['auth','role:admin'])
    ->group(function () {
        Route::get('/users', [AdminController::class, 'users'])->name('users-admin');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });

//Route::middleware('auth')->group(function () {
//    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
//});

require __DIR__.'/auth.php';
