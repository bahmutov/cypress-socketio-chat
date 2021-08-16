/// <reference types="cypress" />

import SocketMock from 'socket.io-mock'

describe('Mock socket', () => {
  // these tests "trick" the application by injecting
  // a mock socket from the test into the application
  // instead of letting the application connect to the real one
  const socket = new SocketMock()

  // store info about the client connected from the page
  let username
  let lastMessage
  socket.socketClient.on('username', (name) => {
    console.log('user %s connected', name)
    username = name
    // broadcast to everyone, mimicking the index.js server
    socket.socketClient.emit(
      'is_online',
      '🔵 <i>' + username + ' join the chat..</i>',
    )
  })

  socket.socketClient.on('chat_message', (message) => {
    console.log('user %s says "%s"', username, message)
    lastMessage = '<strong>' + username + '</strong>: ' + message
    socket.socketClient.emit('chat_message', lastMessage)
  })

  it('chats', () => {
    cy.intercept('/scripts/app.js', (req) => {
      // delete any cache headers to get a fresh response
      delete req.headers['if-none-match']
      delete req.headers['if-modified-since']

      req.continue((res) => {
        res.body = res.body.replace(
          "io.connect('http://localhost:8080')",
          'window.testSocket',
        )
      })
    }).as('appjs')

    // the browser is the 1st user
    const name = `Cy_${Cypress._.random(1000)}`

    cy.log(`User **${name}**`)
    cy.visit('/', {
      onBeforeLoad(win) {
        win.testSocket = socket
        cy.stub(win, 'prompt').returns(name)
      },
    })
    cy.wait('@appjs') // our code intercept has worked
      // verify we have received the username
      // use .should(callback) to retry
      // until the variable username has been set
      .should(() => {
        expect(username, 'username').to.equal(name)
      })

    // try sending a message via page UI
    cy.get('#txt').type('Hello there{enter}')
    cy.contains('#messages li', 'Hello there').contains('strong', name)

    // verify the mock socket has received the message
    cy.should(() => {
      expect(lastMessage, 'the right text').to.include('Hello there')
      expect(lastMessage, 'the sender').to.include(name)
    }).then(() => {
      // emit message from the test socket
      // to make sure the page shows it
      socket.socketClient.emit(
        'chat_message',
        '<strong>Cy</strong>: Mock socket works!',
      )

      cy.contains('#messages li', 'Mock socket works').contains('strong', 'Cy')
    })
  })
})
