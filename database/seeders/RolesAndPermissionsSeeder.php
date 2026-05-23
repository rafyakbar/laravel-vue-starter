<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Role hierarchy:
     * - superadmin: system owner, holds ALL permissions explicitly
     * - admin:      content manager, has admin-panel access but NOT user/role management
     * - user:       default for public registration, no admin-panel access
     *
     * Note: We do NOT use Gate::before for superadmin bypass. All roles
     * receive explicit permission grants so that getAllPermissions() and
     * the user.permissions API field are consistent across all roles.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // User Management permissions
        $userManagement = [
            'view-users',
            'create-users',
            'update-users',
            'delete-users',
        ];

        // Role Management permissions
        $roleManagement = [
            'view-roles',
            'create-roles',
            'update-roles',
            'delete-roles',
            'assign-roles',
        ];

        // Profile permission (all authenticated roles)
        $profile = ['edit-profile'];

        // Admin Panel gate permission (admin + superadmin)
        $adminPanel = ['access-admin-panel'];

        $allPermissions = array_merge($userManagement, $roleManagement, $profile, $adminPanel);

        foreach ($allPermissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Refresh permission cache before assigning to roles
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // superadmin: holds ALL permissions explicitly
        // When new permissions are added, re-run this seeder OR update with a migration.
        $superadmin = Role::create(['name' => 'superadmin']);
        $superadmin->syncPermissions(Permission::all());

        // admin: content manager — can access admin panel and edit own profile
        // Does NOT have user/role management permissions
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(['access-admin-panel', 'edit-profile']);

        // user: default for public registration — can only edit own profile
        $user = Role::create(['name' => 'user']);
        $user->givePermissionTo('edit-profile');
    }
}
