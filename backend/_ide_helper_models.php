<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Note> $notes
 * @property-read int|null $notes_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Label newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Label newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Label query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Label whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Label whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Label whereUserId($value)
 */
	class Label extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string|null $content
 * @property int $user_id
 * @property bool $is_pinned
 * @property \Illuminate\Support\Carbon|null $pinned_at
 * @property string|null $password
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\NoteImage> $images
 * @property-read int|null $images_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Label> $labels
 * @property-read int|null $labels_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $sharedWith
 * @property-read int|null $shared_with_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Note newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Note newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Note query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Note whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Note whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Note whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Note whereIsPinned($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Note wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Note wherePinnedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Note whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Note whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Note whereUserId($value)
 */
	class Note extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $note_id
 * @property string $image_url
 * @property string|null $public_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Note $note
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NoteImage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NoteImage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NoteImage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NoteImage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NoteImage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NoteImage whereImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NoteImage whereNoteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NoteImage wherePublicId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NoteImage whereUpdatedAt($value)
 */
	class NoteImage extends \Eloquent {}
}

namespace App\Models{
/**
 * @mixin \Illuminate\Database\Eloquent\Builder
 * @mixin \Illuminate\Database\Query\Builder
 * @property int $id
 * @property string $display_name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Label> $labels
 * @property-read int|null $labels_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Note> $notes
 * @property-read int|null $notes_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Note> $sharedNotes
 * @property-read int|null $shared_notes_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @property-read \App\Models\UserPreference|null $userPreference
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDisplayName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent implements \Illuminate\Contracts\Auth\MustVerifyEmail {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property int $font_size
 * @property string $theme
 * @property string $note_color
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPreference newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPreference newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPreference query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPreference whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPreference whereFontSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPreference whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPreference whereNoteColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPreference whereTheme($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPreference whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserPreference whereUserId($value)
 */
	class UserPreference extends \Eloquent {}
}

