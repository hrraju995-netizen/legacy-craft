<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->string('bg_color')->nullable()->after('image');
            $table->string('bg_image')->nullable()->after('bg_color');
            $table->string('text_color')->nullable()->after('bg_image');
            $table->string('button_color')->nullable()->after('text_color');
            $table->string('button_text_color')->nullable()->after('button_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn(['bg_color', 'bg_image', 'text_color', 'button_color', 'button_text_color']);
        });
    }
};
