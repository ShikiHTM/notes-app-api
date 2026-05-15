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
        $query = $request->user()->notes()
            ->whereNull('archived_at')
            ->select(['id', 'title', 'content', 'content_rich', 'is_pinned', 'pinned_at', 'created_at', 'color'])
            ->with(['labels', 'images']);

        if ($request->filled('label_id')) {
            $labelId = $request->input('label_id');
            $query->whereHas('labels', function ($q) use ($labelId) {
                $q->where('labels.id', $labelId);
            });
        }

        return $query->orderBy('is_pinned', 'desc')
            ->orderBy('pinned_at', 'desc')
            ->latest()
            ->get();
    }

    public function archived(Request $request)
    {
        return $request->user()->notes()
            ->whereNotNull('archived_at')
            ->select(['id', 'title', 'content', 'content_rich', 'is_pinned', 'pinned_at', 'created_at', 'archived_at', 'color'])
            ->with(['labels', 'images'])
            ->latest('archived_at')
            ->get();
    }

    public function trashed(Request $request)
    {
        return $request->user()->notes()
            ->onlyTrashed()
            ->select(['id', 'title', 'content', 'content_rich', 'is_pinned', 'pinned_at', 'created_at', 'deleted_at', 'color'])
            ->with(['labels', 'images'])
            ->latest('deleted_at')
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
            'content_rich' => 'nullable|string',
            'password' => 'nullable|string|min:4',
            'labels' => 'array',
            'labels.*' => 'exists:labels,id'
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $plain = $validated['content'] ?? null;
            if ($plain === null && !empty($validated['content_rich'])) {
                $plain = $this->extractPlainText($validated['content_rich']);
            }

            $note = $request->user()->notes()->create([
                'title' => $validated['title'] ?? 'Untitled',
                'content' => $plain ?? '',
                'content_rich' => $validated['content_rich'] ?? null,
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
            'content_rich' => 'sometimes|nullable|string',
            'is_pinned' => 'sometimes|boolean',
            'archived_at' => 'sometimes|nullable|date',
            'color' => 'sometimes|nullable|in:RED,CYAN,YELLOW,LIME,PURPLE,BLACK,WHITE',
            'labels' => 'sometimes|array',
            'labels.*' => 'integer|exists:labels,id',
        ]);

        if($request->user()->id !== $note->user_id) {
            return response()->json(['error' => 'Forbidden: you\'re not own this note'], 403);
        }

        if (isset($validated['is_pinned'])) {
            $validated['pinned_at'] = $validated['is_pinned'] ? now() : null;
        }

        // If rich content is provided and plain content isn't, derive plain text
        // from the Tiptap JSON so Meilisearch and previews stay accurate.
        if (array_key_exists('content_rich', $validated)
            && !array_key_exists('content', $validated)) {
            $validated['content'] = $this->extractPlainText($validated['content_rich']);
        }

        $labels = $validated['labels'] ?? null;
        unset($validated['labels']);

        $note->update($validated);

        if ($labels !== null) {
            $note->labels()->sync($labels);
        }

        $note->load('labels');

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
                ->select(['id', 'title', 'content', 'content_rich', 'is_pinned', 'pinned_at', 'created_at', 'color'])
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
        $note = Note::withTrashed()->findOrFail($id);

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

    /**
     * Extract plain text from a Tiptap/ProseMirror JSON document string.
     * Concatenates `text` node contents and inserts newlines at block boundaries.
     */
    private function extractPlainText(?string $rich): string
    {
        if (!$rich) return '';
        $doc = json_decode($rich, true);
        if (!is_array($doc)) return '';

        $blockTypes = ['paragraph', 'heading', 'listItem', 'blockquote', 'codeBlock'];

        $walk = function (array $node) use (&$walk, $blockTypes): string {
            $type = $node['type'] ?? null;

            if ($type === 'text') {
                return $node['text'] ?? '';
            }

            $parts = [];
            foreach ($node['content'] ?? [] as $child) {
                if (is_array($child)) {
                    $parts[] = $walk($child);
                }
            }
            $text = implode('', $parts);

            return in_array($type, $blockTypes, true) ? $text . "\n" : $text;
        };

        return trim($walk($doc));
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
