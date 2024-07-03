<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\Operation;
use App\Models\Piece;
use App\Models\PieceRef;
use App\Models\Post;
use App\Models\Range;
use App\Models\RangeProduce;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AtelierController extends Controller
{
    public function pieces(): \Inertia\Response
    {
        return Inertia::render('Atelier/Pieces',[
            'pieces' => Piece::query()->with(['ranges','piecesToCreate'])->get(),
            'piecesRef' => PieceRef::query()->get()
        ]);
    }

    public function employees(): \Inertia\Response
    {
        $workers = User::query()
            ->where('role_id', 1)
            ->with('posts')
            ->get();
        $managers = User::query()
            ->where('role_id', 4)
            ->whereHas('ranges')
            ->with('ranges.piece')
            ->get();

        return Inertia::render('Atelier/Employees', [
            'workers' => $workers,
            'managers' => $managers,
        ]);
    }

    public function ranges(): \Inertia\Response
    {
        $ranges = Range::with(['operations.post', 'operations.machine', 'user', 'piece','rangeProduces'])->get();

        return Inertia::render('Atelier/Ranges', [
            'ranges' => $ranges,
            'posts' => Auth::user()->posts()->get(),
            'machines' => Machine::query()->get(),
            'pieces' => Piece::query()->get(),
            'users' => User::query()->where("role_id", 4)->get(),
            'operations' => Operation::query()->get()
        ]);
    }

    public function rangesHistory(): \Inertia\Response
    {
        $rangesProduce = RangeProduce::with([
            'range',
            'range.user',
            'range.piece',
            'rangeProduceOperations',
            'rangeProduceOperations.operation',
            'rangeProduceOperations.machine',
            'rangeProduceOperations.post',
            'range.operations',
            'range.operations.post',
            'range.operations.machine'
        ])->get();

        return Inertia::render('Atelier/RangesHistory', [
            'rangesProduce' => $rangesProduce,
        ]);
    }

    public function operations(): \Inertia\Response
    {
        return Inertia::render('Atelier/Operations',[
            'operations' => Operation::query()->with(["ranges", "rangeProduceOperations"])->get(),
            'posts' => Post::query()->get(),
            'machines' => Machine::query()->get(),
        ]);
    }

    public function posts(): \Inertia\Response
    {
        return Inertia::render('Atelier/Posts',[
            'posts' => Post::query()->with(["machines", "operations","rangeProduceOperations"])->get()
        ]);
    }

    public function machines(): \Inertia\Response
    {
        return Inertia::render('Atelier/Machines',[
            'machines' => Machine::query()->with(["rangeProduceOperations", "operations"])->get(),
            'posts' => Post::query()->get()
        ]);
    }
}
