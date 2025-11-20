// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config settings
  experimental: {
    turbopack: {
      root: './dev/orcamento', // Set this to your actual project directory
    },
  },
};

module.exports = nextConfig;