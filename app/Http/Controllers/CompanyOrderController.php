<?php

namespace App\Http\Controllers;

use App\Exports\CompanyOrdersExport;
use App\Models\CompanyOrder;
use App\Models\CompanyOrderPiece;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Maatwebsite\Excel\Facades\Excel;

class CompanyOrderController extends Controller
{
    public function store(Request $request){
        $companyOrder = CompanyOrder::create([
            'date' => $request['date'],
            'delivery_date' => $request['delivery_date'],
            'real_delivery_date' => $request['real_delivery_date'],
            'supplier_id' => $request['supplier_id'],
        ]);

        foreach ($request['company_orders_pieces'] as $company_orders_piece) {
            $companyOrder->pieces()->create($company_orders_piece);
        }

        return redirect()->route('company-orders-comptabilite');
    }

    public function suppliers(Request $request){
        Supplier::create([
            'name' => $request['name'],
        ]);

        return redirect()->route('company-orders-comptabilite');
    }

    public function edit(Request $request, CompanyOrder $companyOrder): \Illuminate\Http\RedirectResponse
    {
        $companyOrder->update([
            'date' => $request['date'],
            'delivery_date' => $request['delivery_date'],
            'real_delivery_date' => $request['real_delivery_date'],
            'supplier_id' => $request['supplier_id'],
        ]);


        CompanyOrderPiece::query()->where('company_order_id', $companyOrder->id)->delete();

        foreach ($request['company_orders_pieces'] as $company_orders_piece) {
            CompanyOrderPiece::query()->create([
                "company_order_id" => $companyOrder->id,
                "piece_id" => $company_orders_piece["piece_id"],
                "price" => $company_orders_piece["price"],
                "quantity" => $company_orders_piece["quantity"],
            ]);
        }

        return redirect()->route('company-orders-comptabilite');
    }

    public function delete(Request $request, CompanyOrder $companyOrder): \Illuminate\Http\RedirectResponse
    {
        $companyOrder->delete();

        return redirect()->route('company-orders-comptabilite');
    }

    public function downloadCSV($yearMonth)
    {
        $year = substr($yearMonth, 0, 4);
        $month = substr($yearMonth, 5, 2);

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = Carbon::createFromDate($year, $month, 1)->endOfMonth();

        return Excel::download(new CompanyOrdersExport($startDate, $endDate), 'company_orders.csv');
    }
}
