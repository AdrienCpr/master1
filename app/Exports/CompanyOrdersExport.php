<?php

namespace App\Exports;

use App\Models\CompanyOrder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\Exportable;

class CompanyOrdersExport implements FromQuery, WithHeadings, ShouldAutoSize
{
    use Exportable;

    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function query()
    {
        return CompanyOrder::query()
            ->with(['pieces', 'supplier'])
            ->whereBetween('date', [$this->startDate, $this->endDate]);
    }

    public function headings(): array
    {
        return [
            'Company Order ID',
            'Supplier',
            'Date',
            'Delivery Date',
            'Real Delivery Date',
            'Piece',
            'Price',
            'Quantity',
        ];
    }

    public function map($order): array
    {
        $rows = [];

        foreach ($order->pieces as $piece) {
            $rows[] = [
                $order->id,
                $order->supplier->name,
                $order->date->format('Y-m-d'), // Format date as needed
                $order->delivery_date->format('Y-m-d'), // Format date as needed
                $order->real_delivery_date->format('Y-m-d'), // Format date as needed
                $piece->piece->name,
                $piece->price,
                $piece->quantity,
            ];
        }

        return $rows;
    }
}
