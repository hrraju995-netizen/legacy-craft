<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Staff accounts for the Filament admin panel (separate from customers). */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('staff')->after('email'); // admin|manager|staff
            $table->string('avatar')->nullable()->after('role');
            $table->boolean('is_active')->default(true)->after('avatar');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'avatar', 'is_active']);
        });
    }
};
