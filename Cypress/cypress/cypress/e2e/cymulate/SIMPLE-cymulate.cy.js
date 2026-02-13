describe('Cymulate Website Tests', () => {
  // Function to accept cookies
  const acceptCookies = () => {
    cy.get('button#onetrust-accept-btn-handler', { timeout: 10000 })  // Increased timeout to 10 seconds
      .should('be.visible')  // Ensure the button is visible
      .scrollIntoView()  // Scroll to the button if it's not visible
      .click();  // Click the "Accept" button to close the banner
  };

  // Basic setup before each test
  beforeEach(() => {
    cy.viewport(1280, 720);  // Set the viewport to desktop dimensions
  });

  // Handling uncaught exceptions, including cross-origin and Vimeo player errors
  Cypress.on('uncaught:exception', (err) => {
    // Ignore the error related to Vimeo player
    if (err.message.includes('The player element passed isn’t a Vimeo embed')) {
      cy.log('Caught Vimeo player error');
      return false;  // Do not fail the test
    }

    // Ignore other "Script error" (cross-origin) errors
    if (err.message.includes('Script error.')) {
      cy.log('Caught cross-origin script error');
      return false;  // Do not fail the test
    }

    // For any other errors, let Cypress fail the test
    return true;
  });

  // General tests for the Cymulate website
  describe('General Cymulate Website Tests', () => {
    it('should visit the homepage and verify the URL and title', () => {
      cy.visit('https://cymulate.com');
      acceptCookies();  // Accept cookies

      cy.url().should('include', 'cymulate.com');  // Check that the URL includes "cymulate.com"
      cy.title().should('include', 'Cymulate');  // Check that the page title includes "Cymulate"
      cy.get('.header').should('be.visible');  // Ensure the header is visible
    });

    // List of URLs to test for general pages
    const urls = [
      'https://cymulate.com/',
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

    // General checks for all URLs
    urls.forEach((url) => {
      describe(`Testing URL: ${url}`, () => {
        it(`should load ${url} successfully`, () => {
          cy.visit(url);
          acceptCookies();  // Accept cookies

          cy.url().should('eq', url);  // Ensure the URL matches the expected one
        });
      });
    });
  });
});