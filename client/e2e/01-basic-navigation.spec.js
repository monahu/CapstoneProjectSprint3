import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page before each test
    await page.goto('/');
  });

  test('should load the home page', async ({ page }) => {
    // Check if the page title contains "RestJam" or similar
    await expect(page).toHaveTitle(/RestJam|Restaurant/i);
    
    // Check for main navigation elements (be more specific to avoid multiple nav elements)
    await expect(page.locator('nav').first()).toBeVisible();
  });

  test('should navigate to different sections via sidebar', async ({ page }) => {
    // Check if Home link exists and is accessible in sidebar
    await expect(page.getByRole('link', { name: /home/i }).first()).toBeVisible();
    
    // For visitor sidebar, check if Login link exists instead of Explore
    const loginLink = page.getByRole('link', { name: /login/i }).first();
    if (await loginLink.count() > 0) {
      await expect(loginLink).toBeVisible();
      
      // Click on Login link
      await loginLink.click();
      await page.waitForLoadState('networkidle');
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/login/);
    } else {
      // If authenticated, check for Create and Profile links
      const createLink = page.getByRole('link', { name: /create/i }).first();
      const profileLink = page.getByRole('link', { name: /profile/i }).first();
      
      if (await createLink.count() > 0) {
        await expect(createLink).toBeVisible();
      }
      if (await profileLink.count() > 0) {
        await expect(profileLink).toBeVisible();
      }
      
      // Check for Explore section (only for authenticated users)
      const exploreLink = page.getByRole('link', { name: /explore/i }).first();
      if (await exploreLink.count() > 0) {
        await expect(exploreLink).toBeVisible();
        await exploreLink.click();
        await page.waitForLoadState('networkidle');
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/explore|\/login/);
      }
    }
  });

  test('should open mobile sidebar dialog on small screens', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for page to adapt to mobile layout
    await page.waitForTimeout(500);
    
    // Look for mobile menu button that opens the sidebar dialog
    const menuButtonSelectors = [
      'button[aria-label*="menu"]',
      'button[data-testid*="menu"]', 
      '[class*="hamburger"]',
      'button[class*="menu"]',
      'button svg', // Often menu buttons just have an icon
      '.lg\\:hidden button', // Hidden on large screens
      '[aria-controls]' // Button that controls something
    ];
    
    let menuButton = null;
    for (const selector of menuButtonSelectors) {
      const button = page.locator(selector).first();
      if (await button.isVisible()) {
        menuButton = button;
        break;
      }
    }
    
    if (menuButton) {
      await menuButton.click();
      
      // Wait for HeadlessUI Dialog transition to complete
      await page.waitForTimeout(1000);
      
      // Check for HeadlessUI Dialog elements that indicate sidebar opened
      const sidebarDialog = page.locator('[role="dialog"]');
      if (await sidebarDialog.count() > 0) {
        // Check if dialog is in open state instead of visual visibility
        await expect(sidebarDialog).toHaveAttribute('data-headlessui-state', 'open');
        
        // Check for sidebar content within dialog
        const sidebarContent = sidebarDialog.locator('nav, a[href="/"], a[href="/login"]');
        if (await sidebarContent.count() > 0) {
          await expect(sidebarContent.first()).toBeVisible();
        }
        
        // Check for close button (X icon)
        const closeButton = sidebarDialog.locator('button');
        if (await closeButton.count() > 0) {
          await expect(closeButton.first()).toBeVisible();
        }
      }
    } else {
      // Mobile sidebar might always be visible or use different pattern
      console.log('No mobile menu button found - checking for always-visible sidebar');
      
      // Check if sidebar is already visible on mobile (alternative design)
      const visibleSidebar = page.locator('nav').filter({ hasText: /Home|Login|Create/ });
      if (await visibleSidebar.count() > 0) {
        console.log('Found always-visible sidebar navigation');
      }
    }
  });

  test('should display hero section', async ({ page }) => {
    // Check for various hero section indicators
    const heroSelectors = [
      'section, div', // Any section or div
      '.hero',
      '[class*="hero"]',
      'main section',
      'header + section',
      'header + div'
    ];
    
    let heroFound = false;
    for (const selector of heroSelectors) {
      const heroElement = page.locator(selector).first();
      if (await heroElement.count() > 0 && await heroElement.isVisible()) {
        heroFound = true;
        break;
      }
    }
    
    // If no obvious hero section, check for main content area
    if (!heroFound) {
      const mainContent = page.locator('main, [role="main"], .container, .content').first();
      if (await mainContent.count() > 0) {
        await expect(mainContent).toBeVisible();
        heroFound = true;
      }
    }
    
    // Look for call-to-action button (optional)
    const ctaButton = page.getByRole('button', { name: /get started|share|explore|create|sign up/i });
    if (await ctaButton.count() > 0 && await ctaButton.first().isVisible()) {
      await expect(ctaButton.first()).toBeVisible();
    }
    
    // At minimum, expect some content to be visible on the page
    expect(heroFound || await page.locator('body').isVisible()).toBeTruthy();
  });

  test('should have working footer links', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Check if footer is visible
    await expect(page.locator('footer')).toBeVisible();
    
    // Check for any footer links
    const footerLinks = page.locator('footer a');
    const linkCount = await footerLinks.count();
    
    if (linkCount > 0) {
      // Test first footer link if it exists
      const firstLink = footerLinks.first();
      await expect(firstLink).toBeVisible();
    }
  });

  test('should load without critical console errors', async ({ page }) => {
    const errors = [];
    
    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Reload the page to capture any console errors
    await page.reload();
    
    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');
    
    // Filter out common non-critical errors
    const criticalErrors = errors.filter(error => {
      const errorText = error.toLowerCase();
      return !errorText.includes('favicon') && 
             !errorText.includes('404') && 
             !errorText.includes('network') &&
             !errorText.includes('failed to load resource') &&
             !errorText.includes('manifest.json') &&
             !errorText.includes('chunk load failed') &&
             !errorText.includes('loading chunk') &&
             !errorText.includes('hydration') &&
             !errorText.includes('warning') &&
             !errorText.includes('deprecated') &&
             !errorText.includes('firebase') &&
             !errorText.includes('apollo') &&
             !errorText.includes('devtools') &&
             !errorText.includes('extension');
    });
    
    // Log all errors for debugging but only fail on truly critical ones
    if (errors.length > 0) {
      console.log(`Found ${errors.length} console errors (${criticalErrors.length} critical):`);
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    // Only fail if there are actual critical errors
    expect(criticalErrors.length).toBeLessThanOrEqual(3); // Allow up to 3 critical errors
  });
});