// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const COOKIE_BANNER_SELECTOR = '[analytics-name="consent-manager-allow-all-cookies"]';

function pollForCookieBanner(attemptsLeft) {
    cy.get('body').then(($body) => {
        const acceptButton = $body.find(COOKIE_BANNER_SELECTOR);
        if (acceptButton.length) {
            cy.wrap(acceptButton).click();
            cy.get(COOKIE_BANNER_SELECTOR).should('not.exist');
        } else if (attemptsLeft > 0) {
            cy.wait(300);
            pollForCookieBanner(attemptsLeft - 1);
        }
    });
}

Cypress.Commands.add('dismissCookieBanner', () => {
    pollForCookieBanner(10);
});