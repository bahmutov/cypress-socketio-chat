/// <reference types="cypress" />

// this test behaves as the second user to join the chat
it('interacts with Google', () => {
  cy.visit('http://www.google.ca');
  cy.url().should('eq', 'https://www.google.ca'); // Check if URL matches.
  cy.get('input[name="q"]').type('Cypress testing{enter}'); // Perform a search.
  cy.get('#search').should('be.visible'); // Assert that search results are displayed.
});
