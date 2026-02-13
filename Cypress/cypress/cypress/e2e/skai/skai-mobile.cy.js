describe('Skai Website — Mobile Regression (375px)', () => {

  /**
   * Accept cookies banner if present
   */
  const acceptCookies = () => {
    cy.get('body').then(($body) => {
      if ($body.find('button.brlbs-btn-accept-all').length > 0) {
        cy.get('button.brlbs-btn-accept-all', { timeout: 10000 })
          .scrollIntoView()
          .click({ force: true });
      }
    });
  };

  /**
   * Mobile viewport
   */
  beforeEach(() => {
    cy.viewport(375, 812);
  });

  /**
   * Ignore known third-party frontend errors
   */
  Cypress.on('uncaught:exception', (err) => {
    if (
      err.message.includes('Script error') ||
      err.message.includes('ResizeObserver') ||
      err.message.includes('Vimeo') ||
      err.message.includes('player element')
    ) {
      return false;
    }
    return true;
  });

  // --------------------------------------------------
  // ALL REAL INTERNAL SKAI.IO LINKS
  // --------------------------------------------------

  const skaiInternalUrls = [
    'https://skai.io/',
    'https://skai.io/artificial-intelligence/',
    'https://skai.io/blog/',
    'https://skai.io/case-studies/',
    'https://skai.io/company/',
    'https://skai.io/company/careers/',
    'https://skai.io/company/partners/',
    'https://skai.io/contact-us/',
    'https://skai.io/content-optimization/',
    'https://skai.io/cookies-policy/',
    'https://skai.io/data-centralization/',
    'https://skai.io/de/',
    'https://skai.io/digital-shelf-optimization/',
    'https://skai.io/do-not-sell-or-share-my-personal-information/',
    'https://skai.io/events/',
    'https://skai.io/expert-services/',
    'https://skai.io/fr/',
    'https://skai.io/glossary/',
    'https://skai.io/newsroom/',
    'https://skai.io/omnichannel-marketing-platform/',
    'https://skai.io/omnichannel-media-planning/',
    'https://skai.io/our-values/',
    'https://skai.io/partners/',
    'https://skai.io/pricing/',
    'https://skai.io/privacy-policy/',
    'https://skai.io/quarterly-trends-hub/',
    'https://skai.io/recruitment-privacy-policy/',
    'https://skai.io/reports-and-whitepapers/',
    'https://skai.io/retail-insights/',
    'https://skai.io/retail-media-solutions/',
    'https://skai.io/retail-media-thursdays/',
    'https://skai.io/revenue-recovery/',
    'https://skai.io/search/',
    'https://skai.io/skai-labs/',
    'https://skai.io/skai-research-center/',
    'https://skai.io/social/',
    'https://skai.io/ticketing-automation/',
    'https://skai.io/training-and-certification/'
  ];

  // --------------------------------------------------
  // TEST EXECUTION
  // --------------------------------------------------

  skaiInternalUrls.forEach((url) => {
    describe(`Mobile page: ${url}`, () => {
      it('loads correctly on mobile viewport', () => {
        cy.visit(url, { failOnStatusCode: false });

        acceptCookies();

        // Redirect-safe check
        cy.location('hostname').should('eq', 'skai.io');

        // On mobile we validate only main content
        cy.get('main', { timeout: 10000 }).should('be.visible');
      });
    });
  });

});