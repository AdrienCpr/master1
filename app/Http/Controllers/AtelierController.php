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

}
