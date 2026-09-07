<?php

namespace App\Filament\Resources\Tooltips\Pages;

use App\Filament\Resources\Tooltips\TooltipResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTooltip extends EditRecord
{
    protected static string $resource = TooltipResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
