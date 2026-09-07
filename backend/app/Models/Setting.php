<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Key/value store behind every "site customization" screen: header, footer,
 * topbar, SEO, checkout, social links, floating chat.
 */
class Setting extends Model
{
    protected $guarded = [];

    public const CACHE_KEY = 'settings.all';

    protected static function booted(): void
    {
        static::saved(function () {
            Cache::forget(self::CACHE_KEY);
            Cache::forget('api.site.config');
            Cache::forget('api.site.home');
        });
        static::deleted(function () {
            Cache::forget(self::CACHE_KEY);
            Cache::forget('api.site.config');
            Cache::forget('api.site.home');
        });
    }

    /** All settings as a flat key => value map, cached. */
    public static function all_cached(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            return static::query()->get()->mapWithKeys(function (self $setting) {
                return [$setting->key => $setting->castValue()];
            })->all();
        });
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return self::all_cached()[$key] ?? $default;
    }

    public static function put(string $key, mixed $value, string $group = 'general', string $type = 'text'): self
    {
        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => is_array($value) ? json_encode($value) : $value,
                'group' => $group,
                'type' => $type,
            ]
        );
    }

    /** Grouped map, e.g. Setting::group('header'). */
    public static function group(string $group): array
    {
        return static::where('group', $group)->get()
            ->mapWithKeys(fn (self $s) => [$s->key => $s->castValue()])
            ->all();
    }

    public function castValue(): mixed
    {
        return match ($this->type) {
            'boolean' => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode($this->value ?? '[]', true),
            default => $this->value,
        };
    }
}
