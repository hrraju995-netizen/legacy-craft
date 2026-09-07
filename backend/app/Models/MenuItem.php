<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'is_mega' => 'boolean',
        'open_in_new_tab' => 'boolean',
        'columns' => 'integer',
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')
            ->where('is_active', true)
            ->orderBy('position')
            ->with('children');
    }

    /**
     * Resolve the item to a real storefront path. Admins pick a type and a
     * target; the URL is derived, so a renamed category never leaves a dead
     * link in the menu.
     */
    public function getResolvedUrlAttribute(): string
    {
        return match ($this->link_type) {
            'category' => '/categories/'.optional(Category::find($this->linkable_id))->slug,
            'product' => '/products/'.optional(Product::find($this->linkable_id))->slug,
            'page' => '/'.optional(Page::find($this->linkable_id))->slug,
            'room' => '/products?room='.optional(Room::find($this->linkable_id))->slug,
            default => $this->url ?: '/',
        };
    }
}
