/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@fleetpulse/shared'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
