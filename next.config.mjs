/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GUMROAD_USERNAME: process.env.GUMROAD_USERNAME,
    NEXT_PUBLIC_GUMROAD_PRODUCT_ID: process.env.GUMROAD_PRODUCT_ID
  }
};

export default nextConfig;
