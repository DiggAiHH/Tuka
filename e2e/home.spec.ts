import { test, expect } from '@playwright/test';

test('home renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Tukas Mathe-Welt' })).toBeVisible();
});
