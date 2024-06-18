<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RangeProduce extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function range(): BelongsTo
    {
        return $this->belongsTo(Range::class);
    }
    public function rangeProduceOperations(): HasMany
    {
        return $this->hasMany(RangeProduceOperation::class);
    }
}
