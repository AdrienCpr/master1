<?php

namespace App\Http\Controllers;

use App\Models\Piece;
use App\Models\PieceRef;
use App\Models\Range;
use App\Models\User;
use Inertia\Inertia;

class AtelierController extends Controller
{
    public function pieces(): \Inertia\Response
    {
        return Inertia::render('Atelier/Pieces',[
            'pieces' => Piece::query()->get(),
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
            ->where('role_id', 1)
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
        $ranges = Range::with(['operations.post', 'operations.machine', 'user', 'piece'])->get();

        return Inertia::render('Atelier/Ranges', [
            'ranges' => $ranges,
        ]);
    }

    public function rangesHistory(): \Inertia\Response
    {
        return Inertia::render('Atelier/RangesHistory',[
        ]);
    }

}
