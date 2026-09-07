<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request and attach essential security headers to response.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        // Prevent clickjacking
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Enable browser XSS filtering
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Restrict referrer information sent with requests
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Restrict dangerous browser features
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

        return $response;
    }
}
