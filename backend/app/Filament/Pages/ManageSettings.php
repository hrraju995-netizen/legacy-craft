<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;

/**
 * One screen for every site-customization setting: topbar, header, footer,
 * SEO, social, checkout, chat. Fields are built from the settings table, so
 * adding a row in the database adds a field here — no code change needed.
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

                return match ($setting->type) {
                    'boolean' => Toggle::make($setting->key)->label($label)->helperText($setting->hint),
                    'textarea' => Textarea::make($setting->key)->label($label)->rows(3)
                        ->helperText($setting->hint)->columnSpanFull(),
                    'image' => FileUpload::make($setting->key)->label($label)
                        ->image()->directory('settings')->helperText($setting->hint),
                    'color' => ColorPicker::make($setting->key)->label($label)->helperText($setting->hint),
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
