<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('sizes')) {
            Schema::create('sizes', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('dimensions')->nullable();
                $table->unsignedInteger('position')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (Schema::hasTable('product_variants') && ! Schema::hasColumn('product_variants', 'size_id')) {
            Schema::table('product_variants', function (Blueprint $table) {
                $table->foreignId('size_id')->nullable()->after('color_id')->constrained('sizes')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('product_variants') && Schema::hasColumn('product_variants', 'size_id')) {
            Schema::table('product_variants', function (Blueprint $table) {
                $table->dropConstrainedForeignId('size_id');
            });
        }

        Schema::dropIfExists('sizes');
    }
};
