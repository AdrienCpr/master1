<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Quote;
use App\Models\QuotePiece;
use App\Models\RangeOperation;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function store(Request $request)
    {
        $quote = Quote::create([
            'date' => $request['date'],
            'date_limit' => $request['date_limit'],
            'client_id' => $request['client_id'],
        ]);

        foreach ($request['quote_pieces'] as $quotePiece) {
            $quote->pieces()->create($quotePiece);
        }

        return redirect()->route('quotes-comptabilite');
    }

    public function edit(Request $request, Quote $quote): \Illuminate\Http\RedirectResponse
    {
        $quote->update([
            "date" => $request["date"],
            "date_limit" => $request["date_limit"],
            "client_id" => $request["client_id"]
        ]);


        QuotePiece::query()->where('quote_id', $quote->id)->delete();

        foreach ($request['quote_pieces'] as $quote_piece) {
            QuotePiece::query()->create([
                "quote_id" => $quote->id,
                "piece_id" => $quote_piece["piece_id"],
                "price" => $quote_piece["price"],
                "quantity" => $quote_piece["quantity"],
            ]);
        }

        return redirect()->route('quotes-comptabilite');
    }

    public function client(Request $request)
    {
        Client::create([
            'name' => $request['name'],
        ]);

        return redirect()->route('quotes-comptabilite');
    }

}
