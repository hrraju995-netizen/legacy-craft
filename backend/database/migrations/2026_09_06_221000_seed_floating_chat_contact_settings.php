<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            [
                'group' => 'chat',
                'key' => 'chat_enabled',
                'value' => '1',
                'type' => 'boolean',
                'label' => 'Enable Floating Contact Hub (ভাসমান যোগাযোগ বাটন চালু রাখুন)',
                'hint' => 'ওয়েবসাইটের নিচে ডানে ভাসমান চ্যাট ও যোগাযোগের সব বাটন দেখাবে কি না',
                'position' => 1,
            ],
            [
                'group' => 'chat',
                'key' => 'whatsapp_enabled',
                'value' => '1',
                'type' => 'boolean',
                'label' => 'Enable WhatsApp (হোয়াটসঅ্যাপ বাটন চালু রাখুন)',
                'hint' => 'গ্রাহক সরাসরি হোয়াটসঅ্যাপে মেসেজ দিতে পারবে',
                'position' => 2,
            ],
            [
                'group' => 'chat',
                'key' => 'whatsapp_number',
                'value' => '8801897711118',
                'type' => 'text',
                'label' => 'WhatsApp Number (হোয়াটসঅ্যাপ নম্বর)',
                'hint' => 'কান্ট্রি কোডসহ নম্বর দিন (যেমন: 8801897711118)',
                'position' => 3,
            ],
            [
                'group' => 'chat',
                'key' => 'messenger_enabled',
                'value' => '1',
                'type' => 'boolean',
                'label' => 'Enable Messenger (ফেসবুক মেসেঞ্জার বাটন চালু রাখুন)',
                'hint' => 'গ্রাহক সরাসরি ফেসবুক মেসেঞ্জারে চ্যাট করতে পারবে',
                'position' => 4,
            ],
            [
                'group' => 'chat',
                'key' => 'messenger_username',
                'value' => 'legacycraftstudio',
                'type' => 'text',
                'label' => 'Messenger Username / Page (মেসেঞ্জার ইউজারনেম)',
                'hint' => 'ফেসবুক পেজ বা প্রোফাইলের ইউজারনেম (যেমন: legacycraftstudio)',
                'position' => 5,
            ],
            [
                'group' => 'chat',
                'key' => 'phone_enabled',
                'value' => '1',
                'type' => 'boolean',
                'label' => 'Enable Phone Call (সরাসরি কল বাটন চালু রাখুন)',
                'hint' => 'ক্লিক করলে সরাসরি কাস্টমার সাপোর্টে কল চলে যাবে',
                'position' => 6,
            ],
            [
                'group' => 'chat',
                'key' => 'phone_number',
                'value' => '+8801897711118',
                'type' => 'text',
                'label' => 'Phone Number (কল করার ফোন নম্বর)',
                'hint' => 'যেমন: +8801897711118',
                'position' => 7,
            ],
            [
                'group' => 'chat',
                'key' => 'email_enabled',
                'value' => '1',
                'type' => 'boolean',
                'label' => 'Enable Email (ইমেইল বাটন চালু রাখুন)',
                'hint' => 'ক্লিক করলে সরাসরি মেইল পাঠানোর ক্লায়েন্ট ওপেন হবে',
                'position' => 8,
            ],
            [
                'group' => 'chat',
                'key' => 'email_address',
                'value' => 'support@legacycraftstudio.com',
                'type' => 'text',
                'label' => 'Support Email Address (সাপোর্ট ইমেইল এড্রেস)',
                'hint' => 'যেমন: support@legacycraftstudio.com',
                'position' => 9,
            ],
        ];

        foreach ($settings as $item) {
            Setting::updateOrCreate(
                ['key' => $item['key']],
                $item
            );
        }

        \Illuminate\Support\Facades\Cache::forget('settings.all');
        \Illuminate\Support\Facades\Cache::forget('api.site.config');
        \Illuminate\Support\Facades\Cache::forget('api.site.home');
    }

    public function down(): void
    {
    }
};
