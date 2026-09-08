import calculatorPage from '../../../support/pageObjects/CalculatorPage';

describe('homepage calculator', () => {
    let testData;

    before(() => {
        cy.fixture('testData').then((data) => {
            testData = data;
        });
    });

    beforeEach(() => {
        calculatorPage.visit(testData.urls.homepage);
    });

    it('TC01: Should convert 25000 CLP to HTG when sending to Haiti, regardless of field order', () => {
        calculatorPage.convertAmountThenCountry(testData.amounts.valid, testData.countries.haitiCurrencyCode);

        calculatorPage.visit(testData.urls.homepage);
        calculatorPage.convertCountryThenAmount(testData.amounts.valid, testData.countries.haitiCurrencyCode);
    });

    it('TC02: Should show a validation error for invalid Amount input (letters, symbols, negative or empty)', () => {
        testData.invalidAmounts.forEach((value) => {
            calculatorPage.enterAmount(value);
            cy.contains(testData.messages.invalidAmount).should('be.visible');
        });
    });

    it('TC03: "Send to" dropdown should feature country options and update the currency label on selection', () => {
        calculatorPage.openCountryList();
        cy.get('[role="option"]').should('have.length.greaterThan', 1);
        cy.contains('[role="option"]', testData.countries.haitiOption).should('be.visible');

        calculatorPage.selectOption(testData.countries.haitiOption);
        calculatorPage.selectOption(testData.countries.haitiCurrencyOption);
        cy.contains(testData.countries.haitiCurrencyCode).should('be.visible');

        calculatorPage.openCountryList();
        calculatorPage.selectOption(testData.countries.secondCountry);
        cy.contains(testData.countries.secondCurrencyCode).should('be.visible');
    });

    it('TC04: Should handle numeric edge-case formats in the Amount field (decimal, leading zeros, comma and maximum limit)', () => {
        calculatorPage.enterAmount(testData.amounts.decimal);
        calculatorPage.amountFromInput().should('have.value', testData.amounts.decimal);

        calculatorPage.enterAmount(testData.amounts.leadingZeros);
        calculatorPage.assertConvertedAmountIsPositive();

        calculatorPage.enterAmount(testData.amounts.comma);
        calculatorPage.amountFromInput().should('have.value', testData.amounts.comma);
        calculatorPage.assertConvertedAmountIsPositive();

        calculatorPage.enterAmount(testData.amounts.excessive);
        cy.contains(testData.messages.maxAmount).should('be.visible');
        cy.contains(testData.messages.ratesUnavailable).should('be.visible');
    });

    it('TC05: Should recalculate the converted amount when the Amount field is updated', () => {
        calculatorPage.enterAmount(testData.amounts.valid);
        calculatorPage.selectHaiti();
        calculatorPage.assertConvertedAmountIsPositive();

        calculatorPage.getConvertedAmount().then((initialValue) => {
            calculatorPage.enterAmount(testData.amounts.updated);
            calculatorPage.assertConvertedAmountChanged(initialValue);
        });
    });
});
