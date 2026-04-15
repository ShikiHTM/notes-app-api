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

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request) {
        $request->validate([
            'email' => 'required|string|email',
        ]);

        // Check if email is existed

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert([
            'email' => $request->email,
            'token' => hash('sha256', $token),
            'created_at' => now()
        ]);

        // Send via Mailtrap

        $url = "https://shikii.dev/api/reset-password?token={$token}&email={$request->email}";

        Mail::to($request->email)->send(new ForgotPasswordMail($url));

        return response()->json([
            'message' => 'We have sent your password reset link!'
        ]);
    }

    public function resetPassword(Request $request) {
        $request->validate([
            'token' => 'required',
            'email' => 'required|string|email',
            'password' => 'required|string|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if(!$record || !hash_equals($record->token, hash('sha256', $request->token))) {
            Carbon::parse($record->created_at)->addMinutes(60)->isPast();
            return response()->json([
                'message' => 'This password reset token is invalid.'
            ]);
        }

        User::where('email', $request->email)->update([
            'password' => Hash::make($request->password)
        ]);

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Your password has been changed.'
        ]);
    }
}
