<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $roles)
    {
        $user = Auth::user()->load('role');
        $rolesArray = explode('|', $roles);

        if (!in_array($user->role->name, $rolesArray)) {
            return redirect('/')->with('error', 'You do not have access to this page');
        }

        return $next($request);
    }
}
