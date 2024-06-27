<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        dd($request->all());
        $quote = Order::create([
            'date' => $request['date'],
            'date_limit' => $request['date_limit'],
            'user_id' => $request['user_id'],
        ]);

        foreach ($request['quote_pieces'] as $quotePiece) {
            $order->pieces()->create($quotePiece);
        }

        return redirect()->route('orders-comptabilite');
    }
}
