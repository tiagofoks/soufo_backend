// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config settings
  output: 'export', // Isso força o build a ser 100% estático
  experimental: {
    turbopack: {
      root: './dev/orcamento', // Set this to your actual project directory
    },
  },
};

module.exports = nextConfig;