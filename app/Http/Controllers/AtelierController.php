<?php

namespace App\Http\Controllers;

use App\Models\Piece;
use App\Models\PieceRef;
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
        return Inertia::render('Atelier/Employees',[
        ]);
    }

    public function ranges(): \Inertia\Response
    {
        return Inertia::render('Atelier/Ranges',[
        ]);
    }

    public function rangesHistory(): \Inertia\Response
    {
        return Inertia::render('Atelier/RangesHistory',[
        ]);
    }

}
