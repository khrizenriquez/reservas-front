const nextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; base-uri 'self'; connect-src 'self' https://umg-api-django.onrender.com; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: https://umg.edu.gt; manifest-src 'self'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; worker-src 'self'"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=()"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          }
        ]
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
