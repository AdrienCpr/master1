<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\Post;
use Illuminate\Http\Request;

class MachineController extends Controller
{
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        Machine::query()->create([
            "name" => $request['name'],
            "post_id" => $request['post_id']
        ]);

        return redirect()->route('machines-atelier');
    }

    public function update(Request $request, Machine $machine): \Illuminate\Http\RedirectResponse
    {
        $machine->update([
            "name" => $request["name"],
            "post_id" => $request["post_id"]
        ]);

        return redirect()->route('machines-atelier');
    }

    public function destroy(Machine $machine): \Illuminate\Http\RedirectResponse
    {
        $machine->delete();

        return redirect()->route('machines-atelier');
    }
}
