<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Intervention\Image\Format;
use Intervention\Image\ImageManager;

/**
 * @group Profile
 *
 * APIs for managing the authenticated user's avatar.
 */
class UserController extends Controller
{
    protected ImageManager $manager;

    public function __construct(ImageManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * Upload or replace the authenticated user's avatar.
     *
     * Compresses the file to WebP and stores it in Cloudinary.
     * @bodyParam avatar file required The image file (Max 5MB).
     * @authenticated
     */
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $user = $request->user();
        $oldPublicId = $user->pfp_public_id;

        try {
            $compressed = $this->manager->decode($request->file('avatar'))
                ->scale(width: 512)
                ->encodeUsingFormat(Format::WEBP, ['quality' => 80]);

            $tempPath = sys_get_temp_dir() . '/' . uniqid('avatar_') . '.webp';
            file_put_contents($tempPath, $compressed);

            $upload = CloudinaryService::upload($tempPath, [
                'folder' => 'notes-app/avatars',
            ]);

            unlink($tempPath);

            if (! $upload) {
                throw new \Exception('Upload to Cloudinary failed. Please try again later.');
            }
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        $user->pfp_url = $upload['secure_url'];
        $user->pfp_public_id = $upload['public_id'];
        $user->save();

        if ($oldPublicId) {
            CloudinaryService::delete($oldPublicId);
        }

        return response()->json($user);
    }
}
