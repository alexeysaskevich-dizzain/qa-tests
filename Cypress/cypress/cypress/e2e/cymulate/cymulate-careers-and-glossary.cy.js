// Handle known non-critical JS errors globally
Cypress.on('uncaught:exception', (err) => {
  // Ignore common WordPress / Vimeo / null errors
  if (
    err.message.includes('Cannot read properties of null') ||
    err.message.includes('Vimeo') ||
    err.message.includes('player element')
  ) {
    return false
  }
  return true
})

describe('Cymulate Heavy Pages - Stability Tests', () => {

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
    cy.scrollTo('bottom', { duration: 1000 })
    cy.wait(1000)
    cy.scrollTo('top', { duration: 500 })
  }

  it('Cybersecurity Glossary page loads correctly', () => {

    cy.visit('https://cymulate.com/cybersecurity-glossary/', {
      failOnStatusCode: false
    })

    acceptCookiesIfPresent()

    // URL check
    cy.url().should('include', '/cybersecurity-glossary/')

    // Title check
    cy.title().should('include', 'Glossary')

    // Ensure main content exists
    cy.get('main', { timeout: 20000 }).should('be.visible')

    // Scroll to trigger lazy loading
    scrollPage()

    // Ensure glossary items loaded
    cy.get('body').should('contain.text', 'Cybersecurity')

    // Ensure page height is reasonable (prevents blank page regression)
    cy.document().then((doc) => {
      expect(doc.body.scrollHeight).to.be.greaterThan(2000)
    })

  })

  it('Careers page loads correctly', () => {

    cy.visit('https://cymulate.com/careers/', {
      failOnStatusCode: false
    })

    acceptCookiesIfPresent()

    cy.url().should('include', '/careers/')
    cy.title().should('include', 'Careers')

    cy.get('main', { timeout: 20000 }).should('be.visible')

    // Scroll to trigger lazy video sections
    scrollPage()

    // Check that career-related content exists
    cy.get('body').should('contain.text', 'Join')
    cy.get('body').should('contain.text', 'Career')

    // Check if Vimeo block container exists (safe check)
    cy.get('body').then(($body) => {
      const iframe = $body.find('iframe[src*="vimeo"]')
      if (iframe.length > 0) {
        cy.wrap(iframe).should('be.visible')
      } else {
        cy.log('Vimeo iframe not present — skipping check')
      }
    })

    // Page height sanity check
    cy.document().then((doc) => {
      expect(doc.body.scrollHeight).to.be.greaterThan(2000)
    })

  })

})