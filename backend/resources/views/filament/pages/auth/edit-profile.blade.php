<x-filament-panels::page>
    @php
        $user = filament()->auth()->user();
        $avatarUrl = $user?->getFilamentAvatarUrl();
    @endphp

    {{-- Executive Luxury Admin Hero Header --}}
    <div style="background: linear-gradient(135deg, #1c1917 0%, #2e1a10 55%, #78350f 100%); border-radius: 18px; padding: 24px 28px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); margin-bottom: 24px; position: relative; overflow: hidden; box-sizing: border-box;">
        {{-- Ambient soft glow in background --}}
        <div style="position: absolute; right: -30px; top: -30px; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, rgba(217, 119, 6, 0.25) 0%, transparent 70%); pointer-events: none;"></div>

        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px; position: relative; z-index: 10;">
            <div style="display: flex; align-items: center; gap: 20px;">
                {{-- Circular Photo with Active Ring --}}
                <div style="position: relative; flex-shrink: 0;">
                    <img 
                        src="{{ $avatarUrl }}" 
                        alt="{{ $user?->name }}" 
                        style="width: 80px; height: 80px; border-radius: 20px; object-fit: cover; border: 3px solid rgba(251, 191, 36, 0.45); box-shadow: 0 6px 20px rgba(0,0,0,0.4); background: #292524; display: block;"
                    />
                    <div style="position: absolute; bottom: -3px; right: -3px; width: 20px; height: 20px; border-radius: 50%; background: #22c55e; border: 2.5px solid #1c1917; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3);" title="Active Session">
                        <span style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></span>
                    </div>
                </div>

                <div>
                    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                            {{ $user?->name }}
                        </h2>
                        <span style="display: inline-flex; align-items: center; gap: 5px; padding: 3px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: rgba(245, 158, 11, 0.2); color: #fde68a; border: 1px solid rgba(245, 158, 11, 0.4); letter-spacing: 0.02em;">
                            <svg style="width: 13px; height: 13px; color: #fbbf24;" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd"/>
                            </svg>
                            <span>{{ $user?->role_label ?? 'Administrator' }}</span>
                        </span>
                    </div>

                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #e7e5e4; display: flex; flex-wrap: wrap; align-items: center; gap: 8px;">
                        <span style="font-family: monospace; color: #f5f5f4;">{{ $user?->email }}</span>
                        <span style="color: #78716c;">•</span>
                        <span style="color: #a8a29e; font-size: 12px;">Admin ID: #{{ $user?->id }}</span>
                        <span style="color: #78716c;">•</span>
                        <span style="color: #a8a29e; font-size: 12px;">Joined {{ $user?->created_at?->format('M d, Y') ?? 'Recently' }}</span>
                    </p>

                    <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px;">
                        <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.08); color: #e7e5e4; border: 1px solid rgba(255,255,255,0.12);">
                            <span style="width: 6px; height: 6px; border-radius: 50%; background: #34d399;"></span>
                            Full Panel Access
                        </span>
                        <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.08); color: #e7e5e4; border: 1px solid rgba(255,255,255,0.12);">
                            <span>🔒</span>
                            Bcrypt 256-bit
                        </span>
                        <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.08); color: #e7e5e4; border: 1px solid rgba(255,255,255,0.12);">
                            <span>⚡</span>
                            Active Session
                        </span>
                    </div>
                </div>
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
                <a href="{{ config('app.storefront_url') }}" 
                   target="_blank" 
                   style="display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 10px; background: rgba(255,255,255,0.1); color: #ffffff; font-size: 12px; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: all 0.15s ease;"
                   onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                    <svg style="width: 15px; height: 15px; color: #fbbf24;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    <span>View Storefront</span>
                </a>
            </div>
        </div>
    </div>

    {{-- Form Sections --}}
    {{ $this->content }}
</x-filament-panels::page>
