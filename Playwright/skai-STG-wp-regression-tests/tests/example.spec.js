const { test, expect } = require('@playwright/test');
const pages = require('./pages');

function normalizeName(url) {
  return url
    .replace('https://skaistaging.wpengine.com/', '')
    .replace(/\//g, '-')
    .replace(/^-|-$/g, '') || 'home';
}

async function preparePageForScreenshot(page) {
  // Disable CSS animations and transitions
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition: none !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
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

  // Stop all JS-driven animations, videos, and carousels
  await page.evaluate(() => {
    // Pause GSAP global timeline (very common on WordPress marketing sites)
    if (window.gsap) {
      try { window.gsap.globalTimeline.pause(); } catch (e) {}
      try { window.gsap.ticker.sleep(); } catch (e) {}
    }

    // Stop Swiper autoplay on all instances
    document.querySelectorAll('.swiper, [class*="swiper"]').forEach(el => {
      if (el.swiper) {
        try { el.swiper.autoplay.stop(); } catch (e) {}
        try { el.swiper.destroy(false, false); } catch (e) {}
      }
    });

    // Pause and hide all video elements
    document.querySelectorAll('video').forEach(v => {
      v.pause();
      v.currentTime = 0;
      v.style.visibility = 'hidden';
    });
    document.querySelectorAll('audio').forEach(a => a.pause());

    // Finish all Web Animations API animations
    if (document.getAnimations) {
      document.getAnimations().forEach(a => { try { a.finish(); } catch (e) {} });
    }

    // Freeze requestAnimationFrame to stop any remaining JS-driven animations
    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = () => 0;
    window.cancelAnimationFrame = () => {};

    // Stop any setInterval-driven animations
    const highId = setInterval(() => {}, 99999);
    for (let i = 0; i < highId; i++) clearInterval(i);
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

test.describe('skaistaging.wpengine.com — visual regression (stable pages)', () => {
  for (const url of pages) {
    const name = normalizeName(url);

    test(name, async ({ page }) => {
      await page.goto(url, { waitUntil: 'load', timeout: 120000 });

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
