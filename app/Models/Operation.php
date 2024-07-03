<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Operation extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function ranges(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Range::class, 'range_operations', 'operation_id', 'range_id');
    }
    public function rangeProduceOperations()
    {
        return $this->hasMany(RangeProduceOperation::class);
    }
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }
}
