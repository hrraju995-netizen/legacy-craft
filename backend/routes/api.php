<?php

use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\CustomerAuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SiteController;
use App\Models\Category;
use App\Models\Courier;
use App\Models\CourierWebhookLog;
use App\Services\Courier\CourierManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Storefront API consumed by the Next.js frontend
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Customer Authentication
    Route::prefix('auth')->group(function () {
        Route::post('register', [CustomerAuthController::class, 'register'])
            ->middleware('throttle:5,1');
        Route::post('login', [CustomerAuthController::class, 'login'])
            ->middleware('throttle:5,1');
        Route::get('me', [CustomerAuthController::class, 'me']);
        Route::post('change-password', [CustomerAuthController::class, 'changePassword'])
            ->middleware('throttle:5,1');
        Route::put('profile', [CustomerAuthController::class, 'updateProfile']);
        Route::post('logout', [CustomerAuthController::class, 'logout']);
    });

    // Catalogue
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');

    Route::get('categories', function () {
        return Category::active()->withCount('products')->orderBy('position')->get()
            ->map(fn ($c) => [
                'slug' => $c->slug,
                'title' => $c->name,
                'image' => \App\Models\Product::resolveImageUrl($c->image),
                'description' => $c->description,
                'count' => $c->products_count,
            ]);
    });

    // Site chrome + CMS
    Route::get('site/config', [SiteController::class, 'config']);
    Route::get('site/home', [SiteController::class, 'home']);
    Route::get('pages/{page}', [SiteController::class, 'page']);

    // Orders & Coupons
    Route::post('coupons/validate', function (Request $request) {
        $data = $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $subtotalPaisa = (int) round($data['subtotal'] * 100);
        $coupon = \App\Models\Coupon::where('code', strtoupper(trim($data['code'])))->first();

        if (! $coupon) {
            return response()->json(['message' => 'Invalid coupon code.'], 422);
        }

        if (! $coupon->is_active) {
            return response()->json(['message' => 'This coupon is currently inactive.'], 422);
        }

        if ($coupon->starts_at && $coupon->starts_at->isFuture()) {
            return response()->json(['message' => 'This coupon has not started yet.'], 422);
        }

        if ($coupon->expires_at && $coupon->expires_at->isPast()) {
            return response()->json(['message' => 'This coupon has expired.'], 422);
        }

        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            return response()->json(['message' => 'This coupon has reached its maximum usage limit.'], 422);
        }

        if ($coupon->min_order_total && $subtotalPaisa < $coupon->min_order_total) {
            $minTk = number_format($coupon->min_order_total / 100);
            return response()->json(['message' => "Minimum order of ৳{$minTk} required to use this coupon."], 422);
        }

        $discountPaisa = $coupon->discountFor($subtotalPaisa);
        $discountTk = (int) round($discountPaisa / 100);

        return response()->json([
            'valid' => true,
            'code' => $coupon->code,
            'type' => $coupon->type,
            'discount' => $discountTk,
            'free_shipping' => $coupon->type === 'free_shipping',
            'message' => $coupon->type === 'free_shipping'
                ? 'Coupon applied: Free shipping activated!'
                : "Coupon applied: ৳{$discountTk} discount activated!",
        ]);
    })->middleware('throttle:30,1');

    Route::post('checkout', [CheckoutController::class, 'store'])
        ->middleware('throttle:10,1');
    Route::match(['get', 'options'], 'orders/{orderNumber}/track', [CheckoutController::class, 'track'])
        ->middleware('throttle:30,1');


    Route::post('contact', function (Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'nullable|email|max:150',
            'phone' => 'nullable|string|max:20',
            'subject' => 'nullable|string|max:200',
            'message' => 'required|string|max:2000',
        ]);

        \App\Models\ContactMessage::create($data);

        return response()->json(['message' => 'Thanks — we will get back to you shortly.'], 201);
    })->middleware('throttle:5,1');

    Route::post('subscribe', function (Request $request) {
        $data = $request->validate(['email' => 'required|email|max:150']);
        \App\Models\Subscriber::firstOrCreate(['email' => $data['email']]);

        return response()->json(['message' => 'Subscribed.'], 201);
    })->middleware('throttle:5,1');
});

/*
|--------------------------------------------------------------------------
| Courier webhooks — always log the raw payload before processing so a
| failed parse never loses the delivery update.
|--------------------------------------------------------------------------
*/
Route::post('webhooks/courier/{code}', function (Request $request, string $code) {
    $courier = Courier::where('code', $code)->firstOrFail();

    // Verify webhook signature/secret if configured for this courier
    if (! empty($courier->api_secret)) {
        $providedSecret = $request->header('X-Webhook-Secret')
            ?? $request->header('Secret-Key')
            ?? $request->bearerToken()
            ?? $request->query('token');

        if ($providedSecret !== $courier->api_secret) {
            return response()->json(['message' => 'Unauthorized: Invalid webhook secret.'], 401);
        }
    }

    $log = CourierWebhookLog::create([
        'courier_id' => $courier->id,
        'event' => $request->input('status') ?? $request->input('event'),
        'payload' => $request->all(),
    ]);

    try {
        app(CourierManager::class)->driver($courier)->handleWebhook($request->all());
        $log->update(['processed' => true]);
    } catch (\Throwable $e) {
        $log->update(['error' => $e->getMessage()]);
        report($e);
    }

    return response()->json(['received' => true]);
})->name('webhooks.courier');
