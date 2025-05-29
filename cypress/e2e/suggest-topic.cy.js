describe('Topic Suggestion Flow', () => {
  beforeEach(() => {
    cy.visit('/dashboard')
    cy.login() // Assuming you have a custom command for login
  })

  it('should allow users to suggest a new topic', () => {
    // Click the suggest topic button
    cy.get('[data-testid="suggest-topic-button"]').click()

    // Verify modal is open
    cy.get('[data-testid="suggest-topic-modal"]').should('exist')

    // Type a topic suggestion
    cy.get('textarea').type('Let\'s debate: Is AI killing creativity?')

    // Select a category
    cy.get('select').select('technology')

    // Submit the suggestion
    cy.get('[data-testid="submit-topic-suggestion"]').click()

    // Verify modal closes after submission
    cy.get('[data-testid="suggest-topic-modal"]').should('not.exist')
  })

  it('should validate required fields', () => {
    // Click the suggest topic button
    cy.get('[data-testid="suggest-topic-button"]').click()

    // Try to submit without entering a topic
    cy.get('[data-testid="submit-topic-suggestion"]').should('be.disabled')

    // Enter a topic
    cy.get('textarea').type('Test topic')

    // Verify submit button is now enabled
    cy.get('[data-testid="submit-topic-suggestion"]').should('not.be.disabled')
  })
}) 