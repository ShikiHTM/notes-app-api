<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NoteImage extends Model {
    use HasFactory;

    protected $fillable = [
        'image_url',
    ];

    public function note() {
        return $this->belongsTo('notes');
    }
}