/// <reference types="cypress" />

it('chats', () => {
  const name = `Cy_${Cypress._.random(1000)}`
  cy.visit('/', {
    onBeforeLoad(win) {
      cy.stub(win, 'prompt').returns(name)
    }
  })
  cy.get('#txt').type('Hello there{enter}')
  cy.contains('#messages li', 'Hello there').contains('strong', name)
})
