<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Piece extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function ranges(): HasMany
    {
        return $this->hasMany(Range::class);
    }
    public function piecesNeeded(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Piece::class, 'piece_refs', 'piece_to_create_id', 'piece_need_id')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    public function piecesToCreate(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Piece::class, 'piece_refs', 'piece_need_id', 'piece_to_create_id')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
