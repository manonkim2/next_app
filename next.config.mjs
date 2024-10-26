/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 최적화도 비용이기 때문에 최적화할 url과 아닌것을 구분
  images: {
    remotePatterns: [{ hostname: 'avatars.githubusercontent.com' }],
  },
}

export default nextConfig
