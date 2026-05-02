<?php

namespace App\Http\Controllers\Api;

use App\Events\NoteDeleted;
use App\Events\NoteMetadataUpdated;
use App\Http\Controllers\Controller;
use App\Models\Note;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * @group Note Management
 *
 * APIs for managing personal notes, including metadata and real-time content synchronization.
 */
class NoteController extends Controller
{
    /**
     * List all notes.
     *
     * Retrieves a list of notes with labels and image metadata.
     * @queryParam label_id int Filter notes by a specific label ID.
     * @authenticated
     */
    public function index(Request $request)
    {
        return $request->user()->notes()
            ->select(['id', 'title', 'content', 'is_pinned', 'pinned_at', 'created_at'])
            ->with(['labels', 'images']) // Eager loading
            ->orderBy('is_pinned', 'desc')
            ->orderBy('pinned_at', 'desc')
            ->latest()
            ->get();
    }

    /**
     * Create a note.
     *
     * Initializes a new note record.
     * @bodyParam title string The title of the note. Defaults to "Untitled".
     * @bodyParam content string Plain text summary/preview.
     * @bodyParam password string Optional 4+ digit PIN.
     * @bodyParam labels int[] Array of label IDs. Example: [1, 2]
     * @authenticated
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'password' => 'nullable|string|min:4',
            'labels' => 'array',
            'labels.*' => 'exists:labels,id'
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $note = $request->user()->notes()->create([
                'title' => $validated['title'] ?? 'Untitled',
                'content' => $validated['content'] ?? '',
                'password' => !empty($validated['password']) ? Hash::make($validated['password']) : null,
            ]);

            if (!empty($validated['labels'])) {
                $note->labels()->attach($validated['labels']);
            }

            return response()->json($note->load('labels'), 201);
        });
    }

    /**
     * View note details.
     * @urlParam id int required The Note ID.
     * @authenticated
     */
    public function show(Request $request, string $id)
    {
        $note = Note::with(['labels', 'images'])->findOrFail($id);

        if ($request->user()->id !== $note->user_id) {
            return response()->json(['error' => 'Forbidden: You are not allowed to view this note.'], 403);
        }

        return response()->json($note);
    }

    /**
     * Update note or sync content.
     *
     * This endpoint handles both metadata updates (title, pinning) and Yjs binary synchronization.
     * @bodyParam binary_state string Base64 encoded Yjs update.
     * @bodyParam plain_text string Updated plain text content for searching.
     * @bodyParam is_pinned boolean Toggle pin status.
     * @authenticated
     */
    public function update(Request $request, string $id)
    {
        //
        $note = Note::findOrFail($id);

        if ($request->has('binary_state')) {
            $note->update([
                'content_binary' => base64_decode($request->binary_state),
                'content' => $request->plain_text,
            ]);
            return response()->json(['status' => 'synced']);
        }

        $validated = $request->validate([
            'title' => 'sometimes|nullable|string|max:255',
            'content' => 'sometimes|string|nullable',
            'is_pinned' => 'sometimes|boolean',
        ]);

        if($request->user()->id !== $note->user_id) {
            return response()->json(['error' => 'Forbidden: you\'re not own this note'], 403);
        }

        if (isset($validated['is_pinned'])) {
            $validated['pinned_at'] = $validated['is_pinned'] ? now() : null;
        }

        $note->update($validated);

        broadcast(new NoteMetadataUpdated($note))->toOthers();

        return response()->json($note);
    }

    /**
     * Search notes.
     *
     * Full-text search across title and content using Meilisearch.
     * @queryParam q string required The search query.
     * @authenticated
     */
    public function search(Request $request)
    {
        $q = trim($request->query('q', ''));

        if ($q === '') {
            return response()->json([]);
        }

        try {
            $noteIds = Note::search($q)
                ->where('user_id', $request->user()->id)
                ->keys();

            $notes = Note::with(['labels', 'images'])
                ->whereIn('id', $noteIds)
                ->select(['id', 'title', 'content', 'is_pinned', 'pinned_at', 'created_at'])
                ->orderBy('is_pinned', 'desc')
                ->orderBy('pinned_at', 'desc')
                ->latest()
                ->get();

            return response()->json($notes);
        } catch (\Exception) {
            return response()->json([]);
        }
    }

    /**
     * Delete a note.
     * @urlParam id int required The Note ID.
     * @authenticated
     */
    public function destroy(Request $request, string $id)
    {
        $note = Note::findOrFail($id);

        if($request->user()->id !== $note->user_id) {
            return response()->json(['error' => 'Forbidden: you\'re not own this note'], 403);
        }

        $note->delete();
        broadcast(new NoteDeleted($note))->toOthers();
        return response()->json(null, 204);
    }

    public function forceDestroy(Request $request, string $id) {
        $note = Note::findOrFail($id);

        if($request->user()->id !== $note->user_id) {
            return response()->json(['error' => 'Forbidden: you\'re not own this note'], 403);
        }

        $note->forceDelete();
        return response()->json(null, 204);
    }

    public function restore(Request $request, string $id) {
        $note = Note::withTrashed()->findOrFail($id);

        if($request->user()->id !== $note->user_id) {
            return response()->json(['error' => 'Forbidden: you\'re not own this note'], 403);
        }

        $note->restore();
        return response()->json($note);
    }

    public function handleYjsWebhook(Request $request)
    {
        $id = str_replace('note-', '', $request->input('documentName'));
        $base64Data = $request->input('data');

        $note = Note::findOrFail($id);

        if ($note) {
            $note->content_binary = base64_decode($base64Data);
            $note->save();

            return response()->json(['status' => 'saved']);
        }

        return response()->json(['status' => 'not found'], 404);
    }
}
