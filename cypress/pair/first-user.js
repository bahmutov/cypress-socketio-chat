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
  cy.task('checkpoint', 'first user has joined')

  // second user enters the chat
  cy.task('waitForCheckpoint', 'second user has joined')
  cy.contains('#messages li i', `${secondName} join the chat..`).should(
    'be.visible',
  )

  // second user will post a message
  cy.contains('#messages li', 'Good to see you').contains('strong', secondName)

  // we will reply to the second user
  cy.get('#txt').type('Glad to be here{enter}')
  cy.contains('#messages li', 'Glad to be here').contains('strong', name)
  // make sure the second user saw our message
  cy.task('waitForCheckpoint', 'second user saw glad to be here')

  // disconnect from the chat by visiting the blank page
  cy.window().then((win) => {
    win.location.href = 'about:blank'
  })
  cy.task('waitForCheckpoint', 'second user saw first user leave')
})
