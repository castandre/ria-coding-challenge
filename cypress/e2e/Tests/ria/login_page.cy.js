import calculatorPage from '../../../support/pageObjects/CalculatorPage';
import loginPage from '../../../support/pageObjects/LoginPage';

describe('get started navigation', () => {
    let testData;

    before(() => {
        cy.fixture('testData').then((data) => {
            testData = data;
        });
    });

    it('TC01: Should redirect to secure.riamoneytransfer.com when Get Started is clicked', () => {
        calculatorPage.visit(testData.urls.homepage);
        calculatorPage.enterAmount(testData.amounts.valid);
        calculatorPage.startTransferLink().click();

        cy.url().should('include', 'secure.riamoneytransfer.com');
    });
});

describe('login page', () => {
    let testData;

    before(() => {
        cy.fixture('testData').then((data) => {
            testData = data;
        });
    });

    beforeEach(() => {
        loginPage.visit(testData.urls.login);
    });

    it('TC02: Should display the Register button, email field and password field', () => {
        loginPage.registerLink().should('be.visible');
        loginPage.emailInput().should('be.visible');
        loginPage.passwordInput()
            .should('be.visible')
            .and('have.attr', 'type', 'password');
    });

    it('TC03: Should redirect to the country selection page when Register is clicked', () => {
        loginPage.clickRegister();
        cy.url().should('include', '/registration');
    });
});
