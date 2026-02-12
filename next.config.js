/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 禁用静态页面生成，使用动态渲染
  staticPageGenerationTimeout: 1000,
}

module.exports = nextConfig
