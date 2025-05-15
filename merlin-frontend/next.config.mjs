/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Replace 'http://192.168.1.3' with your actual hostname
    remotePatterns: [
      {
        protocol: "http", // You can specify protocol if needed
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;

