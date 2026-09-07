<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class CustomerAuthController extends Controller
{
    /**
     * Register a new storefront customer.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:100',
            'phone' => ['required', 'string', 'regex:/^01[3-9]\d{8}$/'],
            'password' => 'required|string|min:6|max:100',
            'email' => 'nullable|email|max:150',
        ], [
            'phone.regex' => 'Please enter a valid Bangladeshi phone number (e.g. 017XXXXXXXX).',
            'password.min' => 'Password must be at least 6 characters.',
        ]);

        $phone = preg_replace('/[\s-]/', '', $validated['phone']);

        $customer = Customer::where('phone', $phone)->first();

        if ($customer && $customer->password) {
            return response()->json([
                'message' => 'An account with this phone number already exists. Please log in.',
            ], 422);
        }

        if ($customer) {
            // Upgrade previous guest customer to full account
            $customer->update([
                'name' => $validated['name'],
                'password' => $validated['password'], // hashed by cast in model
                'email' => $validated['email'] ?? $customer->email,
            ]);
        } else {
            $customer = Customer::create([
                'name' => $validated['name'],
                'phone' => $phone,
                'email' => $validated['email'] ?? null,
                'password' => $validated['password'],
                'is_active' => true,
            ]);
        }

        $token = $customer->createToken('customer-auth')->plainTextToken;

        return response()->json([
            'message' => 'Account created successfully!',
            'token' => $token,
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
            ],
        ], 201);
    }

    /**
     * Log in an existing storefront customer.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        $phone = preg_replace('/[\s-]/', '', $validated['phone']);

        $customer = Customer::where('phone', $phone)->first();

        if (! $customer || ! $customer->password || ! Hash::check($validated['password'], $customer->password)) {
            return response()->json([
                'message' => 'Invalid phone number or password.',
            ], 422);
        }

        if (! $customer->is_active) {
            return response()->json([
                'message' => 'Your account has been deactivated. Please contact support.',
            ], 403);
        }

        $token = $customer->createToken('customer-auth')->plainTextToken;

        return response()->json([
            'message' => 'Logged in successfully!',
            'token' => $token,
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
            ],
        ]);
    }

    /**
     * Resolve authenticated Customer model from request or Sanctum token.
     */
    protected function resolveCustomer(Request $request): ?Customer
    {
        $user = $request->user();
        if ($user instanceof Customer) {
            return $user;
        }

        $bearer = $request->bearerToken();
        if ($bearer) {
            $token = \Laravel\Sanctum\PersonalAccessToken::findToken($bearer);
            if ($token && $token->tokenable instanceof Customer) {
                return $token->tokenable;
            }
        }

        return null;
    }

    /**
     * Get the authenticated customer's profile & orders.
     */
    public function me(Request $request)
    {
        $customer = $this->resolveCustomer($request);

        if (! $customer) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $orders = $customer->orders()
            ->latest()
            ->with(['items.product'])
            ->take(20)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'orderNumber' => $order->order_number,
                'status' => $order->status,
                'paymentStatus' => $order->payment_status,
                'grandTotal' => (int) round($order->grand_total / 100),
                'itemCount' => $order->items->sum('quantity'),
                'createdAt' => $order->created_at->format('M d, Y h:i A'),
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unitPrice' => (int) round($item->unit_price / 100),
                    'totalPrice' => (int) round($item->total_price / 100),
                    'variant' => $item->variant_label,
                    'image' => $item->product ? $item->product->thumbnail : null,
                ]),
            ]);

        return response()->json([
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
            ],
            'orders' => $orders,
        ]);
    }

    /**
     * Change customer password.
     */
    public function changePassword(Request $request)
    {
        $customer = $this->resolveCustomer($request);

        if (! $customer) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $data = $request->isJson() ? $request->json()->all() : $request->all();
        if (empty($data)) {
            $data = json_decode($request->getContent(), true) ?: [];
        }

        $validator = \Illuminate\Support\Facades\Validator::make($data, [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ], [
            'current_password.required' => 'Please enter your current password.',
            'new_password.min' => 'New password must be at least 6 characters.',
            'new_password.confirmed' => 'New password confirmation does not match.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        if (! Hash::check($validated['current_password'], $customer->password)) {
            return response()->json([
                'message' => 'The current password you entered is incorrect.',
            ], 422);
        }

        $customer->update([
            'password' => $validated['new_password'],
        ]);

        return response()->json([
            'message' => 'Password updated successfully!',
        ]);
    }

    /**
     * Update customer basic profile details.
     */
    public function updateProfile(Request $request)
    {
        $customer = $this->resolveCustomer($request);

        if (! $customer) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validated = $request->validate([
            'name' => 'required|string|min:2|max:100',
            'email' => 'nullable|email|max:150',
        ]);

        $customer->update([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
        ]);

        return response()->json([
            'message' => 'Profile updated successfully!',
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
            ],
        ]);
    }

    /**
     * Log out customer and revoke access token.
     */
    public function logout(Request $request)
    {
        $bearer = $request->bearerToken();
        if ($bearer) {
            $token = \Laravel\Sanctum\PersonalAccessToken::findToken($bearer);
            if ($token) {
                $token->delete();
            }
        }

        return response()->json(['message' => 'Logged out successfully.']);
    }
}
