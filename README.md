# cypress-socketio-chat
[![ci status][ci image]][ci url] [![badges status][badges image]][badges url] [![renovate-app badge][renovate-badge]][renovate-app] ![cypress version](https://img.shields.io/badge/cypress-7.6.0-brightgreen)
> Example testing real-time [Socket.io](https://socket.io/) chat using [Cypress.io](https://www.cypress.io/)

The original chat program copied from [dkhd/node-group-chat](https://github.com/dkhd/node-group-chat) as described in [Build A Group-Chat App in 30 Lines Using Node.js](https://itnext.io/build-a-group-chat-app-in-30-lines-using-node-js-15bfe7a2417b) blog post.

![Chat test](images/chat.png)

Read the blog posts [Test a Socket.io Chat App using Cypress](https://glebbahmutov.com/blog/test-socketio-chat-using-cypress/) and [Run Two Cypress Test Runners At The Same Time](https://glebbahmutov.com/blog/run-two-cypress-runners/).

## Specs

Name | Description
---|---
[first-spec](./cypress/integration/first-spec.js) | Tests that the user can post a message and see it
[random-name-spec.js](./cypress/integration/random-name-spec.js) | Creates a random user name for the test
[client-api-spec.js](./cypress/integration/client-api-spec.js) | Invokes events as a 2nd user using app actions
[socket-spec.js](./cypress/integration/socket-spec.js) | Connects to the Socket.io server as a 2nd user

## Running 2 Cypress instances

This repo also shows how to run 2 Cypress instances at the same time to "really" chat with each other.

- start the server with `npm start`
- execute `npm run chat:run` which starts the two Cypress processes

Look at the [package.json](./package.json) file to see the commands we use to run the first and second user specs - they are listed in [cy-first-user.json](./cy-first-user.json) and [cy-second-user.json](./cy-second-user.json) config files.

The test runners wait for each other using a common Socket.io server created in the [chat.js](./cypress/pair/chat.js) script. This is a separate Socket.io server from the application.

![Test communication](./images/chat-server.png)

The first server logs in and reports that it is ready for the second test to start

```js
// cypress/pair/first-user.js
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
})
```

The second test runner executes its own test. It first waits for the checkpoint before visiting the page

```js
// cypress/pair/second-user.js
/// <reference types="cypress" />

// this test behaves as the second user to join the chat
it('chats with the first user', () => {
  cy.task('waitForCheckpoint', 'first user has joined')

  const name = 'Second'
  // we are chatting with the first user
  const firstName = 'First'
  cy.visit('/', {
    onBeforeLoad(win) {
      cy.stub(win, 'prompt').returns(name)
    },
  })
})
```

[ci image]: https://github.com/bahmutov/cypress-socketio-chat/workflows/ci/badge.svg?branch=main
[ci url]: https://github.com/bahmutov/cypress-socketio-chat/actions
[badges image]: https://github.com/bahmutov/cypress-socketio-chat/workflows/badges/badge.svg?branch=main
[badges url]: https://github.com/bahmutov/cypress-socketio-chat/actions
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
