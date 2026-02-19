describe('Partners page regression', () => {

  const acceptCookies = () => {
    cy.get('body').then(($body) => {
      if ($body.find('#onetrust-accept-btn-handler').length) {
        cy.get('#onetrust-accept-btn-handler').click({ force: true })
      }
    })
  }

  const runChecks = () => {

    // ======================
    // Page basic
    // ======================
    cy.url().should('include', '/cymulate-technology-alliances-partners/')
    cy.get('main').should('be.visible')

    // ======================
    // Page height sanity
    // ======================
    cy.document().then(doc => {
      expect(doc.body.scrollHeight).to.be.greaterThan(1500)
    })

    // ======================
    // Partner cards exist (visible only)
    // ======================
    cy.get('main a:visible')
      .its('length')
      .should('be.greaterThan', 5)

    // ======================
    // Visible images loaded
    // ======================
    cy.get('main img:visible').each(($img) => {
      cy.wrap($img).should(($el) => {
        // naturalWidth > 0 = image loaded
        expect($el[0].naturalWidth).to.be.greaterThan(0)
      })
    })

    // ======================
    // Internal links health
    // ======================
    cy.get('main a[href]').each(($el) => {

      const url = $el.prop('href')

      if (
        url &&
        url.startsWith('https://cymulate.com') &&
        !url.includes('#') &&
        !url.includes('mailto:') &&
        !url.includes('tel:')
      ) {
        cy.request({
          url,
          failOnStatusCode: false,
          timeout: 60000
        }).then(res => {
          expect(res.status).to.not.eq(404)
        })
      }

    })

  }

  // ======================
  // Viewports
  // ======================
  const viewports = [
    [1280, 720], // desktop
    [768, 900],  // tablet
    [414, 900]   // mobile
  ]

  viewports.forEach(([w, h]) => {

    it(`Partners page works at ${w}px`, () => {

      cy.viewport(w, h)

      cy.visit('https://cymulate.com/cymulate-technology-alliances-partners/', {
        failOnStatusCode: false
      })

      acceptCookies()

      // scroll to trigger lazy images
      cy.scrollTo('bottom', { duration: 1000 })
      cy.scrollTo('top', { duration: 300 })

      runChecks()

    })

  })

})