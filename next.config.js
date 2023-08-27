/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.espncdn.com/**",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
    ],
  },
};

module.exports = nextConfig;
