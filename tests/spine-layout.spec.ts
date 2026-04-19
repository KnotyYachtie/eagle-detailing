import { expect, test } from '@playwright/test';

/**
 * Spine uses CSS grid `column-gap` around a 1px `.domains-spine__bar` slot (label | bar | node).
 * Distance from last glyph box to node box must match across Marine / Aviation / Automotive.
 */
test('domains spine: label-to-node edge gap is equal (desktop)', async ({ page }) => {
  await page.goto('/');

  const deltas = await page.evaluate(() => {
    /** Flex `gap` = node margin-left minus label margin-right (same for every spine row). */
    function boxGap(spine: string): number | null {
      const root = document.querySelector(`a.domains-spine__link[data-spine="${spine}"]`);
      const label = root?.querySelector('.domains-spine__label');
      const node = root?.querySelector('.domains-spine__node');
      if (!label || !node) return null;
      const lr = label.getBoundingClientRect();
      const nr = node.getBoundingClientRect();
      return nr.left - lr.right;
    }
    return {
      marine: boxGap('marine'),
      aviation: boxGap('aviation'),
      automotive: boxGap('automotive'),
    };
  });

  expect(deltas.marine, 'marine spine').not.toBeNull();
  expect(deltas.aviation, 'aviation spine').not.toBeNull();
  expect(deltas.automotive, 'automotive spine').not.toBeNull();

  const values = [deltas.marine!, deltas.aviation!, deltas.automotive!];
  const max = Math.max(...values);
  const min = Math.min(...values);
  expect(max - min, `label↔node px: m=${deltas.marine} a=${deltas.aviation} o=${deltas.automotive}`).toBeLessThanOrEqual(
    0.15
  );
});
