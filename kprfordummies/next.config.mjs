/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/bilbatez.dev",
        destination: "https://bilbatez.dev",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
