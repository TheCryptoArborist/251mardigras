/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/schedule/krewe-of-saint-jude-2027",
        destination: "/schedule#2027-02-06",
        permanent: true
      },
      {
        source: "/schedule/krewe-de-secondline-february-5-2027",
        destination: "/schedule#2027-02-07",
        permanent: true
      },
      {
        source: "/schedule/floral-parade-february-8-2027",
        destination: "/schedule/king-felix-iii-lundi-gras-2027",
        permanent: true
      }
    ];
  },
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
