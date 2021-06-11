/// <reference types="cypress" />

// this test behaves as the second user to join the chat
it('chats with the first user', () => {
  const name = 'Second'
  cy.visit('/', {
    onBeforeLoad(win) {
      cy.stub(win, 'prompt').returns(name)
    },
  })

  // make sure the greeting message is shown
  cy.contains('#messages li i', `${name} join the chat..`).should('be.visible')

  // try posting a message
  // cy.get('#txt').type('Hello there{enter}')
  // cy.contains('#messages li', 'Hello there').contains('strong', 'Cy')
})
