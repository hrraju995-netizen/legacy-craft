<x-filament-widgets::widget>
    <div style="background: linear-gradient(135deg, #1c1917 0%, #292524 60%, #451a03 100%); color: #ffffff; border-radius: 16px; padding: 20px 24px; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); width: 100%; box-sizing: border-box;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(245, 158, 11, 0.2); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(245, 158, 11, 0.3); flex-shrink: 0;">
                    <svg style="width: 22px; height: 22px; color: #fbbf24;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                </div>
                <div>
                    <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">
                        Quick Hub & Actions
                    </h2>
                    <p style="margin: 3px 0 0 0; font-size: 12px; color: #d6d3d1;">
                        Add new products, configure sliders, manage banners, and check customer orders in one click.
                    </p>
                </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
                <!-- Add Product -->
                <a href="/admin/products/create" 
                   style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 10px; background: #d97706; color: #ffffff; font-size: 12px; font-weight: 600; text-decoration: none; box-shadow: 0 2px 8px rgba(217, 119, 6, 0.35); transition: transform 0.15s ease;"
                   onmouseover="this.style.background='#b45309'" onmouseout="this.style.background='#d97706'">
                    <svg style="width: 15px; height: 15px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                    </svg>
                    <span>+ New Product</span>
                </a>

                <!-- Manage Sliders -->
                <a href="/admin/sliders" 
                   style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.08); color: #f5f5f4; font-size: 12px; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,0.15); transition: background 0.15s ease;"
                   onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
                    <svg style="width: 15px; height: 15px; color: #fbbf24;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span>Sliders</span>
                </a>

                <!-- Manage Banners -->
                <a href="/admin/banners" 
                   style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.08); color: #f5f5f4; font-size: 12px; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,0.15); transition: background 0.15s ease;"
                   onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
                    <svg style="width: 15px; height: 15px; color: #34d399;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <span>Banners</span>
                </a>

                <!-- Manage Coupons -->
                <a href="/admin/coupons" 
                   style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.08); color: #f5f5f4; font-size: 12px; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,0.15); transition: background 0.15s ease;"
                   onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
                    <svg style="width: 15px; height: 15px; color: #c084fc;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                    </svg>
                    <span>Coupons</span>
                </a>

                <!-- Articles & Blog -->
                <a href="/admin/articles" 
                   style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.08); color: #f5f5f4; font-size: 12px; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,0.15); transition: background 0.15s ease;"
                   onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
                    <svg style="width: 15px; height: 15px; color: #38bdf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                    </svg>
                    <span>Articles & Blog</span>
                </a>

                <!-- Contact & Floating Chat Settings -->
                <a href="/admin/manage-settings" 
                   style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.08); color: #f5f5f4; font-size: 12px; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,0.15); transition: background 0.15s ease;"
                   onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
                    <svg style="width: 15px; height: 15px; color: #22c55e;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <span>Contact Bar</span>
                </a>

                <!-- View Live Storefront -->
                <a href="{{ config('app.storefront_url', 'https://lookstudiobd.com') }}" target="_blank"
                   style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 10px; background: rgba(255,255,255,0.04); color: #a8a29e; font-size: 12px; font-weight: 500; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); transition: color 0.15s ease;"
                   onmouseover="this.style.color='#ffffff'; this.style.borderColor='rgba(255,255,255,0.25)'" onmouseout="this.style.color='#a8a29e'; this.style.borderColor='rgba(255,255,255,0.1)'">
                    <svg style="width: 14px; height: 14px; color: #60a5fa;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    <span>View Store</span>
                </a>
            </div>
        </div>
    </div>
</x-filament-widgets::widget>


