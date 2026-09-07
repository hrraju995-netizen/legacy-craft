<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Deliberately mirrors the object shape in the storefront's old
 * src/data/products.js, so the Next.js components need no rewriting —
 * only the data source changes.
 */
class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,

            'category' => $this->category?->name,
            'categorySlug' => $this->category?->slug,
            'subcategory' => $this->subcategory,
            'subcategorySlug' => $this->subcategory ? str($this->subcategory)->slug()->value() : null,
            'roomType' => $this->room?->name,
            'roomSlug' => $this->room?->slug,

            // Paisa -> taka for the storefront.
            'price' => (int) round($this->price / 100),
            'originalPrice' => $this->compare_at_price
                ? (int) round($this->compare_at_price / 100)
                : null,
            'discountPercent' => $this->discount_percent,

            'rating' => (float) $this->rating,
            'reviewCount' => $this->review_count,
            'inStock' => $this->in_stock,
            'stockQuantity' => $this->when($this->manage_stock, $this->stock_quantity),

            'isFeatured' => $this->is_featured,
            'isBestSeller' => $this->is_best_seller,
            'isNew' => $this->is_new,
            'sizeLabel' => $this->size_label,
            'createdAt' => $this->published_at?->toDateString() ?? $this->created_at->toDateString(),

            'thumbnail' => $this->thumbnail,
            'images' => $this->whenLoaded('images', fn () => $this->images
                ->map(fn ($i) => Product::resolveImageUrl($i->path))
                ->values()->all()),

            'colors' => $this->whenLoaded('variants', fn () => $this->variants
                ->where('is_active', true)
                ->map(function ($v) {
                    $variantPrice = $v->price !== null ? (int) round($v->price / 100) : (int) round($this->price / 100);
                    $variantOriginalPrice = $v->compare_at_price !== null
                        ? (int) round($v->compare_at_price / 100)
                        : ($this->compare_at_price ? (int) round($this->compare_at_price / 100) : null);

                    $discountPercent = 0;
                    if ($variantOriginalPrice && $variantOriginalPrice > $variantPrice) {
                        $discountPercent = (int) round((($variantOriginalPrice - $variantPrice) / $variantOriginalPrice) * 100);
                    }

                    return [
                        'name' => $v->color?->name ?? $v->name ?? 'Default',
                        'code' => $v->color?->hex ?? '#cccccc',
                        'image' => Product::resolveImageUrl($v->image),
                        'price' => $variantPrice,
                        'originalPrice' => $variantOriginalPrice,
                        'discountPercent' => $discountPercent,
                        'variantId' => $v->id,
                        'stockQuantity' => $v->stock_quantity,
                        'inStock' => $v->stock_quantity > 0 || $this->in_stock,
                    ];
                })->filter(fn ($c) => !empty($c['name']))->values()->all()),

            'material' => $this->material,
            'dimensions' => [
                'width' => $this->dim_width,
                'length' => $this->dim_length,
                'height' => $this->dim_height,
            ],
            'shortDescription' => $this->short_description,
            'description' => $this->description,
            'tags' => $this->whenLoaded('tags', fn () => $this->tags->pluck('name')->values()->all()),

            'meta' => [
                'title' => $this->meta_title ?: $this->name,
                'description' => $this->meta_description ?: $this->short_description,
            ],
        ];
    }
}
