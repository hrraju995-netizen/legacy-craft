<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;

class QuickActionsWidget extends Widget
{
    protected static ?int $sort = 0; // Show at the very top of dashboard

    protected int|string|array $columnSpan = 'full';

    protected string $view = 'filament.widgets.quick-actions';
}
