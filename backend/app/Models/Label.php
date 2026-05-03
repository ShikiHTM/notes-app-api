<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Label extends Model {
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function notes() {
        return $this->belongsToMany(Note::class, 'label_note');
    }
}
