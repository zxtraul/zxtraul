import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        launchOptions: {
        executablePath: "/opt/pw-browsers/chromium",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
      },
    },
    {
      name: "desktop-reduced-motion",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        reducedMotion: "reduce",
        launchOptions: {
        executablePath: "/opt/pw-browsers/chromium",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
        launchOptions: {
        executablePath: "/opt/pw-browsers/chromium",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
      },
    },
  ],
});
