<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Note extends Model {
    use HasFactory, Searchable, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'content_rich',
        'is_pinned',
        'pinned_at',
        'archived_at',
        'deleted_at',
        'password',
        'content_binary',
        'color',
    ];

    protected $hidden = [
        'password'
    ];

    protected $appends = [
        'is_locked',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'pinned_at' => 'datetime'
    ];

    public function getIsLockedAttribute(): bool
    {
        return !empty($this->password);
    }

    // Yjs state is a binary BLOB; serialize as base64 so JSON encoding
    // doesn't choke on non-UTF8 bytes. The setter still accepts raw bytes
    // (see NoteController::update / handleYjsWebhook).
    public function getContentBinaryAttribute($value): ?string
    {
        return $value !== null ? base64_encode($value) : null;
    }

    /**
     * Strip protected content from a locked note before serializing.
     * Mutates the model in place; returns it for chaining.
     */
    public function redactIfLocked(): self
    {
        if ($this->is_locked) {
            $this->content = null;
            $this->content_rich = null;
            if ($this->relationLoaded('images')) {
                $this->setRelation('images', collect());
            }
        }
        return $this;
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function labels() {
        return $this->belongsToMany(Label::class, 'label_note');
    }

    public function images() {
        return $this->hasMany(NoteImage::class);
    }

    public function sharedWith() {
        return $this->belongsToMany(User::class, 'note_shares')->withPivot('permission', 'shared_at');
    }

    /**
     * Permission level a given user has on this note.
     * - "OWNER" if user owns the note
     * - "READ_AND_WRITE" / "READ" if shared via note_shares
     * - null if no access
     */
    public function permissionFor(?User $user): ?string
    {
        if (!$user) return null;
        if ($this->user_id === $user->id) return 'OWNER';
        $share = $this->sharedWith()->where('users.id', $user->id)->first();
        return $share?->pivot->permission;
    }

    public function isReadableBy(?User $user): bool
    {
        return $this->permissionFor($user) !== null;
    }

    public function isWritableBy(?User $user): bool
    {
        $perm = $this->permissionFor($user);
        return $perm === 'OWNER' || $perm === 'READ_AND_WRITE' || $perm === 'WRITE';
    }

    public function toSearchableArray(): array
    {
        return [
            'id'      => $this->id,
            'user_id' => $this->user_id,
            'title'   => $this->title ?? '',
            'content' => $this->content ?? '',
        ];
    }

    public function getScoutIndexSettings(): array
    {
        return [
            'filterableAttributes' => ['user_id'],
            'searchableAttributes' => ['title', 'content'],
        ];
    }
}
