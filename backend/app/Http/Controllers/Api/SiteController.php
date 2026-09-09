<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Category;
use App\Models\HomeSection;
use App\Models\Lookbook;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\Room;
use App\Models\Setting;
use App\Models\ShippingZone;
use App\Models\Tooltip;
use Illuminate\Support\Facades\Cache;

/**
 * Everything the storefront needs to render its chrome — topbar, header,
 * footer, menus, tooltips, banners, shipping rates. One request, cached,
 * so the Next.js layout can fetch it once.
 */
class SiteController extends Controller
{
    public function config()
    {
        $payload = Cache::remember('api.site.config', 300, fn () => [
            'settings' => [
                'general' => collect(Setting::group('general'))->map(function ($val, $key) {
                    if (in_array($key, ['logo', 'favicon', 'footer_logo', 'invoice_logo']) && $val) {
                        $resolved = \App\Models\Product::resolveImageUrl($val);
                        if ($resolved && $key === 'favicon') {
                            $v = substr(md5((string) $val), 0, 8);
                            return $resolved . (str_contains($resolved, '?') ? '&' : '?') . 'v=' . $v;
                        }
                        return $resolved;
                    }
                    return $val;
                })->all(),
                'topbar' => Setting::group('topbar'),
                'header' => Setting::group('header'),
                'footer' => Setting::group('footer'),
                'seo' => collect(Setting::group('seo'))->map(function ($val, $key) {
                    if (in_array($key, ['og_image', 'meta_image']) && $val) {
                        return \App\Models\Product::resolveImageUrl($val);
                    }
                    return $val;
                })->all(),
                'social' => Setting::group('social'),
                'checkout' => Setting::group('checkout'),
                'chat' => Setting::group('chat'),
            ],
            'menus' => Menu::where('is_active', true)->with('items.children')->get()
                ->mapWithKeys(fn (Menu $menu) => [
                    $menu->location => $this->mapItems($menu->items),
                ])->all(),
            'shippingZones' => ShippingZone::active()->get()->map(fn ($z) => [
                'id' => $z->slug,
                'label' => $z->name,
                'note' => $z->note,
                'cost' => (int) round($z->rate / 100),
                'freeAbove' => $z->free_above ? (int) round($z->free_above / 100) : null,
            ])->values()->all(),
            'tooltips' => Tooltip::active()
                ->get(['context', 'anchor', 'title', 'content', 'placement', 'trigger'])
                ->map->toArray()->values()->all(),
            'footerPages' => Page::published()->where('show_in_footer', true)
                ->get(['title', 'slug'])
                ->map(fn ($p) => ['label' => $p->title, 'href' => '/'.$p->slug])
                ->values()->all(),
        ]);

        // Always ensure real-time chat & contact settings and footer pages are fresh
        $payload['settings']['chat'] = Setting::group('chat');
        $payload['footerPages'] = Page::published()->where('show_in_footer', true)
            ->get(['title', 'slug'])
            ->map(fn ($p) => ['label' => $p->title, 'href' => '/'.$p->slug])
            ->values()->all();

        return response()->json($payload);
    }

    /** GET /api/home — ordered, admin-controlled homepage sections. */
    public function home()
    {
        return response()->json(Cache::remember('api.site.home', 300, fn () => [
            'sections' => HomeSection::active()
                ->get(['key', 'component', 'title', 'subtitle', 'settings'])
                ->map->toArray()->values()->all(),
            'banners' => Banner::live()->get()->groupBy('placement')->map(
                fn ($group) => $group->map(fn ($b) => [
                    'title' => $b->title,
                    'subtitle' => $b->subtitle,
                    'badge' => $b->badge,
                    'image' => \App\Models\Product::resolveImageUrl($b->image),
                    'mobileImage' => \App\Models\Product::resolveImageUrl($b->mobile_image),
                    'bgColor' => $b->bg_color,
                    'bgImage' => \App\Models\Product::resolveImageUrl($b->bg_image),
                    'textColor' => $b->text_color,
                    'buttonColor' => $b->button_color,
                    'buttonTextColor' => $b->button_text_color,
                    'link' => $b->link,
                    'buttonText' => $b->button_text,
                ])->values()->all()
            )->all(),
            'categories' => Category::active()->where('show_in_menu', true)
                ->withCount('products')->orderBy('position')->get()
                ->map(fn ($c) => [
                    'slug' => $c->slug,
                    'title' => $c->name,
                    'image' => \App\Models\Product::resolveImageUrl($c->image),
                    'banner' => \App\Models\Product::resolveImageUrl($c->banner),
                    'count' => $c->products_count,
                ])->values()->all(),
            'rooms' => Room::where('is_active', true)->orderBy('position')->get()
                ->map(fn ($r) => ['slug' => $r->slug, 'title' => $r->name, 'image' => \App\Models\Product::resolveImageUrl($r->image)])
                ->values()->all(),
            'lookbooks' => Lookbook::where('is_active', true)->with('hotspots.product.images')
                ->orderBy('position')->get()->map(fn ($l) => [
                    'title' => $l->title,
                    'image' => \App\Models\Product::resolveImageUrl($l->image),
                    'hotspots' => $l->hotspots->map(fn ($h) => [
                        'id' => $h->id,
                        'x' => $h->x,
                        'y' => $h->y,
                        'title' => $h->product->name,
                        'price' => (int) round($h->product->price / 100),
                        'image' => $h->product->thumbnail,
                        'link' => '/products/'.$h->product->slug,
                    ])->values()->all(),
                ])->values()->all(),
            'partners' => \App\Models\Partner::active()->get()->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'logo' => $p->logo_url,
                'svgLogo' => $p->svg_logo,
                'websiteUrl' => $p->website_url,
                'position' => $p->position,
            ])->values()->all(),
        ]));
    }

    public function page(Page $page)
    {
        abort_unless($page->is_published, 404);

        return response()->json([
            'title' => $page->title,
            'slug' => $page->slug,
            'content' => $page->content,
            'blocks' => $page->blocks,
            'template' => $page->template,
            'featuredImage' => \App\Models\Product::resolveImageUrl($page->featured_image),
            'meta' => [
                'title' => $page->meta_title ?: $page->title,
                'description' => $page->meta_description ?: $page->excerpt,
            ],
        ]);
    }

    /** Recursively flatten menu items into the tree the frontend renders. */
    private function mapItems($items): array
    {
        return $items->map(fn (MenuItem $item) => [
            'label' => $item->label,
            'href' => $item->resolved_url,
            'icon' => $item->icon,
            'image' => \App\Models\Product::resolveImageUrl($item->image),
            'badge' => $item->badge,
            'badgeColor' => $item->badge_color,
            'description' => $item->description,
            'newTab' => $item->open_in_new_tab,
            'columns' => $item->columns,
            'children' => $item->children->isNotEmpty()
                ? $this->mapItems($item->children)
                : [],
            'isMega' => (bool) $item->is_mega,
        ])->values()->all();
    }
}
