describe("LinkedIn Job Application Form", () => {
  before(() => {
    cy.session("login", () => {
      cy.visit("https://www.linkedin.com/login");
      cy.get("#username").type("Enter email");
      cy.get("#password").type("Enter Password {enter}");
      cy.wait(5000);
    });
  });

  it("applies for a job using Easy Apply", () => {
    cy.visit("https://www.linkedin.com");
    cy.wait(3000);

    // Initiating job search
    cy.get(".global-nav__primary-items > :nth-child(2) > .app-aware-link > .t-12")
      .click();
    cy.get(".search-global-typeahead__collapsed-search-button-text")
      .click()
      .wait(3000)
      .type("frontend developer {enter}");
    cy.wait(5000);
    cy.get(".msg-overlay-bubble-header__details").click();
    cy.wait(3000);

    // Applying filters
    cy.get(".search-reusables__filter-list > :nth-child(1) > .artdeco-pill")
      .click();
    cy.wait(3000);

    // Clicking on "Easy Apply"
    cy.contains("Easy Apply").first().click();
    cy.wait(5000);

    // Start the Easy Apply process
    cy.get(".jobs-apply-button--top-card").first().click();
    cy.wait(5000);

    cy.get("body").then(($body) => {
      if ($body.find(".artdeco-text-input--input").length > 0) {
        cy.get(".artdeco-text-input--input")
          .first()
          .click()
          .clear()
          .type("9876543210")
          .wait(5000);
      } else {
        cy.get(".artdeco-text-input--input").eq(2).click().wait(5000);
      }
    });

    cy.get(".artdeco-button--primary").first().scrollIntoView().click();
    cy.wait(3000);
    cy.get(".artdeco-button--primary").first().click();
    cy.wait(3000);

    // Define the recursive function to process the form
    function processForm() {
      // Input field interaction with retries
      cy.get('body').then(($body) => {
        if ($body.find(".artdeco-text-input--input").length > 0) {
          cy.get(".artdeco-text-input--input", { timeout: 10000 }).each(($input) => {
            cy.wrap($input).clear().type("4");
          });
          cy.wait(3000);
        }
      });

      // Check and interact with radio buttons
      cy.get('body').then(($body) => {
        if ($body.find('label[data-test-text-selectable-option__label]').length > 0) {
          cy.get("label[data-test-text-selectable-option__label]", { timeout: 10000 }).each(($label) => {
            const labelText = $label.text().toLowerCase();
            const forValue = $label.attr("for");
            const escapedForValue = Cypress.$.escapeSelector(forValue); // Escape special characters in ID

            cy.get(`#${escapedForValue}`).then(($input) => {
              if ($input.is(':checked')) {
                // If already checked, uncheck it
                $input.click({ force: true }); // Uncheck
              }

              if (labelText.includes("disability")) {
                // Click "no" option
                cy.get(`#${escapedForValue}[value="no"]`).check({ force: true });
              } else {
                // Click "yes" option
                cy.get(`#${escapedForValue}[value="yes"]`).check({ force: true });
              }
            });
          });
        }
      });

      // Check if dropdown exists and handle it
      cy.get('body').then(($body) => {
        if ($body.find('[data-test-text-selectable-option="0"] > .t-14').length > 0) {
          cy.get('[data-test-text-selectable-option="0"] > .t-14', { timeout: 10000 }).click();
          cy.get("select[data-test-text-entity-list-form-select]", { timeout: 10000 }).each(($select) => {
            const isDisabilityQuestion = $select.text().includes("disability");
            if (isDisabilityQuestion) {
              cy.wrap($select).select("No"); // Select "No" for disability question
            } else {
              cy.wrap($select).select("Yes"); // Select "Yes" for non-disability question
            }
          });
        }
      });

      // Check for "Review" or "Next" button and proceed accordingly
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Review"), button:contains("Next")').length > 0) {
          cy.get('button:contains("Review"), button:contains("Next")', { timeout: 10000 }).click();
        } else {
          // If not found, call processForm recursively
          cy.wait(1000); // Wait a bit before retrying
          processForm();
        }
      });
    }

    // Function to click the cross mark after submitting the application
    function clickCrossMark() {
      cy.get(".artdeco-modal__dismiss").click({ force: true });
    }

    // Call the recursive function to process the form
    processForm();
    cy.wait(3000); // Wait for the form processing to complete
    clickCrossMark(); // Click the cross mark to dismiss modal
  });
});
