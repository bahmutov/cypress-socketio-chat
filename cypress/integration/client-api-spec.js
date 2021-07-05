/// <reference types="cypress" />

describe('Mocking app API', () => {
  // reach inside the application to stub its app actions
  it('sends message to the server', () => {
    const name = `Cy_${Cypress._.random(1000)}`
    cy.log(`User **${name}**`)
    let clientActions
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'prompt').returns(name)
        Object.defineProperty(win, '__clientActions', {
          set(client) {
            clientActions = client
            // spy on the client actions
            cy.spy(clientActions, 'setUsername').as('setUsername')
            cy.spy(clientActions, 'sendMessage').as('sendMessage')
          },
          get() {
            return clientActions
          },
        })
      },
    })
      // cy.visit yields the window object
      // make the test wait until the app sets this property
      .its('__clientActions')
    cy.get('@setUsername').should('have.been.calledWith', name)
    // sends the message from UI to app code
    cy.get('#txt').type('Hello there{enter}')
    cy.get('@sendMessage').should('have.been.calledWith', 'Hello there')
  })

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
    cy.window().its('__clientActions').as('client')
    cy.get('@client').invoke('isOnline', '👻 <i>Ghost is testing</i>')
    cy.get('@client').invoke('onChatMessage', '<strong>Ghost</strong>: Boo')
    cy.contains('#messages li', 'Boo').contains('strong', 'Ghost')
  })
})
