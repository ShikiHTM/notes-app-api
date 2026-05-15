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
