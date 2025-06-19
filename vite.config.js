import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "/favicon/favicon-light.ico",
        "/favicon/favicon-dark.ico",
        "/icons/dootzy-192.png",
        "/icons/dootzy-512.png",
        "/seo/og.png",
        "/seo/tw.png"
      ],
      manifest: {
        name: "Dootzy",
        short_name: "Dootzy",
        start_url: ".",
        display: "standalone",
        background_color: "#242424",
        theme_color: "#67c6bb",
        icons: [
          {
            src: "/icons/dootzy-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/dootzy-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      }
    })
  ]
});