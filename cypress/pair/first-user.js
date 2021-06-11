/// <reference types="cypress" />

// this test behaves as the first user to join the chat
it('chats with the second user', () => {
  const name = 'First'
  const secondName = 'Second'

  cy.visit('/', {
    onBeforeLoad(win) {
      cy.stub(win, 'prompt').returns(name)
    },
  })

  // make sure the greeting message is shown
  cy.contains('#messages li i', `${name} join the chat..`).should('be.visible')

  // second user enters the chat
  cy.contains('#messages li i', `${secondName} join the chat..`).should(
    'be.visible',
  )
  // second user posts a message
  cy.contains('#messages li', 'Good to see you').contains('strong', secondName)
})
