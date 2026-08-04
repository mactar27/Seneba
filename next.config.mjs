/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Silence Turbopack warning from plugins adding webpack config
  turbopack: {},
}

export default nextConfig
