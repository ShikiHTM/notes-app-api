<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * @group Note Sharing
 *
 * APIs for sharing notes with other users and managing permissions.
 */
class NoteShareController extends Controller
{
    private const PERMISSIONS = ['READ', 'READ_AND_WRITE'];

    /**
     * List the users a note is shared with.
     * @urlParam id int required The Note ID.
     * @authenticated
     */
    public function index(Request $request, string $id)
    {
        $note = Note::findOrFail($id);

        if ($request->user()->id !== $note->user_id) {
            return response()->json(['error' => 'Forbidden.'], 403);
        }

        $shares = $note->sharedWith()
            ->select('users.id', 'users.display_name', 'users.email', 'users.pfp_url')
            ->get()
            ->map(function ($user) {
                return [
                    'user_id' => $user->id,
                    'display_name' => $user->display_name,
                    'email' => $user->email,
                    'pfp_url' => $user->pfp_url,
                    'permission' => $user->pivot->permission,
                    'shared_at' => $user->pivot->shared_at,
                ];
            });

        return response()->json($shares);
    }

    /**
     * Share a note with one or more users by email.
     *
     * @urlParam id int required The Note ID.
     * @bodyParam emails string[] required Array of registered email addresses.
     * @bodyParam permission string required One of: READ, READ_AND_WRITE.
     * @authenticated
     */
    public function store(Request $request, string $id)
    {
        $request->validate([
            'emails' => 'required|array|min:1',
            'emails.*' => 'email',
            'permission' => 'required|in:' . implode(',', self::PERMISSIONS),
        ]);

        $note = Note::findOrFail($id);

        if ($request->user()->id !== $note->user_id) {
            return response()->json(['error' => 'Forbidden.'], 403);
        }

        $emails = array_unique($request->input('emails'));
        $permission = $request->input('permission');

        $users = User::whereIn('email', $emails)->get();
        $foundEmails = $users->pluck('email')->all();
        $notFound = array_values(array_diff($emails, $foundEmails));

        // Don't allow sharing with yourself
        $users = $users->filter(fn ($u) => $u->id !== $request->user()->id);

        $attached = [];
        $updated = [];

        foreach ($users as $user) {
            $existing = $note->sharedWith()
                ->where('users.id', $user->id)
                ->exists();

            if ($existing) {
                $note->sharedWith()->updateExistingPivot($user->id, [
                    'permission' => $permission,
                    'shared_at' => now(),
                ]);
                $updated[] = $user->email;
            } else {
                $note->sharedWith()->attach($user->id, [
                    'permission' => $permission,
                    'shared_at' => now(),
                ]);
                $attached[] = $user->email;
            }
        }

        return response()->json([
            'message' => 'Share updated',
            'added' => $attached,
            'updated' => $updated,
            'not_found' => $notFound,
        ]);
    }

    /**
     * Update the permission for an existing share.
     * @urlParam id int required The Note ID.
     * @urlParam userId int required The recipient user ID.
     * @bodyParam permission string required One of: READ, READ_AND_WRITE.
     * @authenticated
     */
    public function update(Request $request, string $id, string $userId)
    {
        $request->validate([
            'permission' => 'required|in:' . implode(',', self::PERMISSIONS),
        ]);

        $note = Note::findOrFail($id);

        if ($request->user()->id !== $note->user_id) {
            return response()->json(['error' => 'Forbidden.'], 403);
        }

        $exists = $note->sharedWith()
            ->where('users.id', $userId)
            ->exists();

        if (!$exists) {
            return response()->json(['error' => 'Share not found.'], 404);
        }

        $note->sharedWith()->updateExistingPivot($userId, [
            'permission' => $request->input('permission'),
        ]);

        return response()->json(['message' => 'Permission updated']);
    }

    /**
     * Revoke a share.
     * @urlParam id int required The Note ID.
     * @urlParam userId int required The recipient user ID.
     * @authenticated
     */
    public function destroy(Request $request, string $id, string $userId)
    {
        $note = Note::findOrFail($id);

        if ($request->user()->id !== $note->user_id) {
            return response()->json(['error' => 'Forbidden.'], 403);
        }

        $note->sharedWith()->detach($userId);

        return response()->json(null, 204);
    }

    /**
     * List notes shared with the authenticated user.
     * @authenticated
     */
    public function sharedWithMe(Request $request)
    {
        $user = $request->user();

        $notes = $user->sharedNotes()
            ->with(['labels', 'images', 'user:id,display_name,email,pfp_url'])
            ->whereNull('archived_at')
            ->whereNull('deleted_at')
            ->orderBy('notes.is_pinned', 'desc')
            ->orderBy('notes.pinned_at', 'desc')
            ->latest('notes.created_at')
            ->get()
            ->each
            ->redactIfLocked();

        // Append permission from pivot for the frontend
        $notes->each(function ($note) {
            $note->shared_permission = $note->pivot->permission ?? null;
            $note->shared_at = $note->pivot->shared_at ?? null;
        });

        return response()->json($notes);
    }
}
