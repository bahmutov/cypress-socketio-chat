/// <reference types="cypress" />

it('chats', () => {
  cy.visit('/', {
    onBeforeLoad(win) {
      // when the application asks for the name
      // return "Cy" using https://on.cypress.io/stub
      cy.stub(win, 'prompt').returns('Cy')
    },
  })
  cy.get('#txt').type('Hello there{enter}')
  cy.contains('#messages li', 'Hello there').contains('strong', 'Cy')
})
