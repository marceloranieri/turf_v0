const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // Your Cypress Cloud project ID
  projectId: "x5ugjf",

  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // Add plugins or setup events here
    },
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
