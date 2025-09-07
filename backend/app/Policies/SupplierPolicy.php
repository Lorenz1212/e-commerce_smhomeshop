<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SupplierPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_supplier_list');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user): bool
    {
        return $user->can('view_supplier_details');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
          return $user->can('create_supplier');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user): bool
    {
         return $user->can('update_supplier');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user): bool
    {
        return $user->can('delete_supplier');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user): bool
    {
         return $user->can('restore_supplier');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Customer $customer): bool
    {
        return $user->can('force_delete_supplier');
    }
}
