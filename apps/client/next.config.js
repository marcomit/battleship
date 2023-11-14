/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental:{
    ppr: true,
    serverMinification: true,
    serverActions: true
  }
}

module.exports = nextConfig;