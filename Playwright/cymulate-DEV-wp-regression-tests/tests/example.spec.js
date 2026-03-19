const { test, expect } = require('@playwright/test');
const pages = require('./pages');

function normalizeName(url) {
  return url
    .replace('https://marketingblogs.wpenginepowered.com/', '')
    .replace(/\//g, '-')
    .replace(/^-|-$/g, '') || 'home';
}

// Selectors for elements that change on every render (masked in screenshots)
const DYNAMIC_SELECTORS = [
  // Cookie / consent banners
  '#onetrust-banner-sdk',
  '#onetrust-consent-sdk',
  '[id*="cookie-banner"]',
  '[class*="cookie-banner"]',
  // Accessibility widgets (accessiBe, UserWay, EqualWeb …)
  '#INDmenu-btn',
  '#accessibilityWidget',
  '.ada-chat-button',
  '[id^="userway"]',
  '[class*="accessibe"]',
  // Live-chat / chatbot launchers
  '#hubspot-messages-iframe-container',
  '.intercom-app',
  '[id*="drift-widget"]',
  // Hero sliders / carousels (active slide index changes between runs)
  '.swiper',
  '.slick-slider',
  '[class*="hero-slider"]',
  '[class*="carousel"]',
];

async function preparePageForScreenshot(page) {
  // Disable CSS animations and transitions (including pseudo-elements)
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

      .cy-sticky-post {
        display: none !important;
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

test.describe('https://marketingblogs.wpenginepowered.com/ — visual regression (stable pages)', () => {
  for (const url of pages) {
    const name = normalizeName(url);

    test(name, async ({ page }) => {
      await page.goto(url, { waitUntil: 'networkidle' });

      // Accept cookies (if any)
      try {
        const accept = page.locator('#onetrust-accept-btn-handler');
        if (await accept.isVisible({ timeout: 3000 })) {
          await accept.click();
          await page.waitForTimeout(1000);
        }
      } catch {}

      await preparePageForScreenshot(page);

      // Build mask list from selectors that are present on this page
      const mask = DYNAMIC_SELECTORS.map(sel => page.locator(sel));

      await expect(page).toHaveScreenshot(`cymulate-DEV-${name}.png`, {
        fullPage: true,

        // Let Playwright stop remaining CSS animations before capture
        animations: 'disabled',

        // Tolerance: whichever limit is hit first wins.
        maxDiffPixelRatio: 0.002,
        maxDiffPixels: 200,

        // Overlay dynamic widgets so they never cause false failures
        mask,
      });
    });
  }
});
