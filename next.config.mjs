const googleClientId =
  process.env.OAUTH_CLIENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "";

const apiBaseUrl = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  ""
).replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['recharts'],
  env: {
    OAUTH_CLIENT_ID: googleClientId,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: googleClientId,
    API_BASE_URL: apiBaseUrl,
    NEXT_PUBLIC_API_BASE_URL: apiBaseUrl,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
