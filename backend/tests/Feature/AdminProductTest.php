<?php

use App\Filament\Resources\Products\Pages\CreateProduct;
use App\Filament\Resources\Products\Pages\ListProducts;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Livewire\livewire;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    $this->actingAs(User::where('role', 'admin')->first());
});

it('renders the product list', function () {
    livewire(ListProducts::class)->assertSuccessful();
});

it('renders the product create form without errors', function () {
    livewire(CreateProduct::class)->assertSuccessful();
});

it('creates a product without a brand', function () {
    // This is the exact case that used to fail with a foreign key violation.
    $category = Category::first();

    livewire(CreateProduct::class)
        ->fillForm([
            'name' => 'Test Bench',
            'slug' => 'test-bench',
            'category_id' => $category->id,
            'brand_id' => null,
            'room_id' => null,
            'price' => 15000,
            'stock_quantity' => 5,
            'stock_status' => 'in_stock',
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $product = Product::where('slug', 'test-bench')->first();

    expect($product)->not->toBeNull()
        ->and($product->brand_id)->toBeNull()
        // Entered as taka, stored as paisa.
        ->and($product->price)->toBe(1500000);
});

it('creates a product with images and a colour variant', function () {
    Storage::fake('public');

    $category = Category::first();
    $color = \App\Models\Color::first();

    livewire(CreateProduct::class)
        ->fillForm([
            'name' => 'Oak Study Desk',
            'slug' => 'oak-study-desk',
            'category_id' => $category->id,
            'price' => 22000,
            'compare_at_price' => 26000,
            'size_label' => 'Standard',
            'stock_quantity' => 8,
            'stock_status' => 'in_stock',
            // FileUpload expects real uploads, not path strings.
            'images' => [
                ['path' => [UploadedFile::fake()->image('desk-1.jpg')], 'alt' => 'Front view', 'is_thumbnail' => true],
                ['path' => [UploadedFile::fake()->image('desk-2.jpg')], 'alt' => 'Side view', 'is_thumbnail' => false],
            ],
            'variants' => [
                ['color_id' => $color->id, 'name' => $color->name, 'stock_quantity' => 4, 'is_active' => true],
            ],
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $product = Product::where('slug', 'oak-study-desk')->with(['images', 'variants'])->first();

    expect($product->images)->toHaveCount(2)
        ->and($product->variants)->toHaveCount(1)
        ->and($product->thumbnail)->toContain('products/')
        // 22000 vs 26000 taka = 15% off
        ->and($product->discount_percent)->toBe(15);
});

it('exposes the new product through the storefront API', function () {
    $category = Category::first();

    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'API Visible Chair',
        'slug' => 'api-visible-chair',
        'price' => 900000,
        'is_active' => true,
        'stock_quantity' => 3,
    ]);
    $product->images()->create(['path' => 'products/chair.jpg', 'is_thumbnail' => true]);

    $this->getJson('/api/v1/products?q=API Visible')
        ->assertOk()
        ->assertJsonPath('data.0.slug', 'api-visible-chair')
        // Paisa in the database, taka over the wire.
        ->assertJsonPath('data.0.price', 9000);
});

it('renders the category form', function () {
    livewire(\App\Filament\Resources\Categories\Pages\CreateCategory::class)
        ->assertSuccessful();
});

it('returns absolute image urls for uploaded files', function () {
    $product = Product::create([
        'category_id' => Category::first()->id,
        'name' => 'Uploaded Photo Desk',
        'slug' => 'uploaded-photo-desk',
        'price' => 500000,
        'is_active' => true,
    ]);
    // An admin upload: relative path on the public disk.
    $product->images()->create(['path' => 'products/desk.jpg', 'is_thumbnail' => true]);

    $data = $this->getJson('/api/v1/products?q=Uploaded Photo')->json('data.0');

    expect($data['thumbnail'])->toStartWith('http')
        ->and($data['thumbnail'])->toContain('/storage/products/desk.jpg');
});

it('leaves seeded absolute urls untouched', function () {
    $data = $this->getJson('/api/v1/products?q=Nordic Solid Teak')->json('data.0');

    expect($data['thumbnail'])->toStartWith('https://images.unsplash.com');
});

it('returns footer pages as a json array, not an object', function () {
    // Regression test: cached Eloquent Collections used to come back as
    // {"__PHP_Incomplete_Class_Name": ...}, crashing the Footer component.
    $response = $this->getJson('/api/v1/site/config');

    expect($response->json('footerPages'))->toBeArray()
        ->and($response->json('shippingZones'))->toBeArray()
        ->and($response->json('tooltips'))->toBeArray();
});
