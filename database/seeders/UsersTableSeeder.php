<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // System owner — full access via Gate::before bypass
        $superadmin = User::factory()->create([
            'name' => 'Super Admin',
            'username' => 'superadmin',
            'email' => 'superadmin@example.com',
            'password' => bcrypt('123123'),
        ]);
        $superadmin->assignRole('superadmin');

        // Content manager — admin panel access, no user/role management
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('123123'),
        ]);
        $admin->assignRole('admin');

        // Regular users — default role for public registrations
        $users = User::factory(20)->create();

        foreach ($users as $user) {
            $user->assignRole('user');
        }
    }
}
