describe('Vue-Express-Tree', () => {
  it('returns tree chart with correct elements', () => {
    cy.visit('/')
    cy.get('#app').should('exist').should('have.length', 1)
    cy.get('.tree').should('exist').should('have.length', 1)
    cy.get('.svg').should('exist').should('have.length', 1)
    cy.get('.leaf').as('leaves').should('exist').should('have.length', 7)
    cy.get('.link').should('exist').should('have.length', 6)
    cy.get('.aside').as('aside').should('exist').should('have.length', 1)
    cy.get('@aside').contains('name').should('exist').should('have.length', 1)
    cy.get('@aside').contains('description').should('exist').should('have.length', 1)
    cy.get('@aside').contains('parent').should('exist').should('have.length', 1)
    cy.get('@aside').contains('children').should('exist').should('have.length', 1)
  })

  it('populates leaf details on click', () => {
    cy.visit('/')
    cy.get('.leaf').eq(1).click()
    cy.get('.name').contains('B').should('exist').should('have.length', 1)
    cy.get('.description').contains('This is a description of B').should('exist').should('have.length', 1)
    cy.get('.parentName').contains('A').should('exist').should('have.length', 1)
    cy.get('.children').contains('B-1, B-2, B-3')
  })

  it('clears leaf details on close', () => {
    cy.visit('/')
    cy.get('.leaf').eq(1).click()
    cy.get('.close').click()
    cy.get('.name').should('have.value', '')
    cy.get('.description').should('have.value', '')
    cy.get('.parentName').should('have.value', '')
    cy.get('.children').should('have.value', '')
  })
})
