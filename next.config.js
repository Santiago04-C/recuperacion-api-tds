/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose', '@prisma/client']
  }
}

module.exports = nextConfig
