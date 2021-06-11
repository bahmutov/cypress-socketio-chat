/// <reference types="cypress" />

// this test behaves as the second user to join the chat
it('chats with the first user', () => {
  const name = 'Second'
  // we are chatting with the first user
  const firstName = 'First'
  cy.visit('/', {
    onBeforeLoad(win) {
      cy.stub(win, 'prompt').returns(name)
    },
  })

  // make sure the greeting message is shown
  cy.contains('#messages li i', `${name} join the chat..`).should('be.visible')

  cy.get('#txt').type('Good to see you{enter}')

  // a message from the first user arrives
  cy.contains('#messages li', 'Glad to be here').contains('strong', firstName)
})
