/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  output: 'export',
  basePath: isGitHubPages ? '/timphongtro' : '',
  assetPrefix: isGitHubPages ? '/timphongtro/' : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
