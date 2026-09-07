<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Courier;
use App\Models\HomeSection;
use App\Models\Menu;
use App\Models\Page;
use App\Models\Setting;
use App\Models\ShippingZone;
use App\Models\Tooltip;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/** Default settings, menus, shipping zones and an admin login. */
class SiteSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@legacycraftstudio.com'],
            [
                'name' => 'Store Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // ---- settings -----------------------------------------------------
        $settings = [
            ['general', 'site_name', 'Legacy Craft Studio', 'text'],
            ['general', 'site_tagline', 'Handcrafted Furniture in Bangladesh', 'text'],
            ['general', 'logo', '/main-logo.png', 'image'],
            ['general', 'currency_symbol', '৳', 'text'],
            ['general', 'primary_color', '#9f582c', 'color'],

            ['topbar', 'topbar_enabled', '1', 'boolean'],
            ['topbar', 'topbar_phone', '+8801897711118', 'text'],
            ['topbar', 'topbar_text', '( 9:00 AM to 9:00 PM ) For Shopping & Design Assistance', 'text'],

            ['header', 'header_sticky', '1', 'boolean'],
            ['header', 'header_show_search', '1', 'boolean'],
            ['header', 'header_show_wishlist', '1', 'boolean'],

            ['footer', 'footer_address', 'Shop No: 33, Round Glass Bay, Level 5, Mirpur DOHS Shopping Complex, Dhaka', 'textarea'],
            ['footer', 'footer_phone', '+8801897711118', 'text'],
            ['footer', 'footer_phone_2', '+8801727090737', 'text'],
            ['footer', 'footer_email', 'support@legacycraftstudio.com', 'text'],
            ['footer', 'footer_copyright', '© Legacy Craft Studio. All Rights Reserved.', 'text'],

            ['social', 'facebook', 'https://facebook.com/legacycraftstudio', 'text'],
            ['social', 'instagram', 'https://instagram.com/legacycraftstudio', 'text'],
            ['social', 'youtube', 'https://youtube.com/@legacycraftstudio', 'text'],

            ['chat', 'whatsapp_number', '8801897711118', 'text'],
            ['chat', 'messenger_username', 'legacycraftstudio', 'text'],
            ['chat', 'chat_enabled', '1', 'boolean'],

            ['checkout', 'free_shipping_threshold', '50000', 'text'],
            ['checkout', 'cod_enabled', '1', 'boolean'],
            ['checkout', 'min_order_total', '0', 'text'],

            ['seo', 'meta_title', 'Legacy Craft Studio — Handcrafted Furniture in Bangladesh', 'text'],
            ['seo', 'meta_description', 'Handcrafted beds, sofas, desks and office furniture built in Bangladesh.', 'textarea'],
            ['seo', 'google_analytics_id', '', 'text'],
            ['seo', 'facebook_pixel_id', '', 'text'],
        ];

        foreach ($settings as [$group, $key, $value, $type]) {
            Setting::updateOrCreate(['key' => $key], compact('group', 'value', 'type'));
        }

        // ---- shipping -----------------------------------------------------
        $zones = [
            ['Inside Dhaka', 'inside-dhaka', 'Regular Delivery (1-2 days)', 7000, 1, 2, true],
            ['Sub-Dhaka', 'sub-dhaka', 'Savar, Gazipur, Narayanganj (2-3 days)', 10000, 2, 3, false],
            ['Outside Dhaka', 'outside-dhaka', 'Courier Delivery (2-4 days)', 13000, 2, 4, false],
        ];

        foreach ($zones as $i => [$name, $slug, $note, $rate, $min, $max, $default]) {
            ShippingZone::updateOrCreate(['slug' => $slug], [
                'name' => $name,
                'note' => $note,
                'rate' => $rate,                 // paisa
                'free_above' => 5000000,         // ৳50,000
                'min_days' => $min,
                'max_days' => $max,
                'position' => $i,
                'is_active' => true,
                'is_default' => $default,
            ]);
        }

        Courier::updateOrCreate(['code' => 'steadfast'], [
            'name' => 'Steadfast Courier',
            'base_url' => 'https://portal.packzy.com/api/v1',
            'is_active' => false,   // switch on after entering real credentials
            'is_default' => true,
        ]);

        // ---- menus --------------------------------------------------------
        $header = Menu::updateOrCreate(
            ['location' => 'header_main'],
            ['name' => 'Header Main Menu', 'is_active' => true]
        );

        $header->allItems()->delete();

        $header->allItems()->create([
            'label' => 'All Products', 'link_type' => 'url', 'url' => '/products', 'position' => 0,
        ]);

        $products = $header->allItems()->create([
            'label' => 'Products', 'link_type' => 'url', 'url' => '/categories',
            'is_mega' => true, 'columns' => 4, 'position' => 1,
        ]);

        foreach (Category::active()->orderBy('position')->get() as $i => $category) {
            $header->allItems()->create([
                'parent_id' => $products->id,
                'label' => $category->name,
                'link_type' => 'category',
                'linkable_id' => $category->id,
                'image' => $category->image,
                'position' => $i,
            ]);
        }

        $footerMenu = Menu::updateOrCreate(
            ['location' => 'footer_company'],
            ['name' => 'Footer — Company', 'is_active' => true]
        );
        $footerMenu->allItems()->delete();
        foreach ([['About Us', '/about'], ['Contact Us', '/contact'], ['All Products', '/products']] as $i => [$label, $url]) {
            $footerMenu->allItems()->create(compact('label', 'url') + ['position' => $i]);
        }

        // ---- homepage sections -------------------------------------------
        $sections = [
            ['hero', 'HeroBannerGrid', null],
            ['shop_by_category', 'ShopByCategory', 'Shop by Category'],
            ['explore_series', 'ExploreSeries', 'Explore Our Series'],
            ['new_arrivals', 'NewArrivals', 'New Arrivals'],
            ['get_the_look', 'GetTheLook', 'Get the Look'],
            ['room_inspiration', 'RoomInspirationSlider', 'Room Inspiration'],
            ['meeting_banner', 'MeetingBannerSection', null],
            ['classroom', 'ClassroomFurnitureSection', 'Classroom Furniture'],
            ['who_trusts_us', 'WhoTrustsUsSection', 'Who Trusts Us'],
            ['latest_insights', 'LatestInsightsSection', 'Latest Insights'],
        ];

        foreach ($sections as $i => [$key, $component, $title]) {
            HomeSection::updateOrCreate(['key' => $key], [
                'component' => $component,
                'title' => $title,
                'position' => $i,
                'is_active' => true,
            ]);
        }

        // ---- pages --------------------------------------------------------
        foreach ([
            ['Privacy Policy', 'privacy-policy'],
            ['Terms & Conditions', 'terms-and-conditions'],
            ['Shipping & Returns', 'shipping-and-returns'],
        ] as $i => [$title, $slug]) {
            Page::updateOrCreate(['slug' => $slug], [
                'title' => $title,
                'content' => "<p>Replace this text from the admin panel.</p>",
                'is_published' => true,
                'show_in_footer' => true,
                'published_at' => now(),
            ]);
        }

        Tooltip::updateOrCreate(
            ['anchor' => 'checkout.shipping'],
            [
                'context' => 'checkout',
                'title' => 'Delivery charge',
                'content' => 'Free delivery on orders over ৳50,000.',
                'placement' => 'top',
            ]
        );

        $this->command->info('Seeded settings, menus, shipping zones and admin user.');
    }
}
