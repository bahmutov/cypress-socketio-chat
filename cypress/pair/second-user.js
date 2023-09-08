/// <reference types="cypress" />

describe('Second user 2',()=>{
  // this test behaves as the second user to join the chat
it('chats with the first user', () => {
  cy.visit('/');
})

it('Fail Assetion to test', () =>{
  //This Assetion will fail
  cy.wrap(2 + 2).should('eq', 5);
})
})

