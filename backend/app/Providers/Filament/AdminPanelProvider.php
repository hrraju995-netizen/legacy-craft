<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->brandName(fn () => \App\Models\Setting::get('site_name', 'Legacy Craft Studio'))
            ->brandLogo(function () {
                $siteName = \App\Models\Setting::get('site_name', 'Legacy Craft Studio');
                $rawLogo = \App\Models\Setting::get('logo');
                $logoUrl = $rawLogo ? \App\Models\Product::resolveImageUrl($rawLogo) : null;

                if ($logoUrl) {
                    return new \Illuminate\Support\HtmlString('
                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                            <img src="' . htmlspecialchars($logoUrl) . '" alt="' . htmlspecialchars($siteName) . '" style="height: 44px; max-height: 44px; width: auto; object-fit: contain;" />
                            <span style="font-weight: 700; font-size: 18px; color: #1e293b; letter-spacing: -0.02em;">' . htmlspecialchars($siteName) . '</span>
                        </div>
                    ');
                }

                return new \Illuminate\Support\HtmlString('
                    <span style="font-weight: 800; font-size: 20px; color: #9f582c; letter-spacing: -0.02em;">' . htmlspecialchars($siteName) . '</span>
                ');
            })
            ->brandLogoHeight('44px')
            ->favicon(function () {
                $rawFavicon = \App\Models\Setting::get('favicon') ?: \App\Models\Setting::get('logo');
                if (! $rawFavicon) {
                    return null;
                }
                $url = \App\Models\Product::resolveImageUrl($rawFavicon);
                if (! $url) {
                    return null;
                }
                $v = substr(md5((string) $rawFavicon), 0, 8);
                return $url . (str_contains($url, '?') ? '&' : '?') . 'v=' . $v;
            })
            ->colors([
                // Matches the storefront's --primary (#9f582c).
                'primary' => Color::hex('#9f582c'),
                'gray' => Color::Stone,
            ])
            ->font('Inter')
            ->sidebarCollapsibleOnDesktop()
            ->profile(\App\Filament\Pages\Auth\EditProfile::class, isSimple: false)
            ->navigationGroups([
                'Catalogue',
                'Sales',
                'Delivery',
                'Site Customization',
                'Administration',
            ])
            ->userMenuItems([
                \Filament\Actions\Action::make('profile')
                    ->label('My Profile')
                    ->icon('heroicon-o-user-circle')
                    ->url(fn () => filament()->getProfileUrl()),
                // One click from any admin screen to the live storefront.
                \Filament\Actions\Action::make('viewSite')
                    ->label('View site')
                    ->icon('heroicon-o-globe-alt')
                    ->url(fn () => config('app.storefront_url', 'https://lookstudiobd.com'))
                    ->openUrlInNewTab(),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->resources([
                \App\Filament\Resources\Articles\ArticleResource::class,
            ])
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                \App\Filament\Widgets\QuickActionsWidget::class,
                \App\Filament\Widgets\StoreOverview::class,
                \App\Filament\Widgets\SalesChart::class,
                \App\Filament\Widgets\OrderStatusChart::class,
                \App\Filament\Widgets\LatestOrders::class,
                \App\Filament\Widgets\TopSellingProducts::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
