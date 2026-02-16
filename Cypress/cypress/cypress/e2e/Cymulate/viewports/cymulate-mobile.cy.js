describe('Cymulate Website Tests — Mobile (375px)', () => {

  // ==============================
  // Cookie handling
  // ==============================
  const acceptCookies = () => {
    cy.get('button#onetrust-accept-btn-handler', { timeout: 10000 })
      .scrollIntoView()
      .click();
  };

  // ==============================
  // Internal link filter
  // ==============================
  const isValidInternalLink = (url) => {
    return (
      url &&
      typeof url === 'string' &&
      url.startsWith('https://cymulate.com') &&
      !url.includes('#') &&
      !url.includes('mailto:') &&
      !url.includes('tel:') &&
      !url.includes('.pdf')
    );
  };

  // ==============================
  // Page content links ONLY
  // ==============================
  const checkPageLinks = () => {
    cy.get('main').within(() => {
      cy.get('a[href]').each(($el) => {
        const url = $el.prop('href');

        if (isValidInternalLink(url)) {
          cy.request({
            url,
            failOnStatusCode: false,
          }).then((res) => {
            expect(res.status).to.not.eq(404);
          });
        }
      });
    });
  };

  // ==============================
  // Mobile viewport
  // ==============================
  beforeEach(() => {
    cy.viewport(375, 812); // iPhone X style
  });

  // ==============================
  // Ignore known frontend issues
  // ==============================
  Cypress.on('uncaught:exception', (err) => {
    if (
      err.message.includes('Vimeo') ||
      err.message.includes('Script error')
    ) {
      return false;
    }
    return true;
  });

  // ==============================
  // Tests
  // ==============================
  describe('Mobile regression tests', () => {

    it('Homepage — mobile content link validation', () => {
      cy.visit('https://cymulate.com');
      acceptCookies();

      cy.url().should('include', 'cymulate.com');
      cy.title().should('include', 'Cymulate');

      checkPageLinks();
    });

    const urls = [
      'https://cymulate.com/platform/',
      'https://cymulate.com/attack-path-discovery/',
      'https://cymulate.com/automated-mitigation/',
      'https://cymulate.com/solutions/optimize-threat-resilience/',
      'https://cymulate.com/solutions/validate-response/',
      'https://cymulate.com/solutions/exposure-management/',
      'https://cymulate.com/roles-ciso-cio/',
      'https://cymulate.com/roles-soc-manager/',
      'https://cymulate.com/red-teaming/',
      'https://cymulate.com/vulnerability-management/',
      'https://cymulate.com/cymulate-technology-alliances-partners/',
      'https://cymulate.com/about-us/',
      'https://cymulate.com/cymulate-vs-competitors/',
      'https://cymulate.com/awards/',
      'https://cymulate.com/contact-us/',
      'https://cymulate.com/resources/',
      'https://cymulate.com/threat-exposure-validation-impact-report/',
      'https://cymulate.com/mitre-attack/',
      'https://cymulate.com/blog/',
      'https://cymulate.com/news/',
      'https://cymulate.com/events/',
      'https://cymulate.com/ctem-portal/'
    ];

    urls.forEach((url) => {
      it(`Mobile page link health check: ${url}`, () => {
        cy.visit(url);
        acceptCookies();

        cy.url().should('eq', url);

        checkPageLinks();
      });
    });

  });

});