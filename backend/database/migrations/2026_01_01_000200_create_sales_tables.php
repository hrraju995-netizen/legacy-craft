<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Sales: customers, addresses, carts, orders, coupons.
 * All money columns are integers (paisa).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone')->unique();
            $table->string('email')->nullable()->unique();
            $table->string('password')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('label')->nullable();
            $table->string('name');
            $table->string('phone');
            $table->text('address_line');
            $table->string('area')->nullable();
            $table->string('city')->default('Dhaka');
            $table->string('postcode')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        // Server-side cart so the storefront can persist across devices.
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->uuid('token')->unique();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('coupon_id')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()
                ->constrained()->nullOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedBigInteger('unit_price');
            $table->timestamps();

            $table->unique(['cart_id', 'product_id', 'product_variant_id'], 'cart_line_unique');
        });

        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['percentage', 'fixed', 'free_shipping']);
            $table->unsignedBigInteger('value')->default(0);
            $table->unsignedBigInteger('min_order_total')->nullable();
            $table->unsignedBigInteger('max_discount')->nullable();
            $table->unsignedInteger('usage_limit')->nullable();
            $table->unsignedInteger('usage_limit_per_customer')->nullable();
            $table->unsignedInteger('used_count')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('coupon_id')->nullable()->constrained()->nullOnDelete();

            $table->enum('status', [
                'pending', 'confirmed', 'processing', 'ready_to_ship',
                'shipped', 'delivered', 'cancelled', 'returned', 'refunded',
            ])->default('pending');

            $table->enum('payment_status', ['unpaid', 'paid', 'partially_paid', 'refunded'])
                ->default('unpaid');
            $table->string('payment_method')->default('cod');

            // Snapshot of the customer — orders must not change when a profile does.
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->text('shipping_address');
            $table->string('shipping_area')->nullable();
            $table->string('shipping_city')->nullable();
            $table->text('order_note')->nullable();
            $table->text('admin_note')->nullable();

            $table->foreignId('shipping_zone_id')->nullable();
            $table->unsignedBigInteger('subtotal')->default(0);
            $table->unsignedBigInteger('discount_total')->default(0);
            $table->unsignedBigInteger('shipping_total')->default(0);
            $table->unsignedBigInteger('tax_total')->default(0);
            $table->unsignedBigInteger('grand_total')->default(0);

            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
            $table->index('customer_phone');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_variant_id')->nullable()
                ->constrained()->nullOnDelete();

            // Snapshotted so historic orders survive product edits/deletes.
            $table->string('product_name');
            $table->string('product_sku')->nullable();
            $table->string('variant_name')->nullable();
            $table->string('product_image')->nullable();
            $table->unsignedBigInteger('unit_price');
            $table->unsignedInteger('quantity');
            $table->unsignedBigInteger('line_total');
            $table->timestamps();
        });

        Schema::create('order_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_status_histories');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('customers');
    }
};
