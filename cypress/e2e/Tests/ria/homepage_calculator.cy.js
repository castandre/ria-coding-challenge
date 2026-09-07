describe('homepage calculator', () => {
    beforeEach(() => {
        cy.visit('https://www.riamoneytransfer.com/en-cl/');
    });


    it('TC01: Should convert 25000 CLP to HTG when sending to Haiti, regardless of field order', () => {
        const selectHaiti = () => {
            cy.get('[type="button"]').eq(3).click();
            cy.contains('[role="option"]', 'Haiti').click();
            cy.contains('[role="option"]', 'Haitian Gourde').click();
        };

        const assertConversion = () => {
            cy.get('#amount-to').should(($input) => {
                expect(parseFloat($input.val())).to.be.greaterThan(0);
            });
            cy.contains('HTG').should('be.visible');
            cy.contains('a', 'Start your transfer').should('be.visible');
        };

        // Amount first, then country
        cy.get('#amount-from').clear().type('25000').should('have.value', '25000');
        selectHaiti();
        assertConversion();

        // Country first, then amount (reset the page to test the reverse order)
        cy.visit('https://www.riamoneytransfer.com/en-cl/');
        selectHaiti();
        cy.get('#amount-from').clear().type('25000').should('have.value', '25000');
        assertConversion();
    });

    it('TC02: Should show a validation error for invalid Amount input (letters, symbols, negative or empty)', () => {
        const invalidAmounts = ['abcde', '@#$%', '-100', ''];

        invalidAmounts.forEach((value) => {
            cy.get('#amount-from').clear();
            if (value) {
                cy.get('#amount-from').type(value);
            }
            cy.contains('Please enter a valid amount').should('be.visible');
        });
    });

    it('TC03: "Send to" dropdown should feature country options and update the currency label on selection', () => {
        cy.get('[type="button"]').eq(3).click();
        cy.get('[role="option"]').should('have.length.greaterThan', 1);
        cy.contains('[role="option"]', 'Haiti').should('be.visible');

        cy.contains('[role="option"]', 'Haiti').click();
        cy.contains('[role="option"]', 'Haitian Gourde').click();
        cy.contains('HTG').should('be.visible');

        cy.get('[type="button"]').eq(3).click();
        cy.contains('[role="option"]', 'Dominican Republic').click();
        cy.contains('USD').should('be.visible');
    });

    it('TC04: Should handle numeric edge-case formats in the Amount field (decimal, leading zeros, comma and maximum limit)', () => {
        cy.get('#amount-from').clear().type('25000.50').should('have.value', '25000.50');

        cy.get('#amount-from').clear().type('0025000');
        cy.get('#amount-to').should(($input) => {
            expect(parseFloat($input.val())).to.be.greaterThan(0);
        });

        cy.get('#amount-from').clear().type('25,000').should('have.value', '25,000');
        cy.get('#amount-to').should(($input) => {
            expect(parseFloat($input.val())).to.be.greaterThan(0);
        });

        cy.get('#amount-from').clear().type('99999999999');
        cy.contains('Maximum is 10,000,000 CLP').should('be.visible');
        cy.contains('Unable to get rates. Please try again.').should('be.visible');
    });

    it('TC05: Should recalculate the converted amount when the Amount field is updated', () => {
        cy.get('#amount-from').clear().type('25000');
        cy.get('[type="button"]').eq(3).click();
        cy.contains('[role="option"]', 'Haiti').click();
        cy.contains('[role="option"]', 'Haitian Gourde').click();

        cy.get('#amount-to')
            .should(($input) => expect(parseFloat($input.val())).to.be.greaterThan(0))
            .invoke('val')
            .then((initialValue) => {
                cy.get('#amount-from').clear().type('50000');
                cy.get('#amount-to').should(($input) => {
                    expect($input.val()).not.to.eq(initialValue);
                });
            });
    });
});