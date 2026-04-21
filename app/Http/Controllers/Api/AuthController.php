<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

/**
 * @group Authentication
 * APIs for user registration, login, and session management.
 */
class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * Creates a new user account and sends a verification email.
     *
     * @bodyParam display_name string required The name shown on the profile. Example: John Doe
     * @bodyParam email string required Must be a unique email address. Example: john@example.com
     * @bodyParam password string required Minimum 6 characters. Example: secret123
     */
    public function register(Request $request)
    {
        $request->validate([
            'display_name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6'
        ]);

        $user = User::create([
            'display_name' => $request->display_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->sendEmailVerificationNotification();

        $token = $user->createToken('auth_token')->plainTextToken;

        $cookie = cookie(
            'auth_token',
            $token,
            60 * 24 * 7,
            '/',
            null,
            config('app.env') === 'production',
            true
        );

        return response()->json([
            'message' => 'register successfully',
            'user' => $user
        ], 201)->withCookie($cookie);
    }

    /**
     * User Login.
     *
     * Authenticates credentials and returns an auth_token via a secure cookie.
     *
     * @bodyParam email string required Example: john@example.com
     * @bodyParam password string required Example: secret123
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Wrong email or password'
            ], 401);
        }

        // Create a JWT
        $token = $user->createToken('auth_token')->plainTextToken;

        $cookie = cookie(
            'auth_token',
            $token,
            60 * 24 * 7,
            '/',
            null,
            config('app.env') === 'production',
            true
        );

        return response()->json([
            'message' => 'login successfully',
        ], 200)->withCookie($cookie);
    }

    /**
     * User Logout.
     *
     * Revokes the current access token and clears the auth cookie.
     * @authenticated
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'logout successfully'
        ])->withoutCookie('auth_token');
    }

    /**
     * Get Current Profile.
     *
     * Returns the authenticated user's details.
     * @authenticated
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
