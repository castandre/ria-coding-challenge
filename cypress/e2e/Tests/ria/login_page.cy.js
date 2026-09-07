describe('get started navigation', () => {
    it('TC01: Should redirect to secure.riamoneytransfer.com when Get Started is clicked', () => {
        cy.visit('https://www.riamoneytransfer.com/en-cl/');

        cy.get('#amount-from').clear().type('25000');
        cy.get('[type="button"]').eq(3).click();
        cy.contains('[role="option"]', 'Haiti').click();
        cy.contains('[role="option"]', 'Haitian Gourde').click();

        cy.contains('a', 'Start your transfer').click();

        cy.url().should('include', 'secure.riamoneytransfer.com');
    });
});

describe('login page', () => {
    beforeEach(() => {
        cy.visit('https://secure.riamoneytransfer.com/login');
    });

    it('TC02: Should display the Register button, email field and password field', () => {
        cy.contains('Register').should('be.visible');
        cy.get('[analytics-name="login-email-input"]').should('be.visible');
        cy.get('[analytics-name="login-password"]')
            .should('be.visible')
            .and('have.attr', 'type', 'password');
    });

    it('TC03: Should redirect to the country selection page when Register is clicked', () => {
        cy.dismissCookieBanner();
        cy.contains('Register').click();

        cy.url().should('include', '/registration');
    });
});
