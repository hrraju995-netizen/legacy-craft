<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('articles')) {
            Schema::create('articles', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('bangla_title')->nullable();
                $table->string('slug')->unique();
                $table->string('category')->default('Interior Design');
                $table->string('image')->nullable();
                $table->text('excerpt')->nullable();
                $table->longText('content')->nullable();
                $table->string('author_name')->default('Look Studio Design Team');
                $table->string('author_role')->default('Senior Interior Architect');
                $table->string('author_avatar')->nullable();
                $table->string('read_time')->default('5 min read');
                $table->json('tags')->nullable();
                $table->string('related_category_slug')->nullable();
                $table->boolean('is_published')->default(true);
                $table->boolean('is_featured')->default(false);
                $table->dateTime('published_at')->nullable();
                $table->string('meta_title')->nullable();
                $table->text('meta_description')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
