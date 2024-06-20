<?php

namespace App\Http\Controllers;

use App\Models\Piece;
use App\Models\PieceRef;
use Illuminate\Http\Request;

class PieceController extends Controller
{
    public function store(Request $request)
    {
        $piece = Piece::query()->create([
            "ref" => $request["ref"],
            "name" => $request["name"],
            "type" => $request["type"],
            "price" => $request["price"],
        ]);

        foreach ($request['piece_refs'] as $pieceRef) {
            PieceRef::query()->create([
                'piece_to_create_id' => $piece->id,
                'piece_need_id' => $pieceRef['piece_need_id'],
                'quantity' => $pieceRef['quantity']
            ]);
        }

        return redirect()->route('pieces-atelier');
    }

    public function update(Request $request, Piece $piece)
    {
        $piece->update([
            "ref" => $request["ref"],
            "name" => $request["name"],
            "type" => $request["type"],
            "price" => $request["price"],
        ]);

        PieceRef::query()->where('piece_to_create_id', $piece->id)->delete();

        foreach ($request['piece_refs'] as $pieceRef) {
            PieceRef::query()->create([
                'piece_to_create_id' => $piece->id,
                'piece_need_id' => $pieceRef['piece_need_id'],
                'quantity' => $pieceRef['quantity']
            ]);
        }

        return redirect()->route('pieces-atelier');
    }

    public function destroy(Piece $piece)
    {
        $piece->delete();

        return redirect()->route('pieces-atelier');
    }
}
