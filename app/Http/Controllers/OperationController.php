<?php

namespace App\Http\Controllers;

use App\Models\Operation;
use Illuminate\Http\Request;

class OperationController extends Controller
{
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        Operation::query()->create([
            "name" => $request['name'],
            "time" => $request['time'],
            "post_id" => $request['post_id'],
            "machine_id" => $request['machine_id'],
        ]);

        return redirect()->route('operations-atelier');
    }

    public function update(Request $request, Operation $operation): \Illuminate\Http\RedirectResponse
    {
        $operation->update([
            "name" => $request["name"],
            "time" => $request['time'],
            "post_id" => $request['post_id'],
            "machine_id" => $request['machine_id'],
        ]);

        return redirect()->route('operations-atelier');
    }

    public function destroy(Operation $operation): \Illuminate\Http\RedirectResponse
    {
        $operation->delete();

        return redirect()->route('operations-atelier');
    }
}
