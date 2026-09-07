/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    dangerouslyAllowLocalIP: true,
    // The old wildcard ('*.*') was not a valid hostname pattern, which is why
    // every <Image> had to be marked `unoptimized`. These are the hosts the
    // catalogue actually uses.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Product photos uploaded through the admin panel are served by Laravel.
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/storage/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
  },
  reactCompiler: true,
};

export default nextConfig;
