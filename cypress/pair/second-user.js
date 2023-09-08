/// <reference types="cypress" />

// this test behaves as the second user to join the chat
it('interacts with Google', () => {
  cy.visit('http://www.google.ca');
  cy.url().should('eq', 'https://www.google.ca/?gws_rd=ssl'); // Check if URL matches.
});
