<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NoteImage;
use Illuminate\Http\Request;
use App\Services\CloudinaryService;
use Intervention\Image\ImageManager;
use Intervention\Image\Format;

class NoteImageController extends Controller
{
    protected ImageManager $manager;

    public function __construct(ImageManager $manager)
    {
        $this->manager = $manager;
    }

    private function compress($file)
    {
        $imageCompress = $this->manager->decode($file);

        $imageCompress->scale(width: 1200);

        $encode = $imageCompress->encodeUsingFormat(Format::WEBP, [
            'quality' => 75
        ]);

        $tempPath = sys_get_temp_dir() . '/' . uniqid() . '.webp';
        file_put_contents($tempPath, $encode);

        $upload = CloudinaryService::upload($tempPath, [
            'folder' => 'notes-app'
        ]);

        if(!$upload) {
            throw new \Exception('Upload to Cloudinary failed. Please try again later.');
        }

        unlink($tempPath);

        return $upload;
    }
    public function store(Request $request)
    {
        $request->validate([
            'note_id' => 'required',
            'image_url' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $file = $request->file('image_url');

        // Compress the file
        try {
            $upload = $this->compress($file);

            $image = NoteImage::create([
                'note_id' => $request->note_id,
                'image_url' => $upload['secure_url'],
                'public_id' => $upload['public_id'],
            ]);
        } catch(\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Image uploaded successfully',
            'image' => $image
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'image_url' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:10248',
        ]);

        $imageRecord = NoteImage::findOrFail($id);

        $oldPublicId = $imageRecord->public_id;

        // Compress the file
        try {
            $upload = $this->compress($request->file('image_url'));
        } catch(\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }

        if($oldPublicId) {
            CloudinaryService::delete($oldPublicId);
        }

        $imageRecord->update([
            'image_url' => $upload['secure_url'],
            'public_id' => $upload['public_id'],
        ]);

        return response()->json([
            'message' => 'Image uploaded successfully',
            'image' => $imageRecord
        ]);
    }

    public function destroy($id) {
        $image = NoteImage::findOrFail($id);

        if(!$image) {
            return response()->json([
                'message' => 'Image not found.'
            ], 404);
        }

        CloudinaryService::delete($image->public_id);

        $image->delete();

        return response()->json([
            'message' => 'Image deleted successfully.',
            'image' => [
                'id' => $image->id,
            ]
        ]);
    }

    public function index(Request $request) {
        $query = NoteImage::query();

        if($request->has('note_id')) {
            $query->where('note_id', $request->note_id);
        }

        return response()->json($query->get());
    }
}
