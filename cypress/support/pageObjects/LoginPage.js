class LoginPage {
    visit(url) {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit(url);
        cy.dismissCookieBanner();
    }

    registerLink() {
        return cy.contains('Register', { timeout: 10000 });
    }

    emailInput() {
        return cy.get('[analytics-name="login-email-input"]', { timeout: 10000 });
    }

    passwordInput() {
        return cy.get('[analytics-name="login-password"]', { timeout: 10000 });
    }

    clickRegister() {
        this.registerLink().click();
    }
}

export default new LoginPage();
