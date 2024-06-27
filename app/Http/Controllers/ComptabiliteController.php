<?php

namespace App\Http\Controllers;

use App\Models\Piece;
use App\Models\Quote;
use App\Models\QuotePiece;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComptabiliteController extends Controller
{
    public function quotes(): \Inertia\Response
    {
        return Inertia::render('Comptabilite/Quotes',[
            'quotes' => Quote::query()->with(["pieces", "user", "pieces.piece"])->get(),
            'pieces' => QuotePiece::query()->get(),
            'piecesSelect' => Piece::query()->get(),
            'users' => User::query()->get()
        ]);
    }
}
