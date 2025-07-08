import type { NextConfig } from "next";

const nextI18NextConfig = require("./next-i18next.config");

const nextConfig: NextConfig = {
  i18n: nextI18NextConfig.i18n,
  devIndicators: false,
};

export default nextConfig;
