import { test, expect } from '@playwright/test';

test('home renders', async ({ page }) => {
  await page.goto('/');

  // First-run Datenschutz gate
  const accept = page.getByRole('button', { name: /Verstanden\s*&\s*weiter/i });
  if (await accept.count()) {
    await accept.first().click();
  }

  await expect(page.getByRole('button', { name: 'Tukas Mathe-Welt' })).toBeVisible();
});
