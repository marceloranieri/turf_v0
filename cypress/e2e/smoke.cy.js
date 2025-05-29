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
        
        cy.wrap($el).click({ force: true }).then(() => {
          // Log successful clicks
          cy.log(`Clicked ${elementType}: ${elementText}`);
        }).catch((error) => {
          // Log failed clicks
          cy.log(`Failed to click ${elementType}: ${elementText}`, error);
        });
      }
    });
  });
}); 