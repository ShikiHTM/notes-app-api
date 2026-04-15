<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NoteImage extends Model {
    use HasFactory;

    protected $fillable = [
        'note_id',
        'image_url',
        'public_id',
    ];

    protected $hidden = [
        'public_id'
    ];

    public function note() {
        return $this->belongsTo(Note::class);
    }
}
