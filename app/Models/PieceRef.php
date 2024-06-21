<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PieceRef extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function pieceToCreate(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Piece::class, 'piece_to_create_id');
    }

    public function pieceNeed(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Piece::class, 'piece_need_id');
    }
}
