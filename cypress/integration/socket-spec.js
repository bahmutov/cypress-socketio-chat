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

it('sees messages from the 2nd user', () => {
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

  const secondName = 'Ghost'
  cy.task('connect', secondName)
  cy.contains('#messages li i', `${secondName} join the chat..`).should(
    'be.visible',
  )

  const message = 'hello from 2nd user'
  cy.task('say', message)
  cy.contains('#messages li', message)
})

it('verifies messages received', () => {
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

  const secondName = 'Ghost'
  cy.task('connect', secondName)
  cy.contains('#messages li i', `${secondName} join the chat..`).should(
    'be.visible',
  )

  // send the message from the first user
  // and use a random code to guarantee we truly receive our message
  const message = `Hello there ${Cypress._.random(10000)}`
  cy.get('#txt').type(message)
  cy.get('form').submit()

  // verify the web page shows the message
  // this ensures we can ask the 2nd user for its last message
  // and it should already be there
  cy.contains('#messages li', message).contains('strong', name)

  cy.task('getLastMessage')
    // note that the message includes the sending user
    // and the message itself
    .should('include', name)
    .and('include', message)
})

it('shows the user leaving', () => {
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

  const secondName = 'Ghost'
  cy.task('connect', secondName)
  cy.contains('#messages li i', `${secondName} join the chat..`).should(
    'be.visible',
  )
  // the 2nd user is leaving
  cy.task('disconnect')
  cy.contains('#messages li i', `${secondName} left the chat..`).should(
    'be.visible',
  )
})
