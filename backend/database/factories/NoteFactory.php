<?php

namespace Database\Factories;

use App\Models\Note;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class NoteFactory extends Factory
{
    protected $model = Note::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->word(),
            'content' => $this->faker->word(),
            'is_pinned' => $this->faker->boolean(),
            'pinned_at' => Carbon::now(),
            'password' => bcrypt($this->faker->password()),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'user_id' => User::factory(),
        ];
    }
}
