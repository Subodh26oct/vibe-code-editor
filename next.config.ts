import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"*",
        port:'',
        pathname:"/**"
      }
    ]
  },
  async headers() {
    return [
      {
        // Apply COOP/COEP to all routes EXCEPT auth API routes
        // These headers are required for WebContainers (SharedArrayBuffer)
        // but break OAuth redirect flows from Google/GitHub
        source: '/:path((?!api/auth).*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
        ],
      },
    ];
  },
  reactStrictMode:false,
};

export default nextConfig;
