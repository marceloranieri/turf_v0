// Import commands.js using ES2015 syntax:
import './commands'

// Take a screenshot on test failure
Cypress.on('test:after:run', (attributes) => {
  if (attributes.state === 'failed') {
    const screenshotFileName = `${attributes.title} -- ${attributes.name} (failed).png`
    cy.screenshot(screenshotFileName)
  }
}) 