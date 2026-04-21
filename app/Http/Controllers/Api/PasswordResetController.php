<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ForgotPasswordMail;
use App\Models\User;
use Carbon\Carbon;
use DB;
use Hash;
use Illuminate\Http\Request;
use Mail;
use Str;

/**
 * @group Authentication
 *
 * APIs for managing forgotten passwords and recovery links.
 */
class PasswordResetController extends Controller
{
    /**
     * Request reset link.
     *
     * Sends a password reset email to the user if the account exists.
     * @bodyParam email string required Valid email address.
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);

        // Check if email is existed
        $user = User::where('email', $request->email)->first();

        if ($user) {
            $token = Str::random(64);

            DB::table('password_reset_tokens')->updateOrInsert([
                'email' => $request->email,
                'token' => hash('sha256', $token),
                'created_at' => now(),
            ]);

            // Send via Mailtrap

            $url = "https://shikii.dev/reset-password?token={$token}&email={$request->email}";

            Mail::to($request->email)->queue(new ForgotPasswordMail($url));
        }

        return response()->json([
            'message' => 'If your email is in our system, you will receive a reset link shortly!',
        ]);
    }

    /**
     * Reset password.
     *
     * Validates the token and updates the user's password.
     * @bodyParam token string required The token from the reset email.
     * @bodyParam email string required Valid email address.
     * @bodyParam password string required New password.
     * @bodyParam password_confirmation string required Must match password.
     */
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|string|email',
            'password' => 'required|string|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$record || !hash_equals($record->token, hash('sha256', $request->token))) {
            return response()->json([
                'message' => 'This password reset token is invalid.',
            ]);
        }

        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['error' => 'This password reset token is expired.'], 422);
        }

        $user = User::where('email', $request->email);

        if ($user) {
            $user->update(['password' => Hash::make($request->password)]);
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
        }

        return response()->json([
            'message' => 'Your password has been changed successfully.',
        ]);
    }
}
