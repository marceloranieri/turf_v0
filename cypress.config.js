const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // Your Cypress Cloud project ID
  projectId: "x5ugjf",

  e2e: {
    baseUrl: "http://localhost:3000",
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: {
      runMode: 2,
      openMode: 0
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        }
      })
    },
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    screenshotsFolder: "cypress/screenshots",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
