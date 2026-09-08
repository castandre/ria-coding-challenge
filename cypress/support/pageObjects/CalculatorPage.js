class CalculatorPage {
    visit(url) {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit(url);
        cy.dismissCookieBanner();
    }

    amountFromInput() {
        return cy.get('#amount-from');
    }

    amountToInput() {
        return cy.get('#amount-to');
    }

    sendToButton() {
        return cy.get('[aria-label="Select Destination"]');
    }

    startTransferLink() {
        return cy.contains('a', 'Start your transfer');
    }

    enterAmount(amount) {
        this.amountFromInput().type(`{selectall}{backspace}${amount}`);
    }

    openCountryList() {
        this.sendToButton().should('have.length', 1).click();
    }

    selectOption(optionText) {
        cy.contains('[role="option"]', optionText, { timeout: 10000 }).click();
    }

    selectHaiti() {
        this.openCountryList();
        this.selectOption('Haiti');
        this.selectOption('Haitian Gourde');
    }

    getConvertedAmount() {
        return this.amountToInput().invoke('val');
    }

    assertConvertedAmountIsPositive() {
        this.amountToInput().should(($input) => {
            expect(parseFloat($input.val())).to.be.greaterThan(0);
        });
    }

    assertConvertedAmountChanged(previousValue) {
        this.amountToInput().should(($input) => {
            expect($input.val()).not.to.eq(previousValue);
        });
    }

    // High-level flows: bundle the steps every test repeats into one call each.
    convertAmountThenCountry(amount, currencyCode) {
        this.enterAmount(amount);
        this.selectHaiti();
        this.assertConvertedAmountIsPositive();
        cy.contains(currencyCode).should('be.visible');
        this.startTransferLink().should('be.visible');
    }

    convertCountryThenAmount(amount, currencyCode) {
        this.selectHaiti();
        this.enterAmount(amount);
        this.assertConvertedAmountIsPositive();
        cy.contains(currencyCode).should('be.visible');
        this.startTransferLink().should('be.visible');
    }
}

export default new CalculatorPage();
