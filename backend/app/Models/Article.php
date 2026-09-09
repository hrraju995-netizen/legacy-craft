<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
        'tags' => 'array',
    ];

    protected static function booted(): void
    {
        static::saving(function (self $article) {
            if (blank($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
            if ($article->is_published && blank($article->published_at)) {
                $article->published_at = now();
            }
        });

        static::saved(function () {
            \Illuminate\Support\Facades\Cache::forget('api.site.home');
            \Illuminate\Support\Facades\Cache::forget('api.site.config');
        });

        static::deleted(function () {
            \Illuminate\Support\Facades\Cache::forget('api.site.home');
            \Illuminate\Support\Facades\Cache::forget('api.site.config');
        });
    }

    public static function seedDefaults(): void
    {
        $defaults = [
            [
                'title' => 'Kids Room Study Set: How to Create an Inspiring Learning Corner',
                'bangla_title' => 'বাচ্চাদের পড়ার ঘর সাজানোর আধুনিক আইডিয়া ও সঠিক স্টাডি সেট নির্বাচন',
                'slug' => 'kids-room-study-set-design-guide',
                'category' => 'Kids Room',
                'image' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
                'excerpt' => 'A dedicated, child-friendly study space nurtures focus, good posture, and creativity. Learn how to choose the right ergonomic desk, rounded-edge furniture, and non-toxic materials.',
                'content' => '<p>Designing a study environment for children requires a delicate balance of ergonomic comfort, safety, and visual stimulation. When children have a dedicated workspace tailored to their height and natural habits, their attention span and excitement for learning increase remarkably.</p><h3>1. Prioritizing Safety: Rounded Corners & Non-Toxic Finishes</h3><p>Children are naturally active. When choosing study tables and storage shelves for kids, always verify that the edges are smoothly beveled or rounded. Avoid sharp 90-degree corners that pose collision hazards. Look for eco-friendly, zero-VOC water-based polyurethane or lacquer finishes that do not release harmful chemical fumes into the bedroom air.</p><h3>2. Strategic Lighting: Preventing Eye Fatigue</h3><p>Position the study desk adjacent to a natural light source (such as a window) rather than directly facing it, which can cause excessive glare on notebooks and computer screens. Complement daytime natural light with an adjustable 4000K warm-white LED desk lamp that illuminates work surfaces without harsh shadows.</p><h3>3. Smart Storage to Minimize Clutter</h3><p>A cluttered desk easily distracts younger minds. Incorporate vertical pegboards, shallow drawers with dividers, and low-height cubby shelves. Low shelves empower kids to organize their own school bags, art supplies, and storybooks independently, building healthy organizational habits from an early age.</p>',
                'author_name' => 'Ar. Tanzila Rahman',
                'author_role' => 'Senior Interior Architect',
                'author_avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                'read_time' => '5 min read',
                'tags' => ['Kids Furniture', 'Study Desk', 'Ergonomics', 'Interior Design'],
                'related_category_slug' => 'classroom-furniture',
                'is_published' => true,
                'is_featured' => true,
                'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'Chef Pro Kitchen Cabinet: Planning the Perfect Modular Kitchen Layout',
                'bangla_title' => 'মডুলার কিচেন ক্যাবিনেটের সঠিক পরিকল্পনা ও স্থায়িত্ব বৃদ্ধির গাইড',
                'slug' => 'modern-kitchen-cabinet-planning-guide',
                'category' => 'Kitchen Furniture',
                'image' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
                'excerpt' => 'A great kitchen combines the work triangle principle, moisture-resistant carcass materials, and high-quality soft-close hardware to deliver decades of seamless culinary enjoyment.',
                'content' => '<p>The kitchen is undoubtedly the operational heart of any modern home. Whether cooking quick weekday meals or hosting festive family banquets, your kitchen cabinetry dictates the flow, efficiency, and cleanliness of your daily routine.</p><h3>1. Mastering the Kitchen Work Triangle</h3><p>The golden rule of kitchen ergonomics is the \'Work Triangle\' connecting the three primary zones: the Refrigerator (food storage), the Sink (food preparation & cleaning), and the Cooktop (cooking). The distance between any two points should ideally be between 4 and 9 feet, ensuring zero wasted steps and preventing cross-traffic accidents.</p><h3>2. Moisture & Heat Resistance in Bangladesh</h3><p>Given our climate\'s high humidity and heavy spices, opt for Marine-grade HMR (High Moisture Resistant) board or Stainless Steel 304 grade for sink base units to ensure 100% termite and water immunity.</p><h3>3. Upper vs. Base Cabinets: Maximum Storage Utility</h3><p>Modern kitchens favor deep tandem drawers over traditional swing-door lower cabinets. Deep pull-out drawers allow you to see and reach heavy cast iron cookware, spice racks, and pantry staples from above without bending down or searching blindly in dark corners.</p>',
                'author_name' => 'Engr. Rafiqul Islam',
                'author_role' => 'Modular Kitchen Specialist',
                'author_avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                'read_time' => '6 min read',
                'tags' => ['Modular Kitchen', 'Kitchen Cabinets', 'Storage', 'Stainless Steel'],
                'related_category_slug' => 'kitchen-essentials',
                'is_published' => true,
                'is_featured' => false,
                'published_at' => now()->subDays(7),
            ],
            [
                'title' => 'Fortress Biometric Digital Safe: Protecting What Truly Matters at Home',
                'bangla_title' => 'বাসার নিরাপত্তা ও মূল্যবান সামগ্রী সংরক্ষণে ডিজিটাল স্মার্ট লকার নির্বাচন',
                'slug' => 'fortress-biometric-digital-safe-security-guide',
                'category' => 'Storage & Shelves',
                'image' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
                'excerpt' => 'Modern home security blends heavy-gauge cold rolled steel, optical fingerprint sensors, and discreet closet integration to safeguard precious jewelry, passports, and vital deeds.',
                'content' => '<p>In an unpredictable world, keeping your essential family assets—birth certificates, property deeds, heirlooms, and reserve emergency funds—in an ordinary wardrobe drawer leaves them vulnerable to theft and accidental loss. A biometric home safe provides peace of mind with instant single-touch access.</p><h3>1. Advanced Biometric Scanning vs. Keypads</h3><p>While traditional mechanical combination locks and digital keypads work well, biometric fingerprint scanners offer swift 0.5-second access without the risk of forgetting a code or losing a physical key. Modern semiconductor sensors cannot be tricked by counterfeit rubber fingerprints and store multiple family profiles safely.</p><h3>2. Installation Is Everything</h3><p>A safe is only as secure as its anchoring. Always anchor your digital safe into a solid concrete floor or structural wall stud using hardened expansion anchor bolts. An unbolted safe, no matter how heavy, can be moved by burglars to be cracked elsewhere.</p>',
                'author_name' => 'Security Advisory Team',
                'author_role' => 'Home Safety Specialists',
                'author_avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
                'read_time' => '4 min read',
                'tags' => ['Digital Safe', 'Home Security', 'Smart Locker', 'Storage'],
                'related_category_slug' => 'storage-organizer',
                'is_published' => true,
                'is_featured' => false,
                'published_at' => now()->subDays(14),
            ],
        ];

        foreach ($defaults as $item) {
            self::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderByDesc('published_at');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function getResolvedImageAttribute(): ?string
    {
        return Product::resolveImageUrl($this->image);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
