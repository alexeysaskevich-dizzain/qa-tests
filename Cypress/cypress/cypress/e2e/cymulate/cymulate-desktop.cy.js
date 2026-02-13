describe('Cymulate Website Tests', () => {

  // ==============================
  // Cookie handling
  // ==============================
  const acceptCookies = () => {
    cy.get('button#onetrust-accept-btn-handler', { timeout: 10000 })
      .should('be.visible')
      .scrollIntoView()
      .click();
  };

  // ==============================
  // Link filters
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
  // Header links
  // ==============================
  const checkHeaderLinks = () => {
    cy.get('header').within(() => {
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
  // Footer links
  // ==============================
  const checkFooterLinks = () => {
    cy.get('footer').within(() => {
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
  // Page content links (MAIN ONLY)
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
  // Viewport
  // ==============================
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  // ==============================
  // Ignore known JS issues
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
  describe('General Cymulate Website Tests', () => {

    it('Homepage – full link validation', () => {
      cy.visit('https://cymulate.com');
      acceptCookies();

      cy.url().should('include', 'cymulate.com');
      cy.title().should('include', 'Cymulate');

      // Global components
      checkHeaderLinks();
      checkFooterLinks();

      // Homepage content
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
      'https://cymulate.com/awards/',
      'https://cymulate.com/contact-us/',
      'https://cymulate.com/resources/',
      'https://cymulate.com/threat-exposure-validation-impact-report/',
      'https://cymulate.com/mitre-attack/',
      'https://cymulate.com/blog/',
      'https://cymulate.com/news/',
      'https://cymulate.com/events/',
      'https://cymulate.com/ctem-portal/',
      'https://cymulate.com/cymulate-vs-competitors/',
      'https://cymulate.com/cymulate-vs-competitors/attackiq/',
      'https://cymulate.com/cymulate-vs-competitors/mandiant-security-validation/',
      'https://cymulate.com/cymulate-vs-competitors/netspi/',
      'https://cymulate.com/cymulate-vs-competitors/pentera/',
      'https://cymulate.com/cymulate-vs-competitors/picus-security/',
      'https://cymulate.com/cymulate-vs-competitors/safebreach/',
      'https://cymulate.com/cymulate-vs-competitors/scythe/'
    ];

    urls.forEach((url) => {
      it(`Page link health check: ${url}`, () => {
        cy.visit(url);
        acceptCookies();

        cy.url().should('eq', url);

        // ONLY page-specific links
        checkPageLinks();
      });
    });

  });

});