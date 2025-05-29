const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'x5ugjf', // Your Cypress Cloud project ID
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // Add plugins or setup events here
    },
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
  },
}) 