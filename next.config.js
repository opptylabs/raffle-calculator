/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://www.opptylabs.com/raffles',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
