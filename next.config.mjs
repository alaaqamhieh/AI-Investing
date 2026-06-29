/** @type {import('next').NextConfig} */

// For GitHub Pages project sites the app is served from /<repo>.
// Override with BASE_PATH="" for root deploys (e.g. Vercel/custom domain).
const basePath = process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS ? "/AI-Investing" : "");

const nextConfig = {
  reactStrictMode: true,
  // Static HTML export — no server needed; renders the committed snapshot at build.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
