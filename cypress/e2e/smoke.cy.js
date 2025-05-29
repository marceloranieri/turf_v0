describe('Turf homepage', () => {
  it('loads the homepage', () => {
    cy.visit('/');
    cy.contains('Turf').should('exist');
  });

  it('tests all clickable elements', () => {
    cy.visit('/');
    
    // Get all clickable elements
    cy.get('a, button, [role="button"], [type="submit"]').each(($el) => {
      // Skip hidden elements
      if ($el.is(':visible')) {
        const elementType = $el.prop('tagName').toLowerCase();
        const elementText = $el.text().trim() || $el.attr('aria-label') || 'unnamed element';
        
        // Use Cypress commands properly without try/catch
        cy.wrap($el)
          .click({ force: true })
          .then(() => {
            cy.log(`Clicked ${elementType}: ${elementText}`);
          });
      }
    });
  });
});
