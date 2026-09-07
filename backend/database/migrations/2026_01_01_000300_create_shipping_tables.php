<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Delivery + courier. Shipping zones replace the hard-coded ৳70/৳130 the
 * storefront used, and consignments track parcels handed to Steadfast/Pathao.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipping_zones', function (Blueprint $table) {
            $table->id();
            $table->string('name');              // Inside Dhaka / Outside Dhaka / Sub-Dhaka
            $table->string('slug')->unique();
            $table->string('note')->nullable();  // "Regular Delivery (1-2 days)"
            $table->unsignedBigInteger('rate');
            $table->unsignedBigInteger('free_above')->nullable();
            $table->unsignedInteger('min_days')->nullable();
            $table->unsignedInteger('max_days')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        // Districts/thanas mapped to a zone, so checkout can auto-pick the rate.
        Schema::create('shipping_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipping_zone_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('district')->nullable();
            $table->unsignedBigInteger('rate_override')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('couriers', function (Blueprint $table) {
            $table->id();
            $table->string('name');                       // Steadfast, Pathao, RedX
            $table->string('code')->unique();             // steadfast, pathao
            $table->string('logo')->nullable();
            $table->string('base_url')->nullable();
            $table->text('api_key')->nullable();          // encrypted via model cast
            $table->text('api_secret')->nullable();       // encrypted via model cast
            $table->boolean('is_active')->default(false);
            $table->boolean('is_default')->default(false);
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('consignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('courier_id')->constrained()->cascadeOnDelete();

            $table->string('consignment_id')->nullable();   // courier's own id
            $table->string('tracking_code')->nullable();
            $table->string('invoice')->nullable();          // our order_number
            $table->unsignedBigInteger('cod_amount')->default(0);

            $table->string('status')->default('pending');
            $table->string('courier_status')->nullable();
            $table->text('note')->nullable();
            $table->json('request_payload')->nullable();
            $table->json('response_payload')->nullable();

            $table->timestamp('dispatched_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->index('tracking_code');
        });

        // Raw webhook deliveries from couriers, kept for debugging/replay.
        Schema::create('courier_webhook_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('courier_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event')->nullable();
            $table->json('payload')->nullable();
            $table->boolean('processed')->default(false);
            $table->text('error')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courier_webhook_logs');
        Schema::dropIfExists('consignments');
        Schema::dropIfExists('couriers');
        Schema::dropIfExists('shipping_areas');
        Schema::dropIfExists('shipping_zones');
    }
};
