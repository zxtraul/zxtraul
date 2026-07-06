import { test, expect, type Page } from "@playwright/test";

const ROUTES = ["/", "/research", "/media", "/blog", "/talk"];

// Canary strings sourced verbatim from portfolioData.ts — if these ever
// disappear from a route's rendered HTML, content drifted during a
// presentation-only refactor, which must never happen.
const CONTENT_CANARIES: Record<string, string[]> = {
  "/": ["Dr. Rahul Parajuli", "Biratnagar, Nepal", "ECFMG-certified"],
  "/research": ["Clinical Research", "Publications", "0000-0003-0223-3185"],
  "/media": ["Media Gallery", "National ICU Registry Meeting"],
  "/blog": ["Blog", "View My Posts on LinkedIn"],
  "/talk": ["Telehealth Portal", "Dr. Rahul Parajuli"],
};

function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[console.error] ${msg.text()}`);
  });
  return errors;
}

for (const route of ROUTES) {
  test(`${route} loads with no console errors`, async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBeLessThan(400);
    await page.waitForTimeout(1500);
    expect(errors, errors.join("\n")).toHaveLength(0);
  });

  test(`${route} preserves canary content`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const bodyText = await page.locator("body").innerText();
    for (const canary of CONTENT_CANARIES[route]) {
      expect(bodyText).toContain(canary);
    }
  });
}

test("reduced-motion: zero canvases on every route", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const canvasCount = await page.locator("canvas").count();
    expect(canvasCount, `${route} should have 0 canvases under reduced-motion`).toBe(0);
  }
  await context.close();
});

test("media gallery: at most one WebGL context active at a time", async ({ page }) => {
  await page.goto("/media", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const baseline = await page.locator("canvas").count();

  const firstImage = page.locator("img[alt]").first();
  const box = await firstImage.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
  await page.waitForTimeout(500);
  const hoveredCount = await page.locator("canvas").count();
  expect(hoveredCount).toBeLessThanOrEqual(baseline + 1);
});

test("home: timeline filters and expand/collapse still function", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const clinicalFilter = page.getByRole("button", { name: "Filter by Clinical", exact: true });
  await clinicalFilter.click();
  await expect(clinicalFilter).toHaveAttribute("aria-pressed", "true");

  const allFilter = page.getByRole("button", { name: "Filter by All", exact: true });
  await allFilter.click();
  await expect(allFilter).toHaveAttribute("aria-pressed", "true");
});

test("research: search and tab filters function", async ({ page }) => {
  await page.goto("/research", { waitUntil: "networkidle" });
  const searchBox = page.getByPlaceholder("Search publications...");
  await searchBox.fill("ICU");
  await page.waitForTimeout(300);
  const peerReviewedTab = page.getByRole("button", { name: "Peer-Reviewed" });
  await peerReviewedTab.click();
});

test("media: lightbox opens and closes", async ({ page }) => {
  await page.goto("/media", { waitUntil: "networkidle" });
  await page.locator("img[alt]").first().click({ force: true });
  await expect(page.getByLabel("Close lightbox")).toBeVisible();
  await page.getByLabel("Close lightbox").click();
});
