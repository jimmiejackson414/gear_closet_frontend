import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { type FullConfig, chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

async function globalTeardown (config: FullConfig) {
  console.log('***** Signing out user *****');

  const project = config.projects[0];
  if (!project) throw new Error('No Playwright project configured');
  const { baseURL } = project.use;
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Read the state.json file content
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const stateJsonPath = path.join(dirname, 'tests', 'state.json');
  const stateJson = fs.readFileSync(stateJsonPath, 'utf-8');

  // Parse the state.json file content and restore the storage state
  const storageState = JSON.parse(stateJson);
  await context.addCookies(storageState.cookies);
  await context.addInitScript((storage) => {
    for (const key in storage.localStorage) {
      localStorage.setItem(key, storage.localStorage[key]);
    }
  }, storageState);

  await page.goto(baseURL!);

  // Wait for the page to fully load
  await page.waitForLoadState('load');

  // Wait for the logout button to be visible and click it
  const logoutButton = await page.waitForSelector('[data-testid="logout"]');
  await logoutButton.click();

  // Reset the storage state
  await context.clearCookies();
  await context.clearPermissions();

  // Clear the cookies and origins arrays in the state.json file
  storageState.cookies = [];
  storageState.origins = [];
  fs.writeFileSync(stateJsonPath, JSON.stringify(storageState, null, 2));

  await browser.close();
}

export default globalTeardown;