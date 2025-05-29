describe('Authenticated Routes', () => {
  beforeEach(() => {
    cy.loginBySupabase();
  });

  it('Visits the chat page', () => {
    cy.visit('/chat');
    cy.contains('Turf').should('exist');
  });

  it('Tests authenticated navigation', () => {
    cy.visit('/');
    cy.get('a[href*="/chat"]').click();
    cy.url().should('include', '/chat');
    cy.contains('Turf').should('exist');
  });
}); 