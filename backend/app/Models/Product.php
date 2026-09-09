<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'price' => 'integer',
        'compare_at_price' => 'integer',
        'cost_price' => 'integer',
        'stock_quantity' => 'integer',
        'manage_stock' => 'boolean',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_best_seller' => 'boolean',
        'is_new' => 'boolean',
        'rating' => 'float',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (self $product) {
            if (blank($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    /* ---------------------------------------------------------- relations */

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('position');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class)->orderBy('position');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function related()
    {
        return $this->belongsToMany(self::class, 'product_related', 'product_id', 'related_id')
            ->withPivot('position');
    }

    /* ------------------------------------------------------------ scopes */

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where(function ($q) {
            $q->where('manage_stock', false)
              ->orWhere('stock_quantity', '>', 0);
        });
    }

    /* --------------------------------------------------------- accessors */

    /** Prices are stored in paisa; the storefront wants whole taka. */
    public function getPriceTakaAttribute(): float
    {
        return $this->price / 100;
    }

    public function getDiscountPercentAttribute(): int
    {
        if (! $this->compare_at_price || $this->compare_at_price <= $this->price) {
            return 0;
        }

        return (int) round((($this->compare_at_price - $this->price) / $this->compare_at_price) * 100);
    }

    public function getThumbnailAttribute(): ?string
    {
        $path = $this->images->firstWhere('is_thumbnail', true)?->path
            ?? $this->images->first()?->path;

        return static::resolveImageUrl($path);
    }

    /**
     * Resolves an image path or URL into a clean, working public URL.
     * Handles:
     * - External URLs (Unsplash, Cloudinary, etc.)
     * - Stripping dead localhost / 127.0.0.1 hostnames saved during seeding/local dev
     * - Preventing double storage prefixes (/storage/storage/...)
     * - Windows backslashes
     * - Direct public disk relative paths
     */
    public static function resolveImageUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        // 0. Handle JSON-encoded arrays/strings from Filament uploads (e.g. ["settings/xxx.png"])
        if (is_string($path) && (str_starts_with($path, '["') || str_starts_with($path, '[\"'))) {
            $decoded = json_decode($path, true);
            if (is_array($decoded)) {
                $path = (string) (collect($decoded)->flatten()->filter()->first() ?? '');
            }
        }

        if (blank($path)) {
            return null;
        }

        // 1. Check if path has localhost or 127.0.0.1 and strip it
        if (preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?/(.*)$#i', $path, $matches)) {
            $path = $matches[3];
        }

        // 2. Normalize slashes
        $path = str_replace('\\', '/', trim($path));

        // 3. If it's a real external URL (e.g. Unsplash, CDN), return as-is
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            // Upgrade insecure api.lookstudiobd.com to https
            if (str_starts_with($path, 'http://api.lookstudiobd.com')) {
                $path = 'https://api.lookstudiobd.com' . substr($path, 25);
            }
            $appUrl = rtrim(config('app.url', 'https://api.lookstudiobd.com'), '/');
            // If it starts with our own domain, normalize it to avoid double storage
            if (str_starts_with($path, $appUrl)) {
                $path = substr($path, strlen($appUrl));
            } else {
                return $path;
            }
        }

        // 4. Strip leading slashes and redundant storage/ or public/ prefixes
        $clean = ltrim($path, '/');
        while (str_starts_with($clean, 'storage/')) {
            $clean = substr($clean, 8);
        }
        while (str_starts_with($clean, 'public/')) {
            $clean = substr($clean, 7);
        }

        if (blank($clean)) {
            return null;
        }

        // 5. Generate clean URL using Storage public disk with HTTPS
        $baseUrl = rtrim(config('app.url', 'https://api.lookstudiobd.com'), '/');
        if (str_starts_with($baseUrl, 'http://api.')) {
            $baseUrl = 'https://' . substr($baseUrl, 7);
        }
        return $baseUrl . '/storage/' . $clean;
    }

    public function getInStockAttribute(): bool
    {
        return ! $this->manage_stock || $this->stock_quantity > 0;
    }

    /**
     * Manually curated cross-sells if any, otherwise same-category products,
     * topped up from the same room. Never returns the product itself.
     */
    public function relatedProducts(int $limit = 4)
    {
        $manual = $this->related()->with('images')->active()->take($limit)->get();

        if ($manual->count() >= $limit) {
            return $manual;
        }

        $exclude = $manual->pluck('id')->push($this->id);

        $auto = static::query()
            ->active()
            ->with(['category', 'room', 'images'])
            ->whereNotIn('id', $exclude)
            ->where(fn ($q) => $q
                ->where('category_id', $this->category_id)
                ->orWhere('room_id', $this->room_id))
            ->orderByRaw('category_id = ? DESC', [$this->category_id])
            ->take($limit - $manual->count())
            ->get();

        return $manual->concat($auto);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
