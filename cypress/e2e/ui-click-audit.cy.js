describe('QA: Scan all clickable elements', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Finds and attempts to click all buttons and links', () => {
    cy.get('a, button, [role="button"], [onclick], [tabindex="0"]')
      .each(($el, index) => {
        const elText = $el.text() || $el.attr('aria-label') || `#${index}`;
        
        // Use Cypress commands properly without try/catch
        cy.wrap($el)
          .scrollIntoView()
          .click({ force: true })
          .then(() => {
            cy.log(`✅ Clicked: ${elText}`);
          });
      });
  });
});
