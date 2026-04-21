<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use App\Models\User;

/**
 * @group Authentication
 *
 * APIs for email verification and notification resending.
 */
class VerificationController extends Controller
{
    /**
     * Resend verification email.
     * @authenticated
     */
    public function resend(Request $request) {
        if($request->user()->hasVerifiedEmail()) {
            return response()->json(["message" => "Email already verified"], 409);
        };

        $request->user()->sendEmailVerificationNotification();

        return response()->json(["message" => "Email verification link sent to your email address"], 200);
    }

    /**
     * Verify email address.
     *
     * Validates the signed URL sent to the user's email.
     * @urlParam id int required The User ID.
     * @urlParam hash string required The verification hash.
     */
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
