<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;
use Laravel\Passport\RouteRegistrar;
use App\Models\Customer;
use App\Models\Feedback;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Supplier;
use App\Models\UserPersonalInfo;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Supplier::class => \App\Policies\SupplierPolicy::class,
        Product::class => \App\Policies\ProductPolicy::class,
        ProductCategory::class => \App\Policies\ProductCategoryPolicy::class,
        Customer::class => \App\Policies\CustomerPolicy::class,
        Feedback::class => \App\Policies\FeedbackPolicy::class,
        UserPersonalInfo::class => \App\Policies\UserAccountPolicy::class,
        Permission::class => \App\Policies\PermissionPolicy::class,
        Role::class => \App\Policies\Rolepolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        Passport::tokensExpireIn(now()->addDays(1));
        Passport::refreshTokensExpireIn(now()->addDays(1));
        Passport::personalAccessTokensExpireIn(now()->addDays(1));
    }
}
