<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
            'display_name' => 'required|string|min:3|max:255|unique:users,display_name',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'display_name' => $request->display_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->sendEmailVerificationNotification();

        $token = $user->createToken('access_token')->plainTextToken;

        return response()->json([
            'message' => 'register successfully',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
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
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only(['email', 'password']))) {
            return response()->json([
                'error' => 'Wrong email or password',
            ], 401);
        }

        $user = Auth::user();

        $user->tokens()->delete();

        $token = $user->createToken('access_token')->plainTextToken;

        return response()->json([
            'message' => 'login successfully',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 200);
    }

    /**
     * User Logout.
     *
     * Revokes the current access token and clears the auth cookie.
     * @authenticated
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'logout successfully',
        ]);
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

    /**
     * Update Current Profile.
     *
     * Updates the authenticated user's display name and/or email.
     * Changing the email resets the verification status and sends a new verification email.
     *
     * @authenticated
     * @bodyParam name string The new display name. Example: John Doe
     * @bodyParam email string The new email address. Example: john@example.com
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|min:3|max:255|unique:users,display_name,' . $user->id,
            'email' => 'sometimes|required|string|email|unique:users,email,' . $user->id,
        ]);

        if (array_key_exists('name', $validated)) {
            $user->display_name = $validated['name'];
        }

        $emailChanged = false;
        if (array_key_exists('email', $validated) && $validated['email'] !== $user->email) {
            $user->email = $validated['email'];
            $user->email_verified_at = null;
            $emailChanged = true;
        }

        $user->save();

        if ($emailChanged) {
            $user->sendEmailVerificationNotification();
        }

        return response()->json($user);
    }

    /**
     * Check username availability.
     *
     * Returns whether a display_name is available for registration.
     * @bodyParam username string required Display name to check. Example: john_doe
     */
    public function checkUsername(Request $request)
    {
        $request->validate([
            'username' => 'required|string|min:3|max:255',
        ]);

        $exists = User::where('display_name', $request->username)->exists();

        return response()->json([
            'available' => !$exists,
        ]);
    }
}
