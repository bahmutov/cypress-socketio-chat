/// <reference types="cypress" />

it('disconnects by visiting the blank page', () => {
  const name = `Disconnect_${Cypress._.random(1000)}`

  // https://on.cypress.io/visit
  cy.visit('/', {
    onBeforeLoad(win) {
      // when the application asks for the name
      cy.stub(win, 'prompt').returns(name)
    },
  })

  // make sure the greeting message is shown
  cy.contains('#messages li i', `${name} join the chat..`).should('be.visible')

  // try posting a message
  cy.get('#txt').type('Hello there{enter}')
  cy.contains('#messages li', 'Hello there').contains('strong', name)

  // disconnect from the chat by visiting the blank page
  // but first connect as a 2nd user via socket directly
  cy.task('connect', 'from spec')

  cy.window().then((win) => {
    win.location.href = 'about:blank'
  })

  // check if the disconnect message was received by the chat server
  cy.wait(3000) // hopefully 3 second delay is enough
  cy.task('getLastMessage').should('contain', `${name} left the chat`)
})
