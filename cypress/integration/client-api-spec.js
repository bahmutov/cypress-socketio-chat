/// <reference types="cypress" />

it('shows status for 2nd user', () => {
  const name = `Cy_${Cypress._.random(1000)}`
  cy.log(`User **${name}**`)
  cy.visit('/', {
    onBeforeLoad(win) {
      cy.stub(win, 'prompt').returns(name)
    },
  })

  cy.get('#txt').type('Hello there{enter}')
  cy.contains('#messages li', 'Hello there')
    .contains('strong', name)
    .then(() => {
      cy.log('**second user**')
    })

  // pretend to send a message from another user
  cy.window().its('clientActions').as('client')
  cy.get('@client').invoke('isOnline', '👻 <i>Ghost is testing</i>')
  cy.get('@client').invoke('onChatMessage', '<strong>Ghost</strong>: Boo')
  cy.contains('#messages li', 'Boo').contains('strong', 'Ghost')
})
