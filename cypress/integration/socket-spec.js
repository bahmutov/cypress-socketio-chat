/// <reference types="cypress" />

it('sees the 2nd user join', () => {
  // the browser is the 1st user
  const name = `Cy_${Cypress._.random(1000)}`
  cy.log(`User **${name}**`)
  cy.visit('/', {
    onBeforeLoad(win) {
      cy.stub(win, 'prompt').returns(name)
    },
  })

  // make sure the greeting message is shown
  cy.contains('#messages li i', `${name} join the chat..`).should('be.visible')

  // connect to the server using 2nd user
  const secondName = 'Ghost'
  cy.task('connect', secondName)
  cy.contains('#messages li i', `${secondName} join the chat..`).should(
    'be.visible',
  )
})
