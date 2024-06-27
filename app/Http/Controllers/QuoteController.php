<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function store(Request $request)
    {
        $quote = Quote::create([
            'date' => $request['date'],
            'date_limit' => $request['date_limit'],
            'user_id' => $request['user_id'],
        ]);

        foreach ($request['quote_pieces'] as $quotePiece) {
            $quote->pieces()->create($quotePiece);
        }

        return redirect()->route('quotes-comptabilite');
    }
}
