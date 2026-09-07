<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Catalogue: categories, products, variants, images, attributes.
 * Mirrors the shape the Next.js storefront already consumes so the frontend
 * can switch from src/data/products.js to the API without reshaping anything.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()
                ->constrained('categories')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('banner')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('show_in_menu')->default(true);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();

            $table->index(['is_active', 'position']);
        });

        // Room type: Bedroom, Living Room, Classroom … used for "Shop by Room".
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('room_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();

            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique()->nullable();
            $table->string('subcategory')->nullable();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();

            // Money is stored in paisa (integer) — never floats.
            $table->unsignedBigInteger('price');
            $table->unsignedBigInteger('compare_at_price')->nullable();
            $table->unsignedBigInteger('cost_price')->nullable();

            $table->boolean('manage_stock')->default(true);
            $table->integer('stock_quantity')->default(0);
            $table->unsignedInteger('low_stock_threshold')->default(3);
            $table->enum('stock_status', ['in_stock', 'out_of_stock', 'on_backorder'])
                ->default('in_stock');

            $table->string('material')->nullable();
            $table->string('size_label')->nullable();
            $table->decimal('weight_kg', 8, 2)->nullable();
            $table->string('dim_width')->nullable();
            $table->string('dim_length')->nullable();
            $table->string('dim_height')->nullable();

            $table->decimal('rating', 3, 2)->default(0);
            $table->unsignedInteger('review_count')->default(0);

            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_best_seller')->default(false);
            $table->boolean('is_new')->default(false);
            $table->unsignedInteger('position')->default(0);

            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'is_featured']);
            $table->index(['category_id', 'is_active']);
            $table->index('price');
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->string('alt')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_thumbnail')->default(false);
            $table->timestamps();
        });

        // Colour swatches / finishes — the "color function" from the design.
        Schema::create('colors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('hex', 9);
            $table->string('swatch_image')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // A variant = one buyable combination (colour, size…). Nullable colour
        // so simple products can have a single default variant.
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('color_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name')->nullable();
            $table->string('sku')->unique()->nullable();
            $table->unsignedBigInteger('price')->nullable(); // null = inherit product price
            $table->unsignedBigInteger('compare_at_price')->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->string('image')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('product_tag', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->primary(['product_id', 'tag_id']);
        });

        // Cross-sells / "You may also like" overrides.
        Schema::create('product_related', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('related_id')->constrained('products')->cascadeOnDelete();
            $table->unsignedInteger('position')->default(0);
            $table->primary(['product_id', 'related_id']);
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('author_name');
            $table->string('author_email')->nullable();
            $table->unsignedTinyInteger('rating');
            $table->text('body')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->timestamps();

            $table->index(['product_id', 'is_approved']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('product_related');
        Schema::dropIfExists('product_tag');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('colors');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('categories');
    }
};
