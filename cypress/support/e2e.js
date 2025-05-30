// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top;
if (app) {
  app.document.addEventListener('DOMContentLoaded', () => {
    const style = app.document.createElement('style');
    style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
    app.document.head.appendChild(style);
  });
}

// Add custom commands for common operations
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('logout', () => {
  cy.get('[class*="user-menu"], [class*="profile"]').click();
  cy.contains('Logout').click();
});

Cypress.Commands.add('enterChatroom', () => {
  cy.get('a[href*="chat"], button:contains("Join"), button:contains("Enter"), [class*="chat"]')
    .first()
    .click({ force: true });
  cy.wait(2000); // Wait for chat to load
});

Cypress.Commands.add('postMessage', (message) => {
  cy.get('textarea, input[type="text"], [contenteditable="true"]')
    .first()
    .type(message + '{enter}');
});

// Add custom assertions
chai.Assertion.addMethod('containText', function(text) {
  const obj = this._obj;
  const contains = obj.text().includes(text);
  this.assert(
    contains,
    `expected #{this} to contain text "${text}"`,
    `expected #{this} not to contain text "${text}"`,
    text,
    obj.text()
  );
});

// Take a screenshot on test failure
Cypress.on('test:after:run', (attributes) => {
  if (attributes.state === 'failed') {
    const screenshotFileName = `${attributes.title} -- ${attributes.name} (failed).png`
    cy.screenshot(screenshotFileName)
  }
})
