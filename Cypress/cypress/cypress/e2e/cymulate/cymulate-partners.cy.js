describe('Partners page regression', () => {

  const acceptCookies = () => {
    cy.get('body').then(($body) => {
      if ($body.find('#onetrust-accept-btn-handler').length) {
        cy.get('#onetrust-accept-btn-handler').click({ force: true })
      }
    })
  }

  const runChecks = () => {

    // Page basic
    cy.url().should('include', '/cymulate-technology-alliances-partners/')
    cy.get('main').should('be.visible')

    // Page height sanity
    cy.document().then(doc => {
      expect(doc.body.scrollHeight).to.be.greaterThan(1500)
    })

    // Partner cards exist
    cy.get('main a').filter(':visible').its('length').should('be.greaterThan', 5)

    // Images loaded (no broken)
    cy.get('main img').each(($img) => {
      cy.wrap($img)
        .should('be.visible')
        .and(($el) => {
          expect($el[0].naturalWidth).to.be.greaterThan(0)
        })
    })

    // Internal links health check
    cy.get('main a[href]').each(($el) => {
      const url = $el.prop('href')

      if (url && url.startsWith('https://cymulate.com') && !url.includes('#')) {
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

  const viewports = [
    [1280, 720],
    [768, 900],
    [414, 900]
  ]

  viewports.forEach(([w, h]) => {
    it(`Partners page works at ${w}px`, () => {
      cy.viewport(w, h)

      cy.visit('https://cymulate.com/cymulate-technology-alliances-partners/', {
        failOnStatusCode: false
      })

      acceptCookies()
      runChecks()
    })
  })

})