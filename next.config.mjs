/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  generateBuildId: async () => `release-${Math.random().toString(36).substring(2, 9)}`,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.output = config.output || {};
    config.output.devtoolModuleFilenameTemplate = "src/[resource-path]";
    return config;
  },
};

export default nextConfig;
