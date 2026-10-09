<?php

namespace Database\Seeders;

use App\Models\Size;
use Illuminate\Database\Seeder;

class SizeSeeder extends Seeder
{
    public function run(): void
    {
        $sizes = [
            ['name' => 'Standard', 'slug' => 'standard', 'dimensions' => null, 'position' => 0],
            ['name' => 'Single (3\' × 6\')', 'slug' => 'single-3x6', 'dimensions' => '3ft x 6ft', 'position' => 1],
            ['name' => 'Semi Double (4\' × 6\')', 'slug' => 'semi-double-4x6', 'dimensions' => '4ft x 6ft', 'position' => 2],
            ['name' => 'Double (4.5\' × 6.5\')', 'slug' => 'double-45x65', 'dimensions' => '4.5ft x 6.5ft', 'position' => 3],
            ['name' => 'Queen (5\' × 7\')', 'slug' => 'queen-5x7', 'dimensions' => '5ft x 7ft', 'position' => 4],
            ['name' => 'King (6\' × 7\')', 'slug' => 'king-6x7', 'dimensions' => '6ft x 7ft', 'position' => 5],
            ['name' => 'Small (S)', 'slug' => 'small-s', 'dimensions' => null, 'position' => 6],
            ['name' => 'Medium (M)', 'slug' => 'medium-m', 'dimensions' => null, 'position' => 7],
            ['name' => 'Large (L)', 'slug' => 'large-l', 'dimensions' => null, 'position' => 8],
            ['name' => 'Custom Size', 'slug' => 'custom-size', 'dimensions' => null, 'position' => 9],
        ];

        foreach ($sizes as $s) {
            Size::firstOrCreate(['slug' => $s['slug']], $s);
        }
    }
}
