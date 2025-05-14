/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This is recommended for apps using @react-three/fiber
  transpilePackages: ["three"],
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;
