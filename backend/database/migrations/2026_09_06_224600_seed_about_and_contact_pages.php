<?php

use App\Models\Page;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Page::updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => 'About Us',
                'slug' => 'about',
                'excerpt' => 'At Legacy Craft Studio, we believe that furniture is more than just wood and fabric—it is the foundation of your living spaces.',
                'content' => '<h2>Crafting Elegance & Comfort For Your Living Spaces</h2>
<p>At Legacy Craft Studio, we believe that furniture is more than just wood and fabric—it is the foundation of your home’s story, style, and everyday comfort.</p>
<h3>Our Heritage & Vision</h3>
<p>Founded with a passion for superior interior aesthetics, Legacy Craft Studio brings you handpicked, durable, and sophisticated furniture pieces. Whether you are setting up a cozy apartment or revamping your corporate office, our curated collections blend elegance with unmatched functionality.</p>
<p>We prioritize premium materials, ergonomic designs, and sustainable sourcing to ensure every item adds long-lasting value to your lifestyle.</p>
<h3>Why Choose Us?</h3>
<ul>
  <li><strong>Premium Quality:</strong> Crafted from certified premium seasoned wood and top-grade fabrics built to withstand generations.</li>
  <li><strong>Safe Home Delivery:</strong> Reliable shipping and expert installation right inside your doorstep across the country.</li>
  <li><strong>Warranty Protection:</strong> Enjoy peace of mind with our extended structural warranty and customer support.</li>
  <li><strong>Dedicated Support:</strong> Our interior design consultants are ready to assist you in choosing the best pieces.</li>
</ul>',
                'template' => 'default',
                'is_published' => true,
                'show_in_footer' => false,
                'published_at' => now(),
            ]
        );

        Page::updateOrCreate(
            ['slug' => 'contact'],
            [
                'title' => 'Contact Us',
                'slug' => 'contact',
                'excerpt' => 'Have questions about our furniture or want to discuss a custom project? We are here to help.',
                'content' => '<h2>Let’s Design Your Legacy</h2>
<p>Have questions about our furniture, need custom dimensions, or want to discuss a corporate order? Our team is always ready to help you.</p>
<h3>Visit Our Studio</h3>
<p>Shop No: 33, Round Glass Bay, Level 5, Mirpur DOHS Shopping Complex, Dhaka, Bangladesh.</p>
<h3>Instant Support</h3>
<p>Reach out to us via phone, WhatsApp, or Facebook Messenger from 9:00 AM to 9:00 PM for shopping and design assistance.</p>',
                'template' => 'default',
                'is_published' => true,
                'show_in_footer' => false,
                'published_at' => now(),
            ]
        );

        \Illuminate\Support\Facades\Cache::forget('api.site.config');
    }

    public function down(): void
    {
    }
};
