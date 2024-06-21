<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Range extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function piece(): BelongsTo
    {
        return $this->belongsTo(Piece::class);
    }
    public function operations(): BelongsToMany
    {
        return $this->belongsToMany(Operation::class, 'range_operations', 'range_id', 'operation_id');
    }

    public function rangeProduces(): HasMany
    {
        return $this->hasMany(RangeProduce::class);
    }
}
