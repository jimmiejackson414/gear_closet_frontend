export {};
const hostname = Cypress.env('base_url');
const email = Cypress.env('username');
const password = Cypress.env('password');
const registerPath = `${hostname}/register`;

describe('register page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    cy.visit(registerPath);
  });

  it('Verify inputs and submit button exist', () => {
    cy.get('[data-cy=register-email-input]')
      .should('be.visible');
    cy.get('[data-cy=register-fname-input]')
      .should('be.visible');
    cy.get('[data-cy=register-lname-input]')
      .should('be.visible');
    cy.get('[data-cy=register-password-input]')
      .should('be.visible');
    cy.get('[data-cy=register-confirm-password-input]')
      .should('be.visible');
    cy.contains('Submit');
    cy.contains('Signin');
    cy.contains('Terms and Conditions');
  });

  it('Register with invalid email', () => {
    cy.get('[data-cy=register-email-input]')
      .type('test');
    cy.get('[data-cy=register-fname-input]')
      .type('Jim');
    cy.get('[data-cy=register-lname-input]')
      .type('Bob');
    cy.get('[data-cy=register-password-input]')
      .type('password');
    cy.get('[data-cy=register-confirm-password-input]')
      .type('password');
    cy.contains('Submit')
      .click();
    cy.get('input[type=email]:invalid')
      .should('have.length', 1);
    cy.contains('Not a valid email');
  });

  it('Attempt register with non-matching passwords', () => {
    cy.get('[data-cy=register-email-input]')
      .type(email);
    cy.get('[data-cy=register-fname-input]')
      .type('Jim');
    cy.get('[data-cy=register-lname-input]')
      .type('Bob');
    cy.get('[data-cy=register-password-input]')
      .type(password);
    cy.get('[data-cy=register-confirm-password-input]')
      .type('nomatch');
    cy.contains('Submit')
      .click();
    cy.contains('Must match password');
  });
});
