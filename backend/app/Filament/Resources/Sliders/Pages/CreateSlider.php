<?php

namespace App\Filament\Resources\Sliders\Pages;

use App\Filament\Resources\Sliders\SliderResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSlider extends CreateRecord
{
    protected static string $resource = SliderResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['placement'] = 'hero_slide';
        return $data;
    }
}
