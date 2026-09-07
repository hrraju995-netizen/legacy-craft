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
        $this->form->fill(
            Setting::all()->mapWithKeys(fn (Setting $s) => [$s->key => $s->castValue()])->all()
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
        return Setting::where('group', $group)->orderBy('position')->get()
            ->map(function (Setting $setting) {
                $label = $setting->label ?: str($setting->key)->replace('_', ' ')->title()->value();

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

            $setting->value = is_array($value) ? json_encode($value) : $value;
            $setting->save();
        }

        \Illuminate\Support\Facades\Cache::forget('settings.all');
        \Illuminate\Support\Facades\Cache::forget('api.site.config');
        \Illuminate\Support\Facades\Cache::forget('api.site.home');

        Notification::make()->success()->title('Settings saved successfully')->send();
    }
}
