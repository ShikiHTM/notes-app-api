<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/auth/register', [
            'display_name'=> 'Test User',
            'email'       => 'test@example.com',
            'password'    => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'user', 'token', 'token_type']);

        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function test_register_requires_all_fields(): void
    {
        $response = $this->postJson('/api/v1/auth/register', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['display_name', 'email', 'password']);
    }

    public function test_register_fails_with_duplicate_email(): void
    {
        Notification::fake();
        User::factory()->create(['email' => 'dupe@example.com']);

        $response = $this->postJson('/api/v1/auth/register', [
            'display_name' => 'Another User',
            'email' => 'dupe@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_register_fails_with_short_password(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'display_name' => 'Test User',
            'email' => 'test@example.com',
            'password' => '123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_user_can_login(): void
    {
        $user = $this->createUser();

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['message', 'token', 'token_type', 'user']);
    }

    public function test_login_fails_with_wrong_credentials(): void
    {
        $user = $this->createUser();

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['error' => 'Wrong email or password']);
    }

    public function test_user_can_logout(): void
    {
        $user = $this->createUser();
        $token = $user->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/auth/logout')
            ->assertStatus(200)
            ->assertJson(['message' => 'logout successfully']);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = $this->createUser();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/me')
            ->assertStatus(200)
            ->assertJson(['email' => $user->email]);
    }

    public function test_unauthenticated_user_cannot_access_protected_routes(): void
    {
        $this->getJson('/api/v1/me')->assertStatus(401);
        $this->getJson('/api/v1/notes')->assertStatus(401);
        $this->getJson('/api/v1/labels')->assertStatus(401);
    }
}
