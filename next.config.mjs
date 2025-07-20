/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // We are telling Next.js that it is allowed to optimize
  // and display images from Shopify's CDN.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;