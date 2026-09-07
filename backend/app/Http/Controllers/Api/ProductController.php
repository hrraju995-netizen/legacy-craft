<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /** GET /api/products — the filterable listing the storefront browses. */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'category' => 'nullable|string',
            'room' => 'nullable|string',
            'sub' => 'nullable|string',
            'size' => 'nullable|string',
            'q' => 'nullable|string|max:100',
            'min_price' => 'nullable|integer|min:0',
            'max_price' => 'nullable|integer|min:0',
            'sort' => 'nullable|in:featured,newest,low_to_high,high_to_low,a_z,z_a',
            'per_page' => 'nullable|integer|min:1|max:60',
        ]);

        $query = Product::query()
            ->active()
            ->with(['category', 'room', 'images', 'variants.color', 'tags']);

        $query->when($validated['category'] ?? null, fn ($q, $slug) => $q->whereHas(
            'category', fn ($c) => $c->where('slug', $slug)
        ));

        $query->when($validated['room'] ?? null, fn ($q, $slug) => $q->whereHas(
            'room', fn ($r) => $r->where('slug', $slug)
        ));

        $query->when($validated['size'] ?? null, fn ($q, $size) => $q->where('size_label', $size));

        // Prices arrive in taka but are stored in paisa.
        $query->when($validated['min_price'] ?? null, fn ($q, $v) => $q->where('price', '>=', $v * 100));
        $query->when($validated['max_price'] ?? null, fn ($q, $v) => $q->where('price', '<=', $v * 100));

        $query->when($validated['q'] ?? null, function ($q, $term) {
            $q->where(function ($sub) use ($term) {
                $sub->where('name', 'like', "%{$term}%")
                    ->orWhere('subcategory', 'like', "%{$term}%")
                    ->orWhere('material', 'like', "%{$term}%")
                    ->orWhereHas('category', fn ($c) => $c->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('room', fn ($r) => $r->where('name', 'like', "%{$term}%"));
            });
        });

        match ($validated['sort'] ?? 'featured') {
            'newest' => $query->latest('published_at')->latest('id'),
            'low_to_high' => $query->orderBy('price'),
            'high_to_low' => $query->orderByDesc('price'),
            'a_z' => $query->orderBy('name'),
            'z_a' => $query->orderByDesc('name'),
            default => $query->orderByDesc('is_featured')->orderByDesc('rating'),
        };

        return ProductResource::collection(
            $query->paginate($validated['per_page'] ?? 24)->withQueryString()
        );
    }

    /** GET /api/products/{product} — resolved by slug. */
    public function show(Product $product)
    {
        abort_unless($product->is_active, 404);

        $product->load(['category', 'room', 'images', 'variants.color', 'tags', 'related.images']);

        return (new ProductResource($product))->additional([
            'related' => ProductResource::collection($product->relatedProducts()),
        ]);
    }
}
