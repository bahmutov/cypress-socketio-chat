/// <reference types="cypress" />

const io = require('socket.io-client')

describe('Open 2nd socket connection', () => {
  it('communicates with 2nd user', () => {
    // the browser is the 1st user
    const name = `Cy_${Cypress._.random(1000)}`

    cy.log(`User **${name}**`)
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'prompt').returns(name)
      },
    })

    // make sure the greeting message is shown
    cy.contains('#messages li i', `${name} join the chat..`)
      .should('be.visible')
      .then(() => {
        // and now connect to the server using 2nd user
        // by opening a new Socket connection from the same browser window
        const secondName = 'Ghost'

        const socket = io.connect('http://localhost:8080')
        socket.emit('username', secondName)

        // keep track of the last message sent by the server
        let lastMessage
        socket.on('chat_message', (msg) => (lastMessage = msg))

        // the page shows that the second user has joined the chat
        cy.contains('#messages li i', `${secondName} join the chat..`).should(
          'be.visible',
        )

        // the second user can send a message and the page shows it
        const message = 'hello from 2nd user'
        socket.emit('chat_message', message)
        cy.contains('#messages li', message)

        // when the first user sends the message from the page
        // the second user receives it via socket
        const greeting = `Hello there ${Cypress._.random(10000)}`
        cy.get('#txt').type(greeting)
        cy.get('form').submit()

        // verify the web page shows the message
        // this ensures we can ask the 2nd user for its last message
        // and it should already be there
        cy.contains('#messages li', greeting).contains('strong', name)

        // place the assertions in a should callback
        // to retry them, maybe there is a delay in delivery
        cy.should(() => {
          // using "include" assertion since the server adds HTML markup
          expect(lastMessage, 'last message for 2nd user').to.include(greeting)
          expect(lastMessage, 'has the sender').to.include(name)
        })

        cy.log('**second user leaves**').then(() => {
          socket.disconnect()
        })
        cy.contains('#messages li i', `${secondName} left the chat..`).should(
          'be.visible',
        )
      })
  })
})
