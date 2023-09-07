/// <reference types="cypress" />

// this test behaves as the first user to join the chat
it('chats with the second user', () => {
  const name = 'First'
  const secondName = 'Second'
  cy.visit('/');
})
