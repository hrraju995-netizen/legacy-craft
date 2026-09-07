<?php

namespace Database\Seeders;

use App\Models\Partner;
use Illuminate\Database\Seeder;

class PartnerSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            [
                'name' => 'Prothom Alo',
                'position' => 1,
                'svg_logo' => '<svg viewBox="0 0 240 60" class="w-full h-12"><text x="0" y="42" fontFamily="serif" fontSize="34" fontWeight="bold" fill="#000">প্রথম আলো</text><circle cx="128" cy="18" r="8" fill="#ED1C24" /></svg>',
            ],
            [
                'name' => 'City Bank',
                'position' => 2,
                'svg_logo' => '<svg viewBox="0 0 200 60" class="w-full h-12"><path d="M10 35 L30 15 L50 35 L30 30 Z" fill="#ED1C24" /><path d="M25 45 L45 25 L65 45 L45 40 Z" fill="#ED1C24" /><text x="75" y="40" fontStyle="italic" fontSize="24" fontWeight="bold" fill="#ED1C24">city bank</text></svg>',
            ],
            [
                'name' => 'Pizza Hut',
                'position' => 3,
                'svg_logo' => '<svg viewBox="0 0 180 60" class="w-full h-12"><path d="M15 25 Q45 15 75 25 L80 32 Q45 22 10 32 Z" fill="#ED1C24" /><path d="M25 24 L45 5 L65 24 Z" fill="#ED1C24" /><text x="12" y="48" fontStyle="italic" fontSize="20" fontWeight="bold" fill="#ED1C24">Pizza Hut</text></svg>',
            ],
            [
                'name' => 'SSG',
                'position' => 4,
                'svg_logo' => '<svg viewBox="0 0 160 60" class="w-full h-12"><text x="0" y="42" fontStyle="italic" fontSize="36" fontWeight="900" fill="#8B208C">SSG</text><path d="M90 15 L105 25 L95 28 L110 40 L98 32 Z" fill="#F58220" /></svg>',
            ],
            [
                'name' => 'Pubali Bank',
                'position' => 5,
                'svg_logo' => '<svg viewBox="0 0 180 60" class="w-full h-12"><circle cx="30" cy="30" r="22" stroke="#008853" strokeWidth="3" fill="none" /><polygon points="30,12 36,25 50,25 38,33 43,46 30,38 17,46 22,33 10,25 24,25" fill="#008853" /><text x="60" y="38" fontSize="18" fontWeight="bold" fill="#008853">পুবালী ব্যাংক</text></svg>',
            ],
            [
                'name' => 'Herfy',
                'position' => 6,
                'svg_logo' => '<svg viewBox="0 0 160 60" class="w-full h-12"><path d="M10 25 Q40 5 70 25 Q40 35 10 25 Z" fill="#E31E24" /><text x="5" y="52" fontStyle="italic" fontSize="24" fontWeight="900" fill="#0055A5">HERFY</text></svg>',
            ],
            [
                'name' => 'KFC',
                'position' => 7,
                'svg_logo' => '<svg viewBox="0 0 160 60" class="w-full h-12"><rect x="10" y="5" width="50" height="50" rx="6" fill="#E31E24" /><text x="20" y="38" fontSize="18" fontWeight="bold" fill="#FFF">KFC</text><text x="70" y="40" fontStyle="italic" fontSize="28" fontWeight="900" fill="#E31E24">KFC</text></svg>',
            ],
            [
                'name' => 'bKash',
                'position' => 8,
                'svg_logo' => '<svg viewBox="0 0 160 60" class="w-full h-12"><text x="0" y="40" fontSize="28" fontWeight="bold" fill="#E2136E">bKash</text><polygon points="85,15 115,25 95,45" fill="#E2136E" /></svg>',
            ],
        ];

        foreach ($brands as $brand) {
            Partner::updateOrCreate(['name' => $brand['name']], $brand);
        }
    }
}
