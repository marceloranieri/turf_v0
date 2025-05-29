// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Supabase Authentication Command
Cypress.Commands.add('loginBySupabase', () => {
  cy.request({
    method: 'POST',
    url: 'https://vknmgkonzwhqptweemwr.supabase.co/auth/v1/token?grant_type=password',
    body: {
      email: 'cypress@turf.com',
      password: 'Test1234!'
    },
    headers: {
      apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbm1na29uendocXB0d2VlbXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjI1NTEsImV4cCI6MjA2MjgzODU1MX0.69HWgB6dbv2H_-9PP9PlnPK6WMw0LMwfoxfLUzKobgA',
      'Content-Type': 'application/json'
    }
  }).then(({ body }) => {
    window.localStorage.setItem('supabase.auth.token', JSON.stringify(body));
  });
}); 