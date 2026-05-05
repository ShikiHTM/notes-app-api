<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // TODO: Admin only endpoint to list all users, with pagination and search by display_name or email
        $users = User::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('display_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->paginate(10);

        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $request->validate([
            'display_name' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|unique:users,email,' . $request->user()->id,
            'pfp_url' => 'nullable|url|max:255',
        ]);

        // If nothing is provided, do nothing;
        if(!$request->hasAny(['display_name', 'email', 'pfp_url']))
        {
            return response()->json([
                'message' => 'No changes provided'
            ], 400);
        }

        $user = $request->user();

        if ($request->has('display_name'))
        {
            $user->display_name = $request->display_name;
        }

        else if ($request->has('email'))
        {
            $user->email = $request->email;
            $user->email_verified_at = null;
            $user->sendEmailVerificationNotification();
        }

        else if ($request->has('pfp_url'))
        {
            $user->pfp_url = $request->pfp_url;
        }

        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        $user->delete();

        return response()->json(null, 204);
    }
}
