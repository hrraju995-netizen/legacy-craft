<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Catalogue first — SiteSeeder builds menus from the categories.
        $this->call([
            SizeSeeder::class,
            CatalogSeeder::class,
            SiteSeeder::class,
            PartnerSeeder::class,
        ]);
    }
}
