import { expect, test } from '@playwright/test';

const CASES = [
  {
    name: 'iphone-13-portrait',
    viewport: { width: 390, height: 844 },
    expectGridColumns: 1,
    expectVisualVisible: false,
  },
  {
    name: 'iphone-13-landscape',
    viewport: { width: 844, height: 390 },
    expectGridColumns: 1,
    expectVisualVisible: false,
  },
  {
    name: 'ipad-mini-portrait',
    viewport: { width: 768, height: 1024 },
    expectGridColumns: 1,
    expectVisualVisible: false,
  },
  {
    name: 'ipad-mini-landscape',
    viewport: { width: 1024, height: 768 },
    expectGridColumns: 1,
    expectVisualVisible: false,
  },
  {
    name: 'ipad-pro-11-landscape',
    viewport: { width: 1194, height: 834 },
    expectGridColumns: 1,
    expectVisualVisible: false,
  },
  {
    name: 'desktop-1440',
    viewport: { width: 1440, height: 900 },
    expectGridColumns: 2,
    expectVisualVisible: true,
  },
] as const;

test.describe('marine services responsive coverage', () => {
  for (const entry of CASES) {
    test(entry.name, async ({ page }) => {
      await page.setViewportSize(entry.viewport);
      await page.goto('/marine');
      await page.locator('.marine-services').scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);

      const services = page.locator('.marine-services');
      await expect(services).toBeVisible();

      const layout = await page.evaluate(() => {
        const grid = document.querySelector('.marine-services__grid');
        const visual = document.querySelector('.marine-services__visual');
        if (!grid || !visual) {
          return { gridColumns: 0, visualVisible: false, horizontalOverflow: true };
        }
        const styles = getComputedStyle(grid);
        const visualStyles = getComputedStyle(visual);
        const gridColumns = styles.gridTemplateColumns
          .split(' ')
          .map((part) => part.trim())
          .filter(Boolean).length;
        const visualVisible = visualStyles.display !== 'none' && visualStyles.visibility !== 'hidden';
        const horizontalOverflow =
          document.documentElement.scrollWidth > document.documentElement.clientWidth ||
          document.body.scrollWidth > document.body.clientWidth;
        return { gridColumns, visualVisible, horizontalOverflow };
      });

      expect(layout.gridColumns).toBe(entry.expectGridColumns);
      expect(layout.visualVisible).toBe(entry.expectVisualVisible);
      expect(layout.horizontalOverflow).toBeFalsy();

      await expect(page).toHaveScreenshot(`marine-services-${entry.name}.png`, {
        fullPage: false,
        animations: 'disabled',
        caret: 'hide',
        mask: [page.locator('.marine-page__parallax-img')],
      });
    });
  }
});
