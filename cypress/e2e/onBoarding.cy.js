describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://www.riamoneytransfer.com/en-cl/')
    cy.get('#rate-title').should('have.text', 'Your first transfer has a promo rate!')
  })
})