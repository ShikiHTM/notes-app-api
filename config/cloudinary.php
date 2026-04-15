<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cloudinary Connection
    |--------------------------------------------------------------------------
    */
    'name' => env('CLOUDINARY_NAME', 'Cloudinary'),
    'api_key' => env('CLOUDINARY_API_KEY', ''),
    'api_secret' => env('CLOUDINARY_API_SECRET', ''),
    'secure' => env('CLOUDINARY_API_SECURE', false),
];
