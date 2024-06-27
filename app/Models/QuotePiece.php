<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuotePiece extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function piece(): BelongsTo
    {
        return $this->belongsTo(Piece::class);
    }
}
