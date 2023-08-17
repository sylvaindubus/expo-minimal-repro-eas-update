import { ExpoConfig } from "@expo/config"
import { version } from "./package.json"
import envFile from "./env.json"

type Config = {
  apiBaseUrl: string
  apiVersion: string
  amplitudeKey: string
  googleRecaptchaId: string
}

type EnvConfig = Record<string, Config>

const envConfig: EnvConfig = envFile as EnvConfig
const availableEnvs = Object.keys(envConfig)
const env = process.env.ENV as string
const projectId = "f127ced7-fe25-4067-97d3-b3daf7545c34"

if (!env || !availableEnvs.includes(env)) {
  console.error(`⛔️ You must provide a valid environment.`)
  process.exit(1)
}

const { apiBaseUrl, apiVersion, amplitudeKey, googleRecaptchaId } = envConfig[env]

const config: ExpoConfig = {
  name: "xxx",
  owner: "xxx",
  description: "xxx",
  slug: "xxx",
  privacy: "hidden",
  userInterfaceStyle: "automatic",
  backgroundColor: "#006fcf",
  primaryColor: "#006fcf",
  extra: {
    apiBaseUrl: process.env.API_BASE_URL ?? apiBaseUrl,
    apiVersion: process.env.API_VERSION ?? apiVersion,
    amplitudeKey,
    googleRecaptchaId,
    eas: {
      projectId,
    },
  },
  splash: {
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  version,
  runtimeVersion: {
    policy: "sdkVersion",
  },
  orientation: "portrait",
  assetBundlePatterns: ["**/*"],
  ios: {
    usesIcloudStorage: true,
    supportsTablet: false,
    bundleIdentifier: "xxx",
    buildNumber: "1",
    infoPlist: {
      NSFaceIDUsageDescription: "This app uses Face ID for automatic login.",
      NSCameraUsageDescription: "This app uses the camera to scan user receipts in paper format.",
    },
  },
  android: {
    package: "xxx",
    versionCode: 1,
  },
  packagerOpts: {
    config: "metro.config.js",
    sourceExts: ["expo.ts", "expo.tsx", "expo.js", "expo.jsx", "ts", "tsx", "js", "jsx", "json", "wasm", "svg"],
  },
  updates: {
    enabled: true,
    url: `https://u.expo.dev/${projectId}`,
    fallbackToCacheTimeout: 15000,
  },
}

export default config
