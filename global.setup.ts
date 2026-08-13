import { type FullConfig, chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

async function globalSetup (config: FullConfig) {
  console.log('***** Signing in user *****');

  const project = config.projects[0];
  if (!project) throw new Error('No Playwright project configured');
  const { baseURL, storageState } = project.use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the login page and check if it's loaded correctly
  await page.goto(`${baseURL}/login`);

  const form = page.getByTestId('login-form');
  const loginInput = form.locator('[data-testid="login-email"] >> input');
  const passwordInput = form.locator('[data-testid="login-password"] >> input');
  const submitButton = form.getByTestId('login-submit');
  await loginInput.fill(process.env.NUXT_PLAYWRIGHT_USERNAME as string);
  await passwordInput.fill(process.env.NUXT_PLAYWRIGHT_PASSWORD as string);
  await submitButton.click();

  // Check the URL and content of the page after clicking the 'Sign In' button
  await page.waitForURL(`${baseURL as string}/`);
  await page.context()
    .storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;