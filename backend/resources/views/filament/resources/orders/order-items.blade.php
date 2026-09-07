@php
    $order = $getRecord();
    $items = $order?->items ?? collect();
@endphp

<div class="space-y-4">
    <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs">
        <table class="w-full text-left text-sm divide-y divide-gray-200 dark:divide-gray-800" style="width: 100%; border-collapse: collapse;">
            <thead class="bg-gray-50/75 dark:bg-gray-800/75 text-xs uppercase font-semibold text-gray-600 dark:text-gray-300">
                <tr>
                    <th scope="col" class="px-4 py-3.5">Product</th>
                    <th scope="col" class="px-4 py-3.5">Variant / Option</th>
                    <th scope="col" class="px-4 py-3.5 text-right">Unit Price</th>
                    <th scope="col" class="px-4 py-3.5 text-center">Quantity</th>
                    <th scope="col" class="px-4 py-3.5 text-right">Line Total</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-800 dark:text-gray-200">
                @forelse($items as $item)
                    <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                        <td class="px-4 py-3.5" style="vertical-align: middle;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                @if($item->product_image)
                                    <img src="{{ \App\Models\Product::resolveImageUrl($item->product_image) }}" 
                                         alt="{{ $item->product_name }}" 
                                         style="width: 50px; height: 50px; min-width: 50px; max-width: 50px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(156, 163, 175, 0.3); flex-shrink: 0;" />
                                @else
                                    <div style="width: 50px; height: 50px; min-width: 50px; max-width: 50px; border-radius: 8px; border: 1px solid rgba(156, 163, 175, 0.3); background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #9ca3af; flex-shrink: 0;">
                                        No img
                                    </div>
                                @endif
                                <div>
                                    <div style="font-weight: 700; font-size: 13.5px; line-height: 1.3;" class="text-gray-900 dark:text-white">
                                        {{ $item->product_name }}
                                    </div>
                                    @if($item->product_sku)
                                        <div style="font-size: 11px; color: #9ca3af; font-family: monospace; margin-top: 2px;">SKU: {{ $item->product_sku }}</div>
                                    @endif
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3.5 text-sm">
                            @if($item->variant_name)
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                                    {{ $item->variant_name }}
                                </span>
                            @else
                                <span class="text-xs text-gray-400">Default</span>
                            @endif
                        </td>
                        <td class="px-4 py-3.5 text-right font-medium">
                            ৳{{ number_format($item->unit_price / 100) }}
                        </td>
                        <td class="px-4 py-3.5 text-center font-bold">
                            <span class="inline-block px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs">
                                {{ $item->quantity }}
                            </span>
                        </td>
                        <td class="px-4 py-3.5 text-right font-black text-gray-900 dark:text-white">
                            ৳{{ number_format($item->line_total / 100) }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-4 py-8 text-center text-gray-400 italic">
                            No products found in this order.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @if($order)
        <div class="flex justify-end pt-1">
            <div class="w-full sm:w-72 bg-gray-50/70 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200/80 dark:border-gray-800 text-xs space-y-2">
                <div class="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span class="font-semibold text-gray-900 dark:text-white">৳{{ number_format($order->subtotal / 100) }}</span>
                </div>
                @if($order->discount_total > 0)
                    <div class="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Discount</span>
                        <span class="font-semibold">-৳{{ number_format($order->discount_total / 100) }}</span>
                    </div>
                @endif
                <div class="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                        {{ $order->shipping_total > 0 ? '৳' . number_format($order->shipping_total / 100) : 'Free' }}
                    </span>
                </div>
                <div class="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-baseline text-sm">
                    <span class="font-bold text-gray-900 dark:text-white">Grand Total</span>
                    <span class="font-black text-base text-primary-600 dark:text-primary-400">৳{{ number_format($order->grand_total / 100) }}</span>
                </div>
            </div>
        </div>
    @endif
</div>
