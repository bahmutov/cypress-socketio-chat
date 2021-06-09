/// <reference types="cypress" />

it('chats', () => {
  cy.visit('/', {
    onBeforeLoad(win) {
      cy.stub(win, 'prompt').returns('Cy')
    }
  })
  cy.get('#txt').type('Hello there{enter}')
  cy.contains('#messages li', 'Hello there').contains('strong', 'Cy')
})
