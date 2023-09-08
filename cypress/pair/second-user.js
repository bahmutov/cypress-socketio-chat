/// <reference types="cypress" />

// this test behaves as the second user to join the chat
it('chats with the first user', () => {
  cy.wrap(2 + 2).should('eq', 5);
})