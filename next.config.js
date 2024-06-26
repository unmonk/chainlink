/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["mysql2"],
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
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "chainlink.st",
      },
    ],
  },
}

module.exports = nextConfig
