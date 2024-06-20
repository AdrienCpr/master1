<?php

namespace App\Http\Controllers;

use App\Models\Range;
use App\Models\RangeOperation;
use App\Models\RangeProduce;
use App\Models\RangeProduceOperation;
use Doctrine\DBAL\Exception\DatabaseDoesNotExist;
use Illuminate\Http\Request;

class RangeController extends Controller
{
    public function store(Request $request)
    {
        $range = Range::query()->create([
            "piece_id" => $request["piece_id"],
            "user_id" => $request["user_id"]
        ]);

        foreach ($request['range_operations'] as $range_operation) {
            RangeOperation::query()->create([
                'range_id' => $range->id,
                'operation_id' => $range_operation['operation_id'],
            ]);
        }

        return redirect()->route('ranges-atelier');
    }

    public function produce(Request $request)
    {
        $range_produce = RangeProduce::query()->create([
            "range_id" => $request["range_id"],
        ]);

        foreach ($request['operations'] as $range_operation) {
            RangeProduceOperation::query()->create([
                'range_produce_id' => $range_produce->id,
                'operation_id' => $range_operation['id'],
                'post_id' => $range_operation['post_id'],
                'machine_id' => $range_operation['machine_id'],
                'time' => $range_operation['time'],
            ]);
        }

        return redirect()->route('ranges-atelier');
    }

    public function update(Request $request, Range $range)
    {
        $range->update([
            "piece_id" => $request["piece_id"],
            "user_id" => $request["user_id"]
        ]);

        RangeOperation::query()->where('range_id', $range->id)->delete();

        foreach ($request['range_operations'] as $range_operation) {
            RangeOperation::query()->create([
                "range_id" => $range->id,
                "operation_id" => $range_operation["operation_id"],
            ]);
        }

        return redirect()->route('ranges-atelier');
    }

    public function destroy(Range $range)
    {
        $range->delete();

        return redirect()->route('ranges-atelier');
    }
}
