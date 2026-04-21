<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Label;
use Illuminate\Http\Request;

/**
 * @group Label Management
 *
 * APIs for organizing notes with colorful tags.
 */
class LabelController extends Controller
{
    /**
     * Get all labels.
     * @authenticated
     */
    public function index(Request $request)
    {
        return $request->user()->labels()
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Create a label.
     * @bodyParam name string required Example: Personal
     * @bodyParam color string Hex color code. Example: #6200ee
     * @authenticated
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'color' => [
                'nullable',
                'string',
                'regex:/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/', // Hex color
            ]
        ]);

        $label = $request->user()->labels()->create($validated);

        return response()->json($label, 201);
    }

    /**
     * Update label details.
     * @urlParam id int required The Label ID.
     * @authenticated
     */
    public function update(Request $request, string $id)
    {
        $label = Label::findOrFail($id);

        if ($request->user()->id !== $label->user_id) {
            return response()->json(['error' => 'Forbidden: You are not allowed to update this label.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'color' => [
                'sometimes',
                'string',
                'regex:/^#(a-fA-F0-9){6}|[a-fA-F0-9]{3}' // Hex color
            ],
        ]);

        $label->update($validated);

        return response()->json($label);
    }

    /**
     * Delete a label.
     * @urlParam id int required The Label ID.
     * @authenticated
     */
    public function destroy(Request $request, string $id)
    {
        $label = Label::findOrFail($id);

        if ($request->user()->id !== $label->user_id) {
            return response()->json(['error' => 'Forbidden: You are not allowed to delete this label.'], 403);
        }

        $label->delete();

        return response()->json(null, 204);
    }
}
