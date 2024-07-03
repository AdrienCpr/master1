<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyOrderPiece extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function piece()
    {
        return $this->belongsTo(Piece::class);
    }

    /**
     * Get the company order that owns the company order piece.
     */
    public function companyOrder()
    {
        return $this->belongsTo(CompanyOrder::class);
    }
}
