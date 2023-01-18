export {};
const hostName = Cypress.env('base_url');
const email = Cypress.env('username');
const password = Cypress.env('password');
const loginPath = `${hostName}/login`;

describe('login page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    cy.visit(loginPath);
  });

  it('Verify inputs and submit button exist', () => {
    cy.get('[data-cy=login-email-input]')
      .should('be.visible');
    cy.get('[data-cy=login-password-input]')
      .should('be.visible');
    cy.contains('Submit');
    cy.contains('Signup');
    cy.contains('Forgot your password?');
    cy.contains('Terms and Conditions.');
  });

  it('If user leaves blank username or password', () => {
    cy.contains('Submit')
      .click();
    cy.contains('Email is required');
  });

  it('If user leaves password blank', () => {
    cy.get('[data-cy=login-email-input]')
      .type(email);
    cy.contains('Submit')
      .click();
    cy.contains('Password is required');
  });

  it('Login with invalid username or password', () => {
    cy.get('[data-cy=login-email-input]')
      .type(email);
    cy.get('[data-cy=login-password-input]')
      .type('111');
    cy.contains('Submit')
      .click();
    cy.get('.alert.error')
      .should('be.visible')
      .and('contain', 'There was an error logging in. Please try again.');
  });

  it('Login with valid username and password, Dashboard title visible', () => {
    cy.get('[data-cy=login-email-input]')
      .type(email);
    cy.get('[data-cy=login-password-input]')
      .type(password);
    cy.contains('Submit')
      .click();
    cy.url()
      .should('be.equal', `${hostName}/`);
    cy.contains('Dashboard')
      .should('be.visible');
  });
});
