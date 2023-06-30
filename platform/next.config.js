/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@lens-protocol/wagmi"],
  images: {
    remotePatterns: [
      {
        hostname: 'ipfs.io',
      },
    ],
  },
}

module.exports = nextConfig
