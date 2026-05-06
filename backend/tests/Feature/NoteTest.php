<?php

namespace Tests\Feature;

use App\Models\Note;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class NoteTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_notes(): void
    {
        $user = $this->createUser();
        Note::factory()->count(3)->create(['user_id' => $user->id, 'password' => null]);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/notes')
            ->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_user_only_sees_own_notes(): void
    {
        $user = $this->createUser();
        $other = $this->createUser();

        Note::factory()->count(2)->create(['user_id' => $user->id, 'password' => null]);
        Note::factory()->count(3)->create(['user_id' => $other->id, 'password' => null]);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/notes')
            ->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_user_can_create_note(): void
    {
        $user = $this->createUser();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/notes', [
                'title' => 'My Note',
                'content' => 'Some content',
            ])
            ->assertStatus(201)
            ->assertJson(['title' => 'My Note']);

        $this->assertDatabaseHas('notes', ['title' => 'My Note', 'user_id' => $user->id]);
    }

    public function test_note_defaults_to_untitled(): void
    {
        $user = $this->createUser();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/notes', [])
            ->assertStatus(201)
            ->assertJson(['title' => 'Untitled']);
    }

    public function test_user_can_create_note_with_labels(): void
    {
        $user = $this->createUser();
        $label = $user->labels()->create(['name' => 'Work', 'color' => '#ff0000']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/notes', [
                'title' => 'Tagged Note',
                'labels' => [$label->id],
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('label_note', ['label_id' => $label->id]);
    }

    public function test_user_can_view_own_note(): void
    {
        $user = $this->createUser();
        $note = Note::factory()->create(['user_id' => $user->id, 'password' => null]);

        $this->actingAs($user, 'sanctum')
            ->getJson("/api/v1/notes/{$note->id}")
            ->assertStatus(200)
            ->assertJson(['id' => $note->id]);
    }

    public function test_user_cannot_view_others_note(): void
    {
        $owner = $this->createUser();
        $other = $this->createUser();
        $note = Note::factory()->create(['user_id' => $owner->id, 'password' => null]);

        $this->actingAs($other, 'sanctum')
            ->getJson("/api/v1/notes/{$note->id}")
            ->assertStatus(403);
    }

    public function test_user_can_update_note(): void
    {
        Event::fake();
        $user = $this->createUser();
        $note = Note::factory()->create(['user_id' => $user->id, 'password' => null]);

        $this->actingAs($user, 'sanctum')
            ->putJson("/api/v1/notes/{$note->id}", ['title' => 'Updated Title'])
            ->assertStatus(200)
            ->assertJson(['title' => 'Updated Title']);
    }

    public function test_user_cannot_update_others_note(): void
    {
        Event::fake();
        $owner = $this->createUser();
        $other = $this->createUser();
        $note = Note::factory()->create(['user_id' => $owner->id, 'password' => null]);

        $this->actingAs($other, 'sanctum')
            ->putJson("/api/v1/notes/{$note->id}", ['title' => 'Hacked'])
            ->assertStatus(403);
    }

    public function test_user_can_pin_note(): void
    {
        Event::fake();
        $user = $this->createUser();
        $note = Note::factory()->create(['user_id' => $user->id, 'is_pinned' => false, 'password' => null]);

        $this->actingAs($user, 'sanctum')
            ->putJson("/api/v1/notes/{$note->id}", ['is_pinned' => true])
            ->assertStatus(200)
            ->assertJson(['is_pinned' => true]);
    }

    public function test_pinned_notes_appear_first(): void
    {
        $user = $this->createUser();
        Note::factory()->create(['user_id' => $user->id, 'is_pinned' => false, 'pinned_at' => null, 'password' => null]);
        Note::factory()->create(['user_id' => $user->id, 'is_pinned' => true, 'pinned_at' => now(), 'password' => null]);

        $notes = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/notes')
            ->assertStatus(200)
            ->json();

        $this->assertTrue($notes[0]['is_pinned']);
    }

    public function test_user_can_soft_delete_note(): void
    {
        Event::fake();
        $user = $this->createUser();
        $note = Note::factory()->create(['user_id' => $user->id, 'password' => null]);

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/v1/notes/{$note->id}")
            ->assertStatus(204);

        $this->assertSoftDeleted('notes', ['id' => $note->id]);
    }

    public function test_user_cannot_delete_others_note(): void
    {
        Event::fake();
        $owner = $this->createUser();
        $other = $this->createUser();
        $note = Note::factory()->create(['user_id' => $owner->id, 'password' => null]);

        $this->actingAs($other, 'sanctum')
            ->deleteJson("/api/v1/notes/{$note->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('notes', ['id' => $note->id, 'deleted_at' => null]);
    }

    public function test_show_nonexistent_note_returns_404(): void
    {
        $user = $this->createUser();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/notes/99999')
            ->assertStatus(404);
    }
}
