describe('Full UI Flow', () => {
  const TEST_CIRCLE_NAME = 'Design Thinking';
  const TEST_CIRCLE_SLUG = 'design-thinking';
  let testCircleId;

  before(() => {
    // Login before all tests
    cy.loginBySupabase().then(() => {
      const token = window.localStorage.getItem('supabase.auth.token');
      const { access_token } = JSON.parse(token);
      cy.log('Got access token:', access_token);

      // Create test circle via Supabase REST
      cy.request({
        method: 'POST',
        url: 'https://vknmgkonzwhqptweemwr.supabase.co/rest/v1/topics',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbm1na29uendocXB0d2VlbXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjI1NTEsImV4cCI6MjA2MjgzODU1MX0.69HWgB6dbv2H_-9PP9PlnPK6WMw0LMwfoxfLUzKobgA',
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: {
          title: TEST_CIRCLE_NAME,
          question: 'What are your thoughts on design thinking?',
          category: 'Design',
          description: 'Test circle for QA automation',
          is_active: true
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Response status:', response.status);
        cy.log('Response body:', JSON.stringify(response.body, null, 2));
        
        if (response.status === 201 || response.status === 200) {
          testCircleId = response.body[0].id;
          cy.log(`Created test circle with ID: ${testCircleId}`);
        } else {
          cy.log('Failed to create test circle. Status:', response.status);
          cy.log('Error details:', response.body);
          throw new Error(`Failed to create test circle: ${JSON.stringify(response.body)}`);
        }
      });
    });
  });

  beforeEach(() => {
    cy.loginBySupabase();
  });

  it('Navigates through all sidebar menu items', () => {
    cy.visit('/');
    cy.log('Testing sidebar navigation');

    // Test each menu item with data-testid
    const menuItems = [
      { text: 'Home', testId: 'nav-home', url: '/' },
      { text: 'My Circles', testId: 'nav-my-circles', url: '/my-circles' },
      { text: 'Notifications', testId: 'nav-notifications', url: '/notifications' },
      { text: 'Messages', testId: 'nav-messages', url: '/messages' },
      { text: 'Bookmarks', testId: 'nav-bookmarks', url: '/bookmarks' },
      { text: 'Profile', testId: 'nav-profile', url: '/profile' },
      { text: 'Explore', testId: 'nav-explore', url: '/explore' },
      { text: 'Settings', testId: 'nav-settings', url: '/settings' }
    ];

    menuItems.forEach(item => {
      cy.get(`[data-testid="${item.testId}"]`).click();
      cy.url().should('include', item.url);
      cy.log(`Successfully navigated to ${item.text}`);
    });
  });

  it('Tests circle interactions and chatroom access', () => {
    cy.visit('/my-circles');
    cy.log('Testing circle interactions');

    // Find and join the test circle
    cy.get('[data-testid="circle-card"]')
      .contains(TEST_CIRCLE_NAME)
      .parents('[data-testid="circle-card"]')
      .within(() => {
        cy.get('[data-testid="join-button"]').click();
      });

    // Verify immediate redirection to chatroom
    cy.url().should('include', `/circle-chatroom/${TEST_CIRCLE_SLUG}`);
    cy.get('[data-testid="chatroom"]').should('exist');
    cy.log('Successfully joined circle and entered chatroom');

    // Test circle options menu
    cy.get('[data-testid="circle-options-menu"]').click();
    cy.get('[data-testid="circle-menu-modal"]').should('be.visible');
    cy.log('Circle options menu opened');

    // Send a message
    cy.get('[data-testid="message-input"]')
      .should('be.visible')
      .type('Hello from Cypress test!{enter}');
    cy.log('Sent test message');

    // Test emoji picker
    cy.get('[data-testid="emoji-button"]').click();
    cy.get('[data-testid="emoji-picker"]').should('be.visible');
    cy.get('[data-testid="emoji-picker"] .emoji').first().click();
    cy.log('Added emoji');

    // Test GIF picker
    cy.get('[data-testid="gif-button"]').click();
    cy.get('[data-testid="gif-search"]').type('funny');
    cy.get('[data-testid="gif-result"]').first().click();
    cy.log('Added GIF');

    // Test message reporting
    cy.get('[data-testid="message"]').first()
      .trigger('mouseover')
      .within(() => {
        cy.get('[data-testid="report-button"]').click();
      });
    cy.get('[data-testid="report-modal"]').should('be.visible');
    cy.get('[data-testid="confirm-report"]').click();
    cy.log('Reported message');
  });

  it('Tests search and topic discovery', () => {
    cy.visit('/');
    
    // Test search
    cy.get('[data-testid="search-button"]').click();
    cy.url().should('include', '/search');
    cy.get('[data-testid="search-bar"]').should('be.focused');
    cy.log('Search page accessed');

    // Test trending topics
    cy.visit('/');
    cy.get('[data-testid="topic-card"]').first().click();
    cy.url().should('include', '/topics/');
    cy.log('Topic page accessed');

    // Test Who to Follow
    cy.visit('/suggestions');
    cy.get('[data-testid="suggestion-card"]').should('exist');
    cy.log('Suggestions page loaded');
  });

  it('Tests feedback and topic suggestion', () => {
    cy.visit('/');

    // Test feedback modal
    cy.get('[data-testid="feedback-button"]').click();
    cy.get('[data-testid="feedback-modal"]').should('be.visible');
    cy.get('[data-testid="feedback-form"]').within(() => {
      cy.get('[data-testid="feedback-input"]').type('Test feedback');
      cy.get('[data-testid="submit-feedback"]').click();
    });
    cy.log('Feedback submitted');

    // Test topic suggestion
    cy.get('[data-testid="suggest-topic-button"]').click();
    cy.get('[data-testid="topic-suggestion-modal"]').should('be.visible');
    cy.get('[data-testid="topic-suggestion-form"]').within(() => {
      cy.get('[data-testid="topic-title"]').type('New Topic Idea');
      cy.get('[data-testid="topic-description"]').type('Description of the topic');
      cy.get('[data-testid="submit-topic"]').click();
    });
    cy.log('Topic suggestion submitted');
  });

  after(() => {
    // Cleanup: Delete test circle
    if (testCircleId) {
      cy.request({
        method: 'DELETE',
        url: `https://vknmgkonzwhqptweemwr.supabase.co/rest/v1/topics?id=eq.${testCircleId}`,
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbm1na29uendocXB0d2VlbXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjI1NTEsImV4cCI6MjA2MjgzODU1MX0.69HWgB6dbv2H_-9PP9PlnPK6WMw0LMwfoxfLUzKobgA',
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      });
      cy.log('Cleaned up test circle');
    }
  });
}); 