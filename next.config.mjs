/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.jotform.com",
        pathname: "/uploads/**"
      }
    ]
  }
};

export default nextConfig;
