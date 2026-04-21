<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Note extends Model {
    use HasFactory;
    use SoftDeletes;
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
}
