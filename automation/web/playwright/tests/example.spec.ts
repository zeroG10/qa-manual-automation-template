import { test, expect } from '@playwright/test';

test('Check that the Example page title is displayed', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Example/);
});