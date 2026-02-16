// Ignore known non-critical JS errors globally
Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('Cannot read properties of null') ||
    err.message.includes('Vimeo') ||
    err.message.includes('player element')
  ) {
    return false
  }
  return true
})

describe('Cymulate vs Competitors — Tabs functionality', () => {

  function acceptCookiesIfPresent() {
    cy.get('body').then(($body) => {
      if ($body.find('#onetrust-accept-btn-handler').length > 0) {
        cy.get('#onetrust-accept-btn-handler', { timeout: 10000 })
          .should('be.visible')
          .click({ force: true })
      }
    })
  }

  function scrollPage() {
    cy.scrollTo('bottom', { duration: 800 })
    cy.wait(800)
    cy.scrollTo('top', { duration: 400 })
  }

  it('All competitor tabs switch correctly and content loads', () => {

    cy.visit('https://cymulate.com/cymulate-vs-competitors/', {
      failOnStatusCode: false
    })

    acceptCookiesIfPresent()

    // Basic page checks
    cy.url().should('include', '/cymulate-vs-competitors/')
    cy.title().should('include', 'Competitor')

    cy.get('main', { timeout: 20000 }).should('be.visible')

    scrollPage()

    // Iterate through all tabs
    cy.get('.kt-tabs-title-list')
      .find('button, a, li')
      .filter(':visible')
      .each(($tab) => {

        cy.wrap($tab).click({ force: true })

        // ✅ Check active tab state
        cy.wrap($tab).should('have.attr', 'aria-selected', 'true')

        // Wait for content switch
        cy.get('.kt-tabs-content-wrap', { timeout: 15000 })
          .should('be.visible')
          .and('not.be.empty')

        // Check SVGs loaded
        cy.get('.kt-tabs-content-wrap svg')
          .should('have.length.greaterThan', 0)
          .each(($svg) => {
            cy.wrap($svg).should('be.visible')
          })

        // Check competitor links
        cy.get('.kt-tabs-content-wrap a[href*="/cymulate-vs-competitors/"]')
          .each(($link) => {
            cy.wrap($link)
              .should('have.attr', 'href')
              .and('match', /cymulate-vs-competitors\/.+/)

            cy.wrap($link)
              .invoke('attr', 'href')
              .then((href) => {
                expect(href).to.not.be.empty
              })
          })

        cy.wait(500)
      })

    // Final sanity check
    cy.document().then((doc) => {
      expect(doc.body.scrollHeight).to.be.greaterThan(2000)
    })

  })

})