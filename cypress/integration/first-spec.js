/// <reference types="cypress" />

it('posts my messages', () => {
  // https://on.cypress.io/visit
  cy.visit('/', {
    onBeforeLoad(win) {
      // when the application asks for the name
      // return "Cy" using https://on.cypress.io/stub
      cy.stub(win, 'prompt').returns('Cy')
    },
  })

  // make sure the greeting message is shown
  cy.contains('#messages li i', 'Cy join the chat..').should('be.visible')

  // try posting a message
  cy.get('#txt').type('Hello there{enter}')
  cy.contains('#messages li', 'Hello there').contains('strong', 'Cy')
})
