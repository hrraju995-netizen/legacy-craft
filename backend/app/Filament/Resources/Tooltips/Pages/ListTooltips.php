<?php

namespace App\Filament\Resources\Tooltips\Pages;

use App\Filament\Resources\Tooltips\TooltipResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTooltips extends ListRecords
{
    protected static string $resource = TooltipResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
