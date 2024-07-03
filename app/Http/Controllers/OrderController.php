<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $order = Order::query()->create([
            'date' => Carbon::today()->toDateString(),
            'client_id' => $request['client_id'],
        ]);

        foreach ($request['pieces'] as $orderPiece) {
            $order->pieces()->create($orderPiece);
        }

        return redirect()->route('orders-comptabilite');
    }

    public function download($id)
    {
        $order = Order::with('client', 'pieces.piece')->findOrFail($id);

        $pdf = Pdf::loadView('invoices.pdf', compact('order'));

        return $pdf->download('invoice.pdf');
    }
}
