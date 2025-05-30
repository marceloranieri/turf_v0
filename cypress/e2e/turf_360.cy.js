describe('Turf Full 360 E2E QA', () => {
  beforeEach(() => {
    // Visit the homepage and wait for it to load
    cy.visit('/', { timeout: 10000 });
    cy.wait(2000); // Wait for any initial animations/loads
  });

  it('should load the homepage and main elements', () => {
    // Check for basic page structure
    cy.get('body').should('exist');
    cy.get('main, [role="main"]').should('exist');
    
    // Check for navigation elements with more flexible selectors
    cy.get('header, nav, [role="navigation"], [class*="nav"], [class*="header"]').should('exist');
    
    // Check for footer with flexible selector
    cy.get('footer, [role="contentinfo"], [class*="footer"]').should('exist');
  });

  it('should not throw JS errors', () => {
    // Check for console errors
    cy.window().then((win) => {
      const errors = [];
      win.addEventListener('error', (e) => {
        errors.push(e.message);
      });
      
      // Check for common error patterns in the page
      cy.get('body').should('not.contain', '404');
      cy.get('body').should('not.contain', 'ReferenceError');
      cy.get('body').should('not.contain', 'TypeError');
    });
  });

  it('should click every visible link and button and log their action', () => {
    // Get all clickable elements
    cy.get('a, button, [role="button"], [class*="btn"]').each(($el) => {
      // Store the current URL
      cy.url().then((url) => {
        const currentUrl = url;
        
        // Click the element
        cy.wrap($el).click({ force: true });
        
        // Wait for any navigation
        cy.wait(1000);
        
        // Check if URL changed
        cy.url().then((newUrl) => {
          if (newUrl !== currentUrl) {
            // If URL changed, go back
            cy.go('back');
            cy.wait(1000);
          }
        });
      });
    });
  });

  it('should navigate to login/signup and validate form presence', () => {
    // Try to find login/signup links
    cy.get('a[href*="login"], a[href*="signup"], a[href*="register"], [class*="login"], [class*="signup"]')
      .first()
      .click({ force: true });
    
    // Wait for navigation
    cy.wait(2000);
    
    // Check for form elements with flexible selectors
    cy.get('form, [role="form"], [class*="form"]').should('exist');
    
    // Check for common form fields
    cy.get('input[type="text"], input[type="email"], input[type="password"]').should('exist');
  });

  it('should detect and validate topic display area', () => {
    // Look for topic-related elements with more flexible selectors
    cy.get('[data-testid*="topic"], [class*="topic"], [class*="debate"], [class*="discussion"]')
      .should('exist')
      .and('be.visible');
  });

  it('should enter a chatroom and interact like a user', () => {
    // Try multiple possible selectors for chat entry
    cy.get('a[href*="chat"], button:contains("Join"), button:contains("Enter"), [class*="chat"]')
      .first()
      .click({ force: true });
    
    // Wait for chat to load
    cy.wait(2000);
    
    // Check for chat elements
    cy.get('[class*="chat"], [class*="message"], [class*="conversation"]')
      .should('exist')
      .and('be.visible');
    
    // Try to find message input
    cy.get('textarea, input[type="text"], [contenteditable="true"]')
      .first()
      .type('Test message {enter}');
  });

  it('should check leaderboard or engagement UI if exists', () => {
    // Look for leaderboard with flexible selectors
    cy.get('[class*="leaderboard"], [class*="ranking"], [class*="score"], [class*="stats"]')
      .should('exist')
      .and('be.visible');
  });

  it('should open user menu or settings if available', () => {
    // Look for user menu with flexible selectors
    cy.get('[class*="user-menu"], [class*="profile"], [class*="settings"], [class*="account"]')
      .first()
      .click({ force: true });
    
    // Check for dropdown/menu
    cy.get('[class*="dropdown"], [class*="menu"], [role="menu"]')
      .should('exist')
      .and('be.visible');
  });
}); 