import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: 'https://v0-ui-with-api-data.vercel.app/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
