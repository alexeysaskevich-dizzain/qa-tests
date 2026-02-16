// Ignore known non-critical JS errors
Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('Vimeo') ||
    err.message.includes('Script error') ||
    err.message.includes('player element')
  ) {
    return false
  }
  return true
})

describe('Cymulate vs Competitors — Regression', () => {
  const BASE_URL = 'https://cymulate.com/cymulate-vs-competitors/'

  const acceptCookiesIfPresent = () => {
    cy.get('body').then(($body) => {
      if ($body.find('#onetrust-accept-btn-handler').length > 0) {
        cy.get('#onetrust-accept-btn-handler').click({ force: true })
      }
    })
  }

  const triggerLazyLoad = () => {
    // Trigger lazy-loaded assets by scrolling the page
    cy.scrollTo('bottom', { duration: 800 })
    cy.wait(600)
    cy.scrollTo('top', { duration: 400 })
    cy.wait(300)
  }

  const checkImagesLoadedInActiveTab = (activeContentSelector) => {
    // Only check images that actually have a source assigned
    cy.get(activeContentSelector)
      .find('img')
      .then(($imgs) => {
        const withSrc = [...$imgs].filter((img) => {
          const src = img.getAttribute('src') || ''
          const dataSrc = img.getAttribute('data-src') || ''
          const currentSrc = img.currentSrc || ''
          return Boolean(currentSrc || src || dataSrc)
        })

        if (withSrc.length === 0) {
          cy.log('No images with src/currentSrc found in active tab — skipping image checks')
          return
        }

        cy.wrap(withSrc).each((imgEl) => {
          // Scroll each image into view to trigger its lazy loading
          cy.wrap(imgEl)
            .scrollIntoView({ easing: 'linear', duration: 200 })
            .should(($img) => {
              // Cypress retries this assertion until it passes or times out
              expect($img[0].naturalWidth, 'naturalWidth').to.be.greaterThan(0)
            })
        })
      })
  }

  const checkInternalLinksInActiveTab = (activeContentSelector) => {
    cy.get(activeContentSelector)
      .find('a[href]')
      .each(($link) => {
        const url = $link.prop('href')

        if (
          !url ||
          url.startsWith('mailto:') ||
          url.startsWith('tel:') ||
          url.includes('#')
        ) {
          return
        }

        // If you ONLY want internal checks, uncomment this:
        // if (!url.startsWith('https://cymulate.com')) return

        cy.request({
          url,
          failOnStatusCode: false,
          timeout: 60000
        }).then((resp) => {
          expect(resp.status).to.not.eq(404)
        })
      })
  }

  const runChecks = () => {
    // Basic page sanity
    cy.url().should('include', '/cymulate-vs-competitors/')
    cy.get('main').should('be.visible')
    cy.get('h1').should('be.visible')

    // Page height sanity (detect blank page regression)
    cy.document().then((doc) => {
      expect(doc.body.scrollHeight).to.be.greaterThan(1500)
    })

    // Tabs exist
    cy.get('.kt-tabs-title-list [role="tab"]')
      .should('have.length.greaterThan', 1)

    // Iterate through tabs
    cy.get('.kt-tabs-title-list [role="tab"]').each(($tab) => {
      cy.wrap($tab)
        .scrollIntoView()
        .click({ force: true })

      cy.wrap($tab)
        .should('have.attr', 'aria-selected', 'true')

      // Wait a bit for the tab content switch
      cy.wait(400)

      const activeContent = '.kt-tabs-content-wrap .kt-tab-inner-content:visible'

      // Active panel visible
      cy.get(activeContent).should('be.visible')

      // Trigger lazy loading for assets inside the tab
      triggerLazyLoad()

      // Images loaded (only those with src/currentSrc/data-src)
      checkImagesLoadedInActiveTab(activeContent)

      // Internal links health check inside active tab
      checkInternalLinksInActiveTab(activeContent)
    })
  }

  const viewports = [
    [1280, 800],
    [768, 900],
    [414, 900]
  ]

  viewports.forEach(([w, h]) => {
    it(`Works correctly at ${w}px`, () => {
      cy.viewport(w, h)

      cy.visit(BASE_URL, {
        failOnStatusCode: false
      })

      acceptCookiesIfPresent()
      runChecks()
    })
  })
})