<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Site customization: settings, menus, pages with a block builder, homepage
 * sections, banners, tooltips and media. Everything the storefront renders
 * chrome-wise becomes editable from the admin panel.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Key/value settings grouped by tab: general, header, footer, seo,
        // checkout, social, topbar, floating_chat …
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('group')->default('general');
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->string('type')->default('text'); // text|textarea|image|json|boolean|color
            $table->string('label')->nullable();
            $table->text('hint')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index('group');
        });

        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location')->unique(); // header_main, footer_company …
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Self-referencing so mega-menus of any depth are possible.
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()
                ->constrained('menu_items')->cascadeOnDelete();

            $table->string('label');
            $table->enum('link_type', ['url', 'category', 'product', 'page', 'room'])
                ->default('url');
            $table->string('url')->nullable();
            $table->unsignedBigInteger('linkable_id')->nullable();

            $table->string('icon')->nullable();
            $table->string('image')->nullable();
            $table->string('badge')->nullable();       // "New", "Sale"
            $table->string('badge_color')->nullable();
            $table->string('description')->nullable(); // mega-menu subtitle
            $table->boolean('open_in_new_tab')->default(false);
            $table->boolean('is_mega')->default(false);
            $table->unsignedInteger('columns')->default(1);
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['menu_id', 'parent_id', 'position']);
        });

        // CMS pages with a JSON block list — the "page create" requirement.
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->json('blocks')->nullable();
            $table->string('template')->default('default');
            $table->string('featured_image')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->boolean('is_published')->default(false);
            $table->boolean('show_in_footer')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        // Homepage section ordering + per-section config (hero, new arrivals…).
        Schema::create('home_sections', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();   // hero, shop_by_category, new_arrivals
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('component');       // HeroBannerGrid, NewArrivals …
            $table->json('settings')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('placement')->default('hero'); // hero, side, strip, popup
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('badge')->nullable();
            $table->string('image');
            $table->string('mobile_image')->nullable();
            $table->string('link')->nullable();
            $table->string('button_text')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();

            $table->index(['placement', 'is_active']);
        });

        // Tooltips/hotspots: "shop the look" points and UI help bubbles.
        Schema::create('tooltips', function (Blueprint $table) {
            $table->id();
            $table->string('context')->default('global'); // global, product, checkout
            $table->string('anchor')->nullable();         // CSS selector or key
            $table->string('title')->nullable();
            $table->text('content');
            $table->string('placement')->default('top');  // top|right|bottom|left
            $table->string('trigger')->default('hover');  // hover|click|focus
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['context', 'is_active']);
        });

        // Look-book scenes with clickable product hotspots (GetTheLook).
        Schema::create('lookbooks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('image');
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('lookbook_hotspots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lookbook_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->decimal('x', 5, 2); // percentage position
            $table->decimal('y', 5, 2);
            $table->timestamps();
        });

        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('file_name');
            $table->string('path');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->string('alt')->nullable();
            $table->foreignId('uploaded_by')->nullable()
                ->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        Schema::create('subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        foreach ([
            'subscribers', 'contact_messages', 'media', 'lookbook_hotspots',
            'lookbooks', 'tooltips', 'banners', 'home_sections', 'pages',
            'menu_items', 'menus', 'settings',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
