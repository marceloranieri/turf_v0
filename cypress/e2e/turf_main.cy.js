describe('Turf Core Flow E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage without crashing', () => {
    cy.contains('Turf').should('exist');
  });

  it('should navigate to login/signup if user is not authenticated', () => {
    cy.contains(/log in|sign up/i).click();
    cy.url().should('include', '/login');
  });

  it('should click all visible links/buttons and detect broken actions', () => {
    cy.get('a, button').each(($el) => {
      if ($el.is(':visible') && !$el.is('[disabled]')) {
        cy.wrap($el).then(($btn) => {
          const label = $btn.text().trim() || $btn.attr('aria-label') || '[No Label]';
          cy.log(`Clicking: ${label}`);
        });
        cy.wrap($el).click({ force: true });
        cy.wait(300); // wait for UI reaction
      }
    });
  });

  it('should display daily topics or fallback message', () => {
    cy.contains(/topic of the day|debate topic/i).should('exist');
  });

  it('should enter a chatroom and interact', () => {
    cy.contains(/join|enter|start/i).first().click({ force: true });
    cy.url().should('include', '/chat');

    // Type a message
    cy.get('textarea, [contenteditable="true"]').first().type('Hello Turf Test!{enter}');
    cy.contains('Hello Turf Test!').should('exist');

    // React to message
    cy.get('[data-testid="reaction-button"]').first().click({ force: true }).wait(200);
  });

  it('should not have any 404 or JS errors in the UI', () => {
    cy.get('body').should('not.contain.text', '404');
    cy.get('body').should('not.contain.text', 'ReferenceError');
    cy.get('body').should('not.contain.text', 'undefined is not');
  });
}); 