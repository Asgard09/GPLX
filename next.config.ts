import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard",
        has: [
          {
            type: "cookie",
            key: "authenticated",
            value: "true",
          },
        ],
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
