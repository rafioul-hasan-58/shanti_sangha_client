const googleClientId =
  process.env.OAUTH_CLIENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OAUTH_CLIENT_ID: googleClientId,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: googleClientId,
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
