const { test, expect } = require('@playwright/test');
const pages = require('./pages');

function normalizeName(url) {
  return url
    .replace('https://skaidev.wpengine.com/', '')
    .replace(/\//g, '-')
    .replace(/^-|-$/g, '') || 'home';
}

async function preparePageForScreenshot(page) {
  // Disable animations
  await page.addStyleTag({
    content: `
      * {
        animation: none !important;
        transition: none !important;
      }
    `
  });

  // Scroll page to trigger lazy loading and intersection observers
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 200);
    });
  });

  // Extra wait for images and fonts to settle
  await page.waitForTimeout(1500);

  // Add ignore zone at bottom 20px to hide random white stripe
  await page.addStyleTag({
    content: `
      body::after {
        content: "";
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 20px;
        background: #fff;
        z-index: 999999;
        pointer-events: none;
      }
    `
  });
}

test.describe('skaidev.wpengine.com — visual regression (stable pages)', () => {
  for (const url of pages) {
    const name = normalizeName(url);

    test(name, async ({ page }) => {
      await page.goto(url, { waitUntil: 'networkidle' });

      // Accept cookies (if any)
      try {
        const accept = page.locator(
          'button:has-text("Accept"), button:has-text("Accept all"), button:has-text("Allow all")'
        );
        if (await accept.first().isVisible({ timeout: 3000 })) {
          await accept.first().click();
          await page.waitForTimeout(1000);
        }
      } catch {}

      await preparePageForScreenshot(page);

      await expect(page).toHaveScreenshot(`skai-${name}.png`, {
        fullPage: true,

        // Small tolerance for unavoidable pixel noise
        maxDiffPixelRatio: 0.002
      });
    });
  }
});