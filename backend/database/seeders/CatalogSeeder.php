<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Color;
use App\Models\Product;
use App\Models\Room;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/** Imports the 24 products the Next.js storefront was hard-coding. */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $items = json_decode(file_get_contents(__DIR__.'/products.json'), true);

        foreach ($items as $index => $item) {
            $category = Category::firstOrCreate(
                ['slug' => $item['categorySlug']],
                ['name' => $item['category'], 'position' => $index, 'is_active' => true]
            );

            $room = Room::firstOrCreate(
                ['slug' => $item['roomSlug']],
                ['name' => $item['roomType'], 'is_active' => true]
            );

            $product = Product::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'category_id' => $category->id,
                    'room_id' => $room->id,
                    'name' => $item['name'],
                    'sku' => strtoupper($item['id']),
                    'subcategory' => $item['subcategory'],
                    'short_description' => $item['shortDescription'] ?? null,
                    'description' => $item['shortDescription'] ?? null,
                    // JSON holds taka; the database stores paisa.
                    'price' => (int) $item['price'] * 100,
                    'compare_at_price' => isset($item['originalPrice'])
                        ? (int) $item['originalPrice'] * 100
                        : null,
                    'manage_stock' => true,
                    'stock_quantity' => $item['inStock'] ? 25 : 0,
                    'stock_status' => $item['inStock'] ? 'in_stock' : 'out_of_stock',
                    'material' => $item['material'] ?? null,
                    'size_label' => $item['sizeLabel'] ?? null,
                    'dim_width' => $item['dimensions']['width'] ?? null,
                    'dim_length' => $item['dimensions']['length'] ?? null,
                    'dim_height' => $item['dimensions']['height'] ?? null,
                    'rating' => $item['rating'] ?? 0,
                    'review_count' => $item['reviewCount'] ?? 0,
                    'is_active' => true,
                    'is_featured' => $item['isFeatured'] ?? false,
                    'is_best_seller' => $item['isBestSeller'] ?? false,
                    'position' => $index,
                    'published_at' => $item['createdAt'] ?? now(),
                ]
            );

            // Images — first one becomes the thumbnail.
            $product->images()->delete();
            foreach ($item['images'] ?? [] as $i => $path) {
                $product->images()->create([
                    'path' => $path,
                    'alt' => $item['name'],
                    'position' => $i,
                    'is_thumbnail' => $i === 0,
                ]);
            }

            // Colours become variants so each finish is separately buyable.
            $product->variants()->delete();
            foreach ($item['colors'] ?? [] as $i => $color) {
                $colorModel = Color::firstOrCreate(
                    ['slug' => Str::slug($color['name'])],
                    ['name' => $color['name'], 'hex' => $color['code']]
                );

                $product->variants()->create([
                    'color_id' => $colorModel->id,
                    'name' => $color['name'],
                    'sku' => strtoupper($item['id']).'-'.($i + 1),
                    'stock_quantity' => $item['inStock'] ? 10 : 0,
                    'position' => $i,
                ]);
            }

            $tagIds = collect($item['tags'] ?? [])->map(
                fn ($tag) => Tag::firstOrCreate(['slug' => Str::slug($tag)], ['name' => $tag])->id
            );
            $product->tags()->sync($tagIds);
        }

        $this->command->info('Seeded '.count($items).' products.');
    }
}
