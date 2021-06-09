/// <reference types="cypress" />

it('chats', () => {
  const name = `Cy_${Cypress._.random(1000)}`
  cy.visit('/', {
    onBeforeLoad(win) {
      cy.stub(win, 'prompt').returns(name)
    },
  })
  cy.get('#txt').type('Hello there{enter}')
  cy.contains('#messages li', 'Hello there').contains('strong', name)

  // pretend to send a message from another user
  cy.window()
    .its('clientActions')
    .invoke('isOnline', '👻 <i>Ghost is testing</i>')
  cy.window()
    .its('clientActions')
    .invoke('onChatMessage', '<strong>Ghost</strong>: Boo')
  cy.contains('#messages li', 'Boo').contains('strong', 'Ghost')
})
