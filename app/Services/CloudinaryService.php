<?php

namespace App\Services;

use Cloudinary\Api\ApiResponse;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;
use Exception;

class CloudinaryService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
    }

    private static function init(): void
    {
        Configuration::instance([
            'cloud' => [
                'cloud_name' => config('cloudinary.name'),
                'api_key' => config('cloudinary.api_key'),
                'api_secret' => config('cloudinary.api_secret'),
            ],
            'url' => [
                'secure' => config('cloudinary.secure'),
            ],
        ]);
    }

    public static function upload($file, $options = []): ?ApiResponse
    {
        self::init();
        try {

            $upload = new UploadApi();
            return $upload->upload($file, $options);

        } catch(Exception $e) {

            \Log::error("Cloudinary upload error: " . $e->getMessage());
            return null;

        }
    }

    public static function delete($publicId): ?ApiResponse
    {
        if($publicId) return null;

        self::init();

        try {
            $upload = new UploadApi();

            $response = $upload->destroy($publicId);

            if($response['result'] === 'not found') {
                \Log::info("Cloudinary delete: Image not found for ID: {$publicId}");
            }

            return $response;
        } catch (Exception $e) {
            \Log::error("Cloudinary delete error: " . $e->getMessage());
            return null;
        }
    }
}
