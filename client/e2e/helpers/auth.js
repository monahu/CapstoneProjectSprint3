/**
 * Authentication helpers for Playwright tests
 */

export const TEST_USER = {
  email: 'feak1@test.com',
  password: '111111'
};

/**
 * Login with test account
 * @param {import('@playwright/test').Page} page 
 */
export async function loginWithTestAccount(page) {
  // Go to login page
  await page.goto('/login');
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  
  // Wait for login form to be visible
  await page.waitForSelector('input[type="email"], input[name="email"], input[placeholder*="email"]', { timeout: 5000 });
  
  // Fill in credentials
  const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
  const passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password"]').first();
  
  await emailInput.fill(TEST_USER.email);
  await passwordInput.fill(TEST_USER.password);
  
  // Submit the form
  const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /sign in|login|submit/i }).first();
  await submitButton.click();
  
  // Wait for redirect after successful login
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  
  // Verify we're logged in by checking for authenticated navigation or redirect to home
  await page.waitForTimeout(2000);
  
  // Check if we're on home page or if we see authenticated elements
  const currentUrl = page.url();
  const isOnHome = currentUrl.includes('/') && !currentUrl.includes('/login');
  
  if (isOnHome) {
    // Look for authenticated navigation elements
    const createLink = page.getByRole('link', { name: /create/i });
    const profileLink = page.getByRole('link', { name: /profile/i });
    
    // Wait a bit for the page to update with auth state
    await page.waitForTimeout(1000);
    
    return {
      success: true,
      hasCreateLink: await createLink.count() > 0,
      hasProfileLink: await profileLink.count() > 0
    };
  }
  
  return { success: false };
}

/**
 * Check if user is currently logged in
 * @param {import('@playwright/test').Page} page 
 */
export async function isLoggedIn(page) {
  // Check for authenticated navigation elements
  const createLink = page.getByRole('link', { name: /create/i });
  const profileLink = page.getByRole('link', { name: /profile/i });
  const loginLink = page.getByRole('link', { name: /login/i });
  
  const hasAuthElements = await createLink.count() > 0 || await profileLink.count() > 0;
  const hasLoginLink = await loginLink.count() > 0;
  
  // If we have auth elements and no login link, user is logged in
  return hasAuthElements && !hasLoginLink;
}

/**
 * Logout if currently logged in
 * @param {import('@playwright/test').Page} page 
 */
export async function logout(page) {
  // Look for logout button/link
  const logoutSelectors = [
    'button, a', // Generic button or link
    '[data-testid*="logout"]',
    '[aria-label*="logout"]'
  ];
  
  for (const selector of logoutSelectors) {
    const logoutElement = page.locator(selector).filter({ hasText: /logout|sign out/i });
    if (await logoutElement.count() > 0) {
      await logoutElement.first().click();
      await page.waitForLoadState('networkidle');
      break;
    }
  }
  
  // Also try looking in profile dropdown or menu
  const profileButton = page.locator('button, a').filter({ hasText: /profile|account|user/i });
  if (await profileButton.count() > 0) {
    await profileButton.first().click();
    await page.waitForTimeout(500);
    
    const logoutInDropdown = page.locator('button, a').filter({ hasText: /logout|sign out/i });
    if (await logoutInDropdown.count() > 0) {
      await logoutInDropdown.first().click();
      await page.waitForLoadState('networkidle');
    }
  }
}

/**
 * Setup authenticated state before test
 * @param {import('@playwright/test').Page} page 
 */
export async function setupAuthenticatedState(page) {
  const loginResult = await loginWithTestAccount(page);
  if (!loginResult.success) {
    throw new Error('Failed to login with test account');
  }
  return loginResult;
}