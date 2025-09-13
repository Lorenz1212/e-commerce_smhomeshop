✅ Main Dependencies
🔹 Laravel Core
 laravel/framework – Main Laravel framework (v10.10+).
 laravel/passport – For API authentication using OAuth2.
 laravel/sanctum – Lightweight API authentication (tokens/cookies).
 laravel/tinker – REPL for running PHP/Laravel commands interactively.

🔹 Utility & Tools
intervention/image – Image handling and manipulation.
google/cloud-language – Google Cloud NLP API integration.
rubix/ml – Machine learning for PHP (classification, clustering, etc.).
pusher/pusher-php-server – Real-time events & notifications.

🔹 User Experience
devaslanphp/filament-avatar – Auto avatar generation for Filament Admin.
protonemedia/laravel-verify-new-email – Email verification for changed email addresses.

🌟 Spatie Packages
1. spatie/laravel-activitylog
Logs model changes and user activity automatically.

composer require spatie/laravel-activitylog
⚙️ Setup:
Publish config & migration:
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-migrations"
php artisan migrate
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-config"


2. spatie/laravel-permission
Role & permission management.
🔧 Installation (already required in composer.json):
composer require spatie/laravel-permission
⚙️ Setup:
Publish config & migration:
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate

Cache Reset (Very Important 🚨)
php artisan permission:cache-reset

This sets the APP_KEY in your .env file (needed for encryption, hashing, sessions, etc.).
command: php artisan key:generate

🔐 Complete Setup: Laravel Passport
1️⃣ Install Passport

Already nasa composer.json mo:

composer require laravel/passport

2️⃣ Migrate Database

Passport needs tables for clients, tokens, etc.

php artisan migrate


This creates tables like:

oauth_clients

oauth_access_tokens

oauth_refresh_tokens

oauth_auth_codes

3️⃣ Install Encryption Keys

Generate encryption keys and clients:

php artisan passport:install

👉 This creates:

Personal Access Client

Password Grant Client

⚡ Notes:

passport:install should be re-run only in development, because it regenerates keys.

In production, you typically use passport:keys instead (see below).

4️⃣ Add Passport Service Provider

Usually auto-discovered, but if not, add in config/app.php:

Laravel\Passport\PassportServiceProvider::class,

5️⃣ Configure Auth

In app/Models/User.php, add HasApiTokens trait:

use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
}


In config/auth.php, change api driver:

'guards' => [
    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],
],

6️⃣ Register Routes

In App\Providers\AuthServiceProvider, add:

use Laravel\Passport\Passport;

public function boot()
{
    $this->registerPolicies();

    Passport::routes();
}

7️⃣ Using Tokens
Create Personal Access Token
$token = $user->createToken('MyApp')->accessToken;

Use in API Request

Send token in header:

Authorization: Bearer <token>

🛠 Artisan Commands for Passport
🔑 Install & Keys
php artisan passport:install       # Generates clients + keys
php artisan passport:keys          # Only generate keys (use in production)
php artisan passport:client        # Create custom client
php artisan passport:purge         # Cleanup expired tokens

⚡ Example: Create Password Grant Client
php artisan passport:client --password


You’ll get Client ID and Secret for password grant flow.

✅ Summary

passport:install → fresh setup (clients + keys).

passport:keys → production safe key generation.

passport:client → create extra OAuth clients.

passport:purge → delete expired tokens.
