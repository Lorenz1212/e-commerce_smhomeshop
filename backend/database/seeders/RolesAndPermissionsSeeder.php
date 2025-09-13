<?php

namespace Database\Seeders;

use App\Models\PermissionParent;
use App\Models\User;
use App\Models\UserPersonalInfo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
          // Clear cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        //Parent Permemission

        $online_order = PermissionParent::firstOrCreate(['name' => 'Online Order','order_by'=> 1]);
        Permission::firstOrCreate(['name' => 'view_online_order_list','permission_parent_id'=>$online_order->id,'description'=>'View List','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'view_onlie_order_details','permission_parent_id'=>$online_order->id,'description'=>'View Details','guard_name'=>'core']);
        
        // $walkin_order = PermissionParent::firstOrCreate(['name' => 'Walk-In Order']);
        // Permission::firstOrCreate(['name' => 'view_walkin_order_list','permission_parent_id'=>$walkin_order->id,'description'=>'View List','guard_name'=>'core']);
        // Permission::firstOrCreate(['name' => 'view_walkin_order_details','permission_parent_id'=>$walkin_order->id,'description'=>'View Details','guard_name'=>'core']);
    
        // Create Product 
        $product = PermissionParent::firstOrCreate(['name' => 'Products','order_by'=> 2]);
        Permission::firstOrCreate(['name' => 'view_product_list','permission_parent_id'=>$product->id,'description'=>'View List','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'view_product_details','permission_parent_id'=>$product->id,'description'=>'View Details','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'create_product','permission_parent_id'=>$product->id,'description'=>'Create','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'update_product','permission_parent_id'=>$product->id,'description'=>'Edit','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'restore_product','permission_parent_id'=>$product->id,'description'=>'Restore','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'archived_product','permission_parent_id'=>$product->id,'description'=>'Archive','guard_name'=>'core']);
        // Permission::firstOrCreate(['name' => 'force_delete_product','permission_parent_id'=>$product->id,'description'=>'Delete Permanently','guard_name'=>'core']);
        
        // Create Product Category 
        $category = PermissionParent::firstOrCreate(['name' => 'Products Categories','order_by'=> 3]);
        Permission::firstOrCreate(['name' => 'view_product_category_list','permission_parent_id'=>$category->id,'description'=>'View List','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'view_product_category_details','permission_parent_id'=>$category->id,'description'=>'View Details','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'create_product_category','permission_parent_id'=>$category->id,'description'=>'Create','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'update_product_category','permission_parent_id'=>$category->id,'description'=>'Edit','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'restore_product_category','permission_parent_id'=>$category->id,'description'=>'Restore','guard_name'=>'core']);
        Permission::firstOrCreate(['name'=>  'archived_product_category','permission_parent_id'=>$category->id,'description'=>'Archive','guard_name'=>'core']);
        // Permission::firstOrCreate(['name' => 'force_delete_product_category','permission_parent_id'=>$category->id,'description'=>'Delete Permanently','guard_name'=>'core']);

        $variant = PermissionParent::firstOrCreate(['name' => 'Product Variants','order_by'=> 4]);
        Permission::firstOrCreate(['name' => 'view_product_variant_list','permission_parent_id'=>$variant->id,'description'=>'View List','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'view_product_variant_details','permission_parent_id'=>$variant->id,'description'=>'View Details','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'create_product_variant','permission_parent_id'=>$variant->id,'description'=>'Create','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'update_product_variant','permission_parent_id'=>$variant->id,'description'=>'Edit','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'restore_product_variant','permission_parent_id'=>$variant->id,'description'=>'Restore','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'archived_product_variant','permission_parent_id'=>$variant->id,'description'=>'Archive','guard_name'=>'core']);
        // Permission::firstOrCreate(['name' => 'force_delete_product_addons','permission_parent_id'=>$addons->id,'description'=>'Delete Permanently','guard_name'=>'core']);

        // Create Product Add-ons 
        $addons = PermissionParent::firstOrCreate(['name' => 'Product Add-ons','order_by'=> 5]);
        Permission::firstOrCreate(['name' => 'view_product_addons_list','permission_parent_id'=>$addons->id,'description'=>'View List','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'view_product_addons_details','permission_parent_id'=>$addons->id,'description'=>'View Details','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'create_product_addons','permission_parent_id'=>$addons->id,'description'=>'Create','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'update_product_addons','permission_parent_id'=>$addons->id,'description'=>'Edit','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'restore_product_addons','permission_parent_id'=>$addons->id,'description'=>'Restore','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'archived_product_addons','permission_parent_id'=>$addons->id,'description'=>'Archive','guard_name'=>'core']);
        // Permission::firstOrCreate(['name' => 'force_delete_product_addons','permission_parent_id'=>$addons->id,'description'=>'Delete Permanently','guard_name'=>'core']);

        // Create Supplier 
        $supplier = PermissionParent::firstOrCreate(['name' => 'Supplier','order_by'=> 6]);
        Permission::firstOrCreate(['name' => 'view_supplier_list','permission_parent_id'=>$supplier->id,'description'=>'View List','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'view_supplier_details','permission_parent_id'=>$supplier->id,'description'=>'View Details','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'create_supplier','permission_parent_id'=>$supplier->id,'description'=>'Create','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'update_supplier','permission_parent_id'=>$supplier->id,'description'=>'Edit','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'restore_supplier','permission_parent_id'=>$supplier->id,'description'=>'Restore','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'archived_supplier','permission_parent_id'=>$supplier->id,'description'=>'Archive','guard_name'=>'core']);
        // Permission::firstOrCreate(['name' => 'force_delete_supplier','permission_parent_id'=>$supplier->id,'description'=>'Delete Permanently','guard_name'=>'core']);

        // Create Customer 
        $customer = PermissionParent::firstOrCreate(['name' => 'Customers','order_by'=> 7]);
        Permission::firstOrCreate(['name' => 'view_customer_list','permission_parent_id'=>$customer->id,'description'=>'View List','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'view_customer_details','permission_parent_id'=>$customer->id,'description'=>'View Details','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'create_customer','permission_parent_id'=>$customer->id,'description'=>'Create','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'update_customer','permission_parent_id'=>$customer->id,'description'=>'Edit','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'restore_customer','permission_parent_id'=>$customer->id,'description'=>'Restore','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'archived_customer','permission_parent_id'=>$customer->id,'description'=>'Archive','guard_name'=>'core']);
        // Permission::firstOrCreate(['name' => 'block_customer','permission_parent_id'=>$customer->id,'description'=>'Block Customer','guard_name'=>'core']);
        // Permission::firstOrCreate(['name' => 'force_delete_customer','permission_parent_id'=>$customer->id,'description'=>'Delete Permanently','guard_name'=>'core']);

        // Create Feedback
        $feedback = PermissionParent::firstOrCreate(['name' => 'Feedback','order_by'=> 8]);
        Permission::firstOrCreate(['name' => 'view_feedback_list','permission_parent_id'=>$supplier->id,'description'=>'View List','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'view_feedback_details','permission_parent_id'=>$feedback->id,'description'=>'View Details','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'create_feedback','permission_parent_id'=>$feedback->id,'description'=>'Create','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'update_feedback','permission_parent_id'=>$feedback->id,'description'=>'Edit','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'restore_feedback','permission_parent_id'=>$feedback->id,'description'=>'Restore','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'archived_feedback','permission_parent_id'=>$feedback->id,'description'=>'Archive','guard_name'=>'core']);
        // Permission::firstOrCreate(['name' => 'force_delete_feedback','permission_parent_id'=>$feedback->id,'description'=>'Delete Permanently','guard_name'=>'core']);

        // Create User Account 
        $user_account = PermissionParent::firstOrCreate(['name' => 'User Accounts','order_by'=> 9]);
        Permission::firstOrCreate(['name' => 'view_user_account_list','permission_parent_id'=>$user_account->id,'description'=>'View List','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'view_user_account_details','permission_parent_id'=>$user_account->id,'description'=>'View Details','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'create_user_account','permission_parent_id'=>$user_account->id,'description'=>'Create','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'update_user_account','permission_parent_id'=>$user_account->id,'description'=>'Edit','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'restore_user_account','permission_parent_id'=>$user_account->id,'description'=>'Restore','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'archived_user_account','permission_parent_id'=>$user_account->id,'description'=>'Archive','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'reset_user_account','permission_parent_id'=>$user_account->id,'description'=>'Reset Password','guard_name'=>'core']);

        // Create Role 
        $role = PermissionParent::firstOrCreate(['name' => 'Roles','order_by'=> 10]);
        Permission::firstOrCreate(['name' => 'view_role_list','permission_parent_id'=>$role->id,'description'=>'View List','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'view_role_details','permission_parent_id'=>$role->id,'description'=>'View Details','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'create_role','permission_parent_id'=>$role->id,'description'=>'Create','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'update_role','permission_parent_id'=>$role->id,'description'=>'Edit','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'restore_role','permission_parent_id'=>$role->id,'description'=>'Restore','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'archived_role','permission_parent_id'=>$role->id,'description'=>'Archive','guard_name'=>'core']);
        // Permission::firstOrCreate(['name' => 'force_delete_role','permission_parent_id'=>$role->id,'description'=>'Delete Permanently','guard_name'=>'core']);

        // Create Permissions
        $permission = PermissionParent::firstOrCreate(['name' => 'Permissions','order_by'=> 11]);
        Permission::firstOrCreate(['name' => 'view_permission_list','permission_parent_id'=>$customer->id,'description'=>'View List','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'view_permission_details','permission_parent_id'=>$permission->id,'description'=>'View Details','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'create_permission','permission_parent_id'=>$permission->id,'description'=>'Create','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'update_permission','permission_parent_id'=>$permission->id,'description'=>'Edit','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'restore_permission','permission_parent_id'=>$permission->id,'description'=>'Restore','guard_name'=>'core']);
        Permission::firstOrCreate(['name' => 'archived_permission','permission_parent_id'=>$permission->id,'description'=>'Archive','guard_name'=>'core']);
        // Permission::firstOrCreate(['name' => 'force_delete_permission','permission_parent_id'=>$permission->id,'description'=>'Delete Permanently','guard_name'=>'core']);


        // Create Roles and assign created permissions
        $adminRole = Role::firstOrCreate(['name' => 'core', 'guard_name'=>'core']);

        $adminRole->givePermissionTo(Permission::all());

        //Create a test user
        $user_info_admin = UserPersonalInfo::create([
            'fname' =>'Juan',
            'lname' =>'Dela Cruz',
            'mname' =>'L',
            'gender'=>'M',
            'birthdate'=>'1995-11-24',
            'age'=>'29',
            'address'=>'Cabuyao City, Laguna'
        ]);

        $user_admin = User::create([
            'user_id' => $user_info_admin->id,
            'email' => 'admin_2025_test@yopmail.com',
            'password' => Hash::make('Since@_2025'),
        ]);

        $user_admin->assignRole($adminRole);
    }
}