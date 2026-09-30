<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;

/**
 * One screen for every site-customization setting: theme, colors, typography,
 * topbar, header, footer, SEO, social, checkout, chat.
 */
class ManageSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static \UnitEnum|string|null $navigationGroup = "Site Customization";

    protected static ?string $navigationLabel = 'Site Settings';

    protected static ?string $title = 'Site Settings';

    protected static ?int $navigationSort = 1;

    protected string $view = 'filament.pages.manage-settings';

    public array $data = [];

    private const GROUPS = [
        'theme' => '🎨 Theme, Colors & Typography',
        'chat' => 'Floating Contact',
        'general' => 'General',
        'topbar' => 'Top Bar',
        'header' => 'Header',
        'footer' => 'Footer',
        'social' => 'Social Links',
        'checkout' => 'Checkout',
        'seo' => 'SEO',
    ];

    public function mount(): void
    {
        Setting::firstOrCreate(
            ['key' => 'favicon'],
            [
                'group' => 'general',
                'type' => 'image',
                'label' => 'Website Favicon',
                'hint' => 'Upload browser tab favicon (.png, .ico, .svg, .webp). Recommended size 32x32 or 64x64.',
                'position' => 3,
            ]
        );

        $defaultThemeSettings = [
            [
                'key' => 'primary_color',
                'group' => 'theme',
                'type' => 'color',
                'label' => 'Primary Brand Color',
                'hint' => 'Main brand color for badges, active navigation items, borders, and highlights (Default: #9f582c).',
                'value' => '#9f582c',
                'position' => 1,
            ],
            [
                'key' => 'secondary_color',
                'group' => 'theme',
                'type' => 'color',
                'label' => 'Secondary Brand Color',
                'hint' => 'Dark tone used for secondary buttons, contrast sections, and dark accents (Default: #1e293b).',
                'value' => '#1e293b',
                'position' => 2,
            ],
            [
                'key' => 'accent_color',
                'group' => 'theme',
                'type' => 'color',
                'label' => 'Accent & Highlight Color',
                'hint' => 'Used for discount badges, star ratings, and sale tags (Default: #d97706).',
                'value' => '#d97706',
                'position' => 3,
            ],
            [
                'key' => 'cart_button_color',
                'group' => 'theme',
                'type' => 'color',
                'label' => 'Add to Cart Button Background',
                'hint' => 'Background color of the Add to Cart button (Default: #1e293b).',
                'value' => '#1e293b',
                'position' => 4,
            ],
            [
                'key' => 'cart_button_text_color',
                'group' => 'theme',
                'type' => 'color',
                'label' => 'Add to Cart Button Text Color',
                'hint' => 'Text and icon color inside the Add to Cart button (Default: #ffffff).',
                'value' => '#ffffff',
                'position' => 5,
            ],
            [
                'key' => 'cart_button_hover_color',
                'group' => 'theme',
                'type' => 'color',
                'label' => 'Add to Cart Button Hover Color',
                'hint' => 'Background color when cursor hovers over Add to Cart (Default: #000000).',
                'value' => '#000000',
                'position' => 6,
            ],
            [
                'key' => 'buy_now_button_color',
                'group' => 'theme',
                'type' => 'color',
                'label' => 'Buy Now Button Background',
                'hint' => 'Background color of the Buy Now / Order Now button (Default: #9f582c).',
                'value' => '#9f582c',
                'position' => 7,
            ],
            [
                'key' => 'buy_now_button_text_color',
                'group' => 'theme',
                'type' => 'color',
                'label' => 'Buy Now Button Text Color',
                'hint' => 'Text color inside the Buy Now button (Default: #ffffff).',
                'value' => '#ffffff',
                'position' => 8,
            ],
            [
                'key' => 'cart_button_text',
                'group' => 'theme',
                'type' => 'text',
                'label' => 'Add to Cart Button Text',
                'hint' => 'Label displayed on the Cart button (e.g. "Add to Cart" or "কার্টে যোগ করুন").',
                'value' => 'Add to cart',
                'position' => 9,
            ],
            [
                'key' => 'buy_now_button_text',
                'group' => 'theme',
                'type' => 'text',
                'label' => 'Buy Now Button Text',
                'hint' => 'Label displayed on the Buy Now button (e.g. "Buy it now" or "অর্ডার করুন").',
                'value' => 'Buy it now',
                'position' => 10,
            ],
            [
                'key' => 'topbar_bg_color',
                'group' => 'theme',
                'type' => 'color',
                'label' => 'Top Bar Background Color',
                'hint' => 'Background color of the top bar strip (Default: #9f582c).',
                'value' => '#9f582c',
                'position' => 11,
            ],
            [
                'key' => 'topbar_text_color',
                'group' => 'theme',
                'type' => 'color',
                'label' => 'Top Bar Text Color',
                'hint' => 'Text color of the top bar strip (Default: #ffffff).',
                'value' => '#ffffff',
                'position' => 12,
            ],
            [
                'key' => 'body_font',
                'group' => 'theme',
                'type' => 'select',
                'label' => 'Body Typography (Website Main Font)',
                'hint' => 'Primary professional typography applied across all paragraphs, cards, and UI.',
                'value' => 'Plus Jakarta Sans',
                'position' => 13,
            ],
            [
                'key' => 'heading_font',
                'group' => 'theme',
                'type' => 'select',
                'label' => 'Heading Typography (Title Font)',
                'hint' => 'Font applied to all section headings (h1, h2, h3), banners, and product titles.',
                'value' => 'Plus Jakarta Sans',
                'position' => 14,
            ],
            [
                'key' => 'button_radius',
                'group' => 'theme',
                'type' => 'select',
                'label' => 'Button Corner Style (Roundness)',
                'hint' => 'Shape and roundness of buttons across the entire website.',
                'value' => 'full',
                'position' => 15,
            ],
        ];

        foreach ($defaultThemeSettings as $ts) {
            Setting::firstOrCreate(
                ['key' => $ts['key']],
                $ts
            );
        }

        $this->form->fill(
            Setting::all()->mapWithKeys(function (Setting $s) {
                $val = $s->castValue();
                if ($s->type === 'image' && is_string($val) && str_starts_with($val, '["')) {
                    $decoded = json_decode($val, true);
                    $val = is_array($decoded) && ! empty($decoded[0]) ? $decoded[0] : $val;
                }
                return [$s->key => $val];
            })->all()
        );
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Settings')->tabs(
                    collect(self::GROUPS)->map(fn ($label, $group) => Tabs\Tab::make($label)
                        ->schema([
                            Section::make()->schema($this->fieldsFor($group))->columns(2),
                        ])
                    )->values()->all()
                )->columnSpanFull(),
            ])
            ->statePath('data');
    }

    /** Turn each settings row into the right Filament field for its type. */
    private function fieldsFor(string $group): array
    {
        if ($group === 'general') {
            Setting::firstOrCreate(
                ['key' => 'favicon'],
                [
                    'group' => 'general',
                    'type' => 'image',
                    'label' => 'Website Favicon',
                    'hint' => 'Upload browser tab favicon (.png, .ico, .svg, .webp). Recommended size 32x32 or 64x64.',
                    'position' => 3,
                ]
            );
        }

        return Setting::where('group', $group)->orderBy('position')->get()
            ->map(function (Setting $setting) {
                $label = $setting->label ?: str($setting->key)->replace('_', ' ')->title()->value();

                if ($setting->key === 'favicon') {
                    return FileUpload::make($setting->key)
                        ->label('Website Favicon (ব্রাউজার ট্যাব আইকন)')
                        ->image()
                        ->directory('settings')
                        ->visibility('public')
                        ->imagePreviewHeight('48')
                        ->acceptedFileTypes(['image/png', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/svg+xml', 'image/jpeg', 'image/webp', 'image/gif'])
                        ->helperText('Upload tab icon (.png, .ico, .svg). Changes will reflect on both Dashboard and Storefront tabs.');
                }

                if ($setting->key === 'logo') {
                    return FileUpload::make($setting->key)
                        ->label($label)
                        ->image()
                        ->directory('settings')
                        ->visibility('public')
                        ->imagePreviewHeight('48')
                        ->helperText($setting->hint);
                }

                if ($setting->key === 'body_font') {
                    return Select::make($setting->key)
                        ->label($label)
                        ->options([
                            'Plus Jakarta Sans' => 'Plus Jakarta Sans (Ultra-Modern, Luxury E-Commerce Standard)',
                            'Outfit' => 'Outfit (Clean, High-End Minimalist)',
                            'Inter' => 'Inter (Modern, Tech & Corporate Precision)',
                            'Poppins' => 'Poppins (Warm, Friendly & Geometric)',
                            'DM Sans' => 'DM Sans (Scandinavian & Refined)',
                            'Playfair Display' => 'Playfair Display (Editorial Serif Luxury)',
                            'Geist' => 'Geist (Sleek Modern Standard)',
                            'Montserrat' => 'Montserrat (Bold & Contemporary)',
                        ])
                        ->default('Plus Jakarta Sans')
                        ->helperText($setting->hint);
                }

                if ($setting->key === 'heading_font') {
                    return Select::make($setting->key)
                        ->label($label)
                        ->options([
                            'Plus Jakarta Sans' => 'Plus Jakarta Sans (Harmonious Modern)',
                            'Outfit' => 'Outfit (Striking Geometric Titles)',
                            'Playfair Display' => 'Playfair Display (High-End Luxury Editorial Serif)',
                            'Cinzel' => 'Cinzel (Classical Heritage Luxury)',
                            'Inter' => 'Inter (Crisp Minimalist)',
                            'Poppins' => 'Poppins (Bold Geometric Modern)',
                        ])
                        ->default('Plus Jakarta Sans')
                        ->helperText($setting->hint);
                }

                if ($setting->key === 'button_radius') {
                    return Select::make($setting->key)
                        ->label($label)
                        ->options([
                            'full' => 'Pill Shape (Fully Rounded - Current Style)',
                            'xl' => 'Extra Large Rounded (16px - Soft Modern)',
                            'lg' => 'Large Rounded (12px - Sleek Contemporary)',
                            'md' => 'Medium Rounded (8px - Clean Subtle)',
                            'none' => 'Square / Sharp Edges (0px - Architectural Minimalist)',
                        ])
                        ->default('full')
                        ->helperText($setting->hint);
                }

                return match ($setting->type) {
                    'boolean' => Toggle::make($setting->key)->label($label)->helperText($setting->hint),
                    'textarea' => Textarea::make($setting->key)->label($label)->rows(3)
                        ->helperText($setting->hint)->columnSpanFull(),
                    'image' => FileUpload::make($setting->key)->label($label)
                        ->image()->directory('settings')->helperText($setting->hint),
                    'color' => ColorPicker::make($setting->key)->label($label)->helperText($setting->hint),
                    'select' => Select::make($setting->key)->label($label)->helperText($setting->hint),
                    default => TextInput::make($setting->key)->label($label)->helperText($setting->hint),
                };
            })->all();
    }

    public function save(): void
    {
        foreach ($this->form->getState() as $key => $value) {
            $setting = Setting::where('key', $key)->first();

            if (! $setting) {
                continue;
            }

            if ($setting->type === 'image') {
                if (is_array($value)) {
                    $first = collect($value)->flatten()->filter()->first();
                    $value = is_string($first) ? $first : null;
                }
                if (is_string($value) && str_starts_with($value, '["')) {
                    $decoded = json_decode($value, true);
                    $value = is_array($decoded) && ! empty($decoded[0]) ? $decoded[0] : $value;
                }
            }

            $setting->value = is_array($value) ? json_encode($value) : $value;
            $setting->save();

            // When favicon is saved, copy to public/favicon.ico for direct webserver serving
            if ($setting->key === 'favicon' && ! empty($setting->value)) {
                try {
                    $clean = ltrim(str_replace(['\\', 'public/', 'storage/'], ['/', '', ''], (string) $setting->value), '/');
                    $disk = \Illuminate\Support\Facades\Storage::disk('public');
                    if ($disk->exists($clean)) {
                        @copy($disk->path($clean), public_path('favicon.ico'));
                    }
                } catch (\Throwable $e) {
                    // Ignore copy error
                }
            }
        }

        \Illuminate\Support\Facades\Cache::forget('settings.all');
        \Illuminate\Support\Facades\Cache::forget('api.site.config');
        \Illuminate\Support\Facades\Cache::forget('api.site.home');

        Notification::make()->success()->title('Settings saved successfully')->send();
    }
}
