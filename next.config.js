
const nextConfig = {
  /* config options here */
  env: {
    // Stamped into the client bundle at build time, so the running JavaScript
    // knows which build it is. Lets the client compare "the code I am executing"
    // against the build the server is serving, with no browser-side bookkeeping.
    // NEXT_PUBLIC_BUILD_SHA is an override so the update flow can be rehearsed
    // locally by pointing the bundle at a pretend-old build; in production it
    // is unset and this falls back to the SHA Vercel injects.
    NEXT_PUBLIC_BUILD_SHA: process.env.NEXT_PUBLIC_BUILD_SHA || process.env.VERCEL_GIT_COMMIT_SHA || '',
  },
  async rewrites() {
    return [
      {
        source: '/proxy-site/:path*',
        destination: 'https://external-site.com/:path*',
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's.yimg.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.fineartamerica.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
