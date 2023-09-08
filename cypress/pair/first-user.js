/// <reference types="cypress" />

// This test behaves as the first user to join the chat
it('interacts with the Cypress website', () => {
  const name = 'First';
  const secondName = 'Second';

  // Visit the Cypress website or the appropriate URL you intend to test.
  cy.visit('https://www.cypress.io/');

  // Example interaction and assertion:
  cy.contains('Download').click(); // Click on a download link.
  cy.url().should('include', '/download'); // Assert that the URL contains '/download'.

  // Add more interactions and assertions as needed for your specific tests.
});
