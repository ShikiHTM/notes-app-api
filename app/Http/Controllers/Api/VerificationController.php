<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use App\Models\User;

class VerificationController extends Controller
{
    public function resend(Request $request) {
        if($request->user()->hasVerifiedEmail()) {
            return response()->json(["message" => "Email already verified"], 409);
        };

        $request->user()->sendEmailVerificationNotification();

        return response()->json(["message" => "Email verification link sent to your email address"], 200);
    }

    public function verify(Request $request) {
        if(!$request->hasValidSignature()) {
            return response()->json(["message" => "Link expired or invalid"], 401);
        };

        $user = User::findOrFail($request->route('id'));

        if($user->hasVerifiedEmail()) {
            return response()->json(["message" => "Email already verified"], 409);
        };

        $user->markEmailAsVerified();
        event(new Verified($user));

        return response()->json(["message" => "Verified successfully"], 200);
    }
}
