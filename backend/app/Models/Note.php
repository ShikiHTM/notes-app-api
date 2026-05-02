<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Note extends Model {
    use HasFactory, Searchable;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'is_pinned',
        'pinned_at',
        'password',
        'content_binary'
    ];

    protected $hidden = [
        'password'
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'pinned_at' => 'datetime'
    ];

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
