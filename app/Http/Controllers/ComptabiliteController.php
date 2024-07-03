<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\CompanyOrder;
use App\Models\Order;
use App\Models\Piece;
use App\Models\Quote;
use App\Models\QuotePiece;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComptabiliteController extends Controller
{
    public function quotes(): \Inertia\Response
    {
        return Inertia::render('Comptabilite/Quotes',[
            'quotes' => Quote::query()->with(["pieces", "client", "pieces.piece"])->get(),
            'pieces' => QuotePiece::query()->get(),
            'piecesSelect' => Piece::query()->get(),
            'clients' => Client::query()->get()
        ]);
    }

    public function orders(): \Inertia\Response
    {
        return Inertia::render('Comptabilite/Orders',[
            'orders' => Order::query()->with(["pieces", "client", "pieces.piece"])->get(),
        ]);
    }

    public function companyOrders(): \Inertia\Response
    {
        return Inertia::render('Comptabilite/CompanyOrders',[
            'companyOrders' => CompanyOrder::query()->with(["pieces", "supplier", "pieces.piece"])->get(),
            'suppliers' => Supplier::query()->get(),
            'pieces' => Piece::query()->get()
        ]);
    }
}
