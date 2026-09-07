<?php

use App\Filament\Widgets\LatestOrders;
use App\Filament\Widgets\StoreOverview;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Livewire\livewire;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    $this->actingAs(User::where('role', 'admin')->first());
});

it('loads the dashboard', function () {
    $this->get('/admin')->assertSuccessful();
});

it('renders the stats widget', function () {
    livewire(StoreOverview::class)->assertSuccessful();
});

it('renders the latest orders widget', function () {
    livewire(LatestOrders::class)->assertSuccessful();
});

it('loads every resource index page', function (string $page) {
    livewire($page)->assertSuccessful();
})->with([
    \App\Filament\Resources\Products\Pages\ListProducts::class,
    \App\Filament\Resources\Categories\Pages\ListCategories::class,
    \App\Filament\Resources\Orders\Pages\ListOrders::class,
    \App\Filament\Resources\Menus\Pages\ListMenus::class,
    \App\Filament\Resources\Pages\Pages\ListPages::class,
    \App\Filament\Resources\ShippingZones\Pages\ListShippingZones::class,
    \App\Filament\Resources\Couriers\Pages\ListCouriers::class,
]);

it('loads the site settings page', function () {
    $this->get('/admin/manage-settings')->assertSuccessful();
});
