describe('Cymulate vs Competitors — Links Health Check', () => {

  function acceptCookiesIfPresent() {
    cy.get('body').then(($body) => {
      if ($body.find('#onetrust-accept-btn-handler').length > 0) {
        cy.get('#onetrust-accept-btn-handler').click({ force: true })
      }
    })
  }

  it('Checks all content links without failing', () => {

    cy.viewport(1280, 800)

    cy.visit('https://cymulate.com/cymulate-vs-competitors/', {
      failOnStatusCode: false
    })

    acceptCookiesIfPresent()

    const brokenLinks = []

    cy.get('main a[href]').each(($link) => {

      const url = $link.prop('href')

      if (
        !url ||
        url.startsWith('mailto:') ||
        url.startsWith('tel:') ||
        url.includes('#')
      ) {
        return
      }

      cy.log(`Checking: ${url}`)

      cy.request({
        url,
        failOnStatusCode: false,
        timeout: 60000
      })
      .then((resp) => {

        if (resp.status >= 400) {
          brokenLinks.push(`${url} (${resp.status})`)
        }

      })

    })

    cy.then(() => {
      if (brokenLinks.length > 0) {
        cy.log('❌ Broken links found:')
        brokenLinks.forEach(link => cy.log(link))
      } else {
        cy.log('✅ No broken links')
      }
    })

  })

})