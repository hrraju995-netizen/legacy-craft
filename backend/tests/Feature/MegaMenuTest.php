<?php

use App\Models\Category;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    $this->actingAs(User::where('role', 'admin')->first());
});

it('serves a nested mega menu through the api', function () {
    $menu = Menu::where('location', 'header_main')->first();
    $category = Category::first();

    $parent = $menu->allItems()->create([
        'label' => 'Test Mega',
        'link_type' => 'url',
        'url' => '/products',
        'is_mega' => true,
        'columns' => 3,
        'position' => 99,
    ]);

    $menu->allItems()->create([
        'parent_id' => $parent->id,
        'label' => 'Child Category',
        'link_type' => 'category',
        'linkable_id' => $category->id,
        'position' => 0,
    ]);

    cache()->flush();

    $items = $this->getJson('/api/v1/site/config')->json('menus.header_main');

    $mega = collect($items)->firstWhere('label', 'Test Mega');

    expect($mega)->not->toBeNull()
        ->and($mega['isMega'])->toBeTrue()
        ->and($mega['columns'])->toBe(3)
        ->and($mega['children'])->toHaveCount(1)
        // A category link resolves to its slug, so renaming never breaks it.
        ->and($mega['children'][0]['href'])->toBe('/categories/'.$category->slug);
});

it('returns menus as arrays', function () {
    $menus = $this->getJson('/api/v1/site/config')->json('menus');

    expect($menus['header_main'])->toBeArray()
        ->and($menus['footer_company'])->toBeArray();
});
