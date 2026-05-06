<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LabelTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_labels(): void
    {
        $user = $this->createUser();
        $user->labels()->create(['name' => 'Work', 'color' => '#ff0000']);
        $user->labels()->create(['name' => 'Personal', 'color' => '#00ff00']);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/labels')
            ->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_user_only_sees_own_labels(): void
    {
        $user = $this->createUser();
        $other = $this->createUser();

        $user->labels()->create(['name' => 'Mine', 'color' => '#ff0000']);
        $other->labels()->create(['name' => 'Theirs', 'color' => '#00ff00']);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/labels')
            ->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_user_can_create_label(): void
    {
        $user = $this->createUser();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/labels', [
                'name' => 'Work',
                'color' => '#6200ee',
            ])
            ->assertStatus(201)
            ->assertJson(['name' => 'Work']);

        $this->assertDatabaseHas('labels', ['name' => 'Work', 'user_id' => $user->id]);
    }

    public function test_label_requires_name(): void
    {
        $user = $this->createUser();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/labels', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_label_color_must_be_valid_hex(): void
    {
        $user = $this->createUser();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/labels', [
                'name' => 'Work',
                'color' => 'not-a-color',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['color']);
    }

    public function test_user_can_update_own_label(): void
    {
        $user = $this->createUser();
        $label = $user->labels()->create(['name' => 'Old Name', 'color' => '#000000']);

        $this->actingAs($user, 'sanctum')
            ->putJson("/api/v1/labels/{$label->id}", ['name' => 'New Name'])
            ->assertStatus(200)
            ->assertJson(['name' => 'New Name']);
    }

    public function test_user_cannot_update_others_label(): void
    {
        $owner = $this->createUser();
        $other = $this->createUser();
        $label = $owner->labels()->create(['name' => 'Private', 'color' => '#000000']);

        $this->actingAs($other, 'sanctum')
            ->putJson("/api/v1/labels/{$label->id}", ['name' => 'Hacked'])
            ->assertStatus(403);
    }

    public function test_user_can_delete_own_label(): void
    {
        $user = $this->createUser();
        $label = $user->labels()->create(['name' => 'ToDelete', 'color' => '#000000']);

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/v1/labels/{$label->id}")
            ->assertStatus(204);

        $this->assertDatabaseMissing('labels', ['id' => $label->id]);
    }

    public function test_user_cannot_delete_others_label(): void
    {
        $owner = $this->createUser();
        $other = $this->createUser();
        $label = $owner->labels()->create(['name' => 'Protected', 'color' => '#000000']);

        $this->actingAs($other, 'sanctum')
            ->deleteJson("/api/v1/labels/{$label->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('labels', ['id' => $label->id]);
    }
}
