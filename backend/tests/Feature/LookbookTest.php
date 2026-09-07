<?php

use App\Filament\Resources\Lookbooks\Pages\CreateLookbook;
use App\Filament\Resources\Lookbooks\Pages\ListLookbooks;
use App\Models\Lookbook;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Livewire\livewire;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    $this->actingAs(User::where('role', 'admin')->first());
});

it('renders the lookbook pages', function () {
    livewire(ListLookbooks::class)->assertSuccessful();
    livewire(CreateLookbook::class)->assertSuccessful();
});

it('serves an admin-built scene with hotspots through the api', function () {
    $product = Product::where('is_active', true)->first();

    $lookbook = Lookbook::create([
        'title' => 'Studio Corner',
        'slug' => 'studio-corner',
        'image' => 'lookbooks/studio.jpg',
        'position' => 0,
        'is_active' => true,
    ]);

    $lookbook->hotspots()->create([
        'product_id' => $product->id,
        'x' => 25.5,
        'y' => 60,
    ]);

    cache()->flush();

    $scenes = $this->getJson('/api/v1/site/home')->json('lookbooks');

    expect($scenes)->toBeArray();

    $scene = collect($scenes)->firstWhere('title', 'Studio Corner');

    expect($scene)->not->toBeNull()
        ->and($scene['hotspots'])->toHaveCount(1)
        ->and($scene['hotspots'][0]['x'])->toEqual(25.5)
        ->and($scene['hotspots'][0]['title'])->toBe($product->name)
        // Label, price and link all come from the product, so they can never
        // drift out of date.
        ->and($scene['hotspots'][0]['link'])->toBe('/products/'.$product->slug);
});

it('hides unpublished scenes', function () {
    Lookbook::create([
        'title' => 'Draft Scene',
        'slug' => 'draft-scene',
        'image' => 'lookbooks/draft.jpg',
        'is_active' => false,
    ]);

    cache()->flush();

    $titles = collect($this->getJson('/api/v1/site/home')->json('lookbooks'))
        ->pluck('title');

    expect($titles)->not->toContain('Draft Scene');
});
