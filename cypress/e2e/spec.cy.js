describe("LinkedIn Job Application Form", () => {
  before(() => {
    cy.session("login", () => {
      cy.visit("https://www.linkedin.com/login");
      cy.get("#username").type("enter email");
      cy.get("#password").type("enter password {Enter}");
      cy.wait(5000);
    });
  });

  it("applies for a job using Easy Apply", () => {
    cy.visit("https://www.linkedin.com");
    cy.wait(3000);

    // Initiating job search
    cy.get(
      ".global-nav__primary-items > :nth-child(2) > .app-aware-link > .t-12"
    ).click();
    cy.get(".search-global-typeahead__collapsed-search-button-text")
      .click()
      .wait(3000)
      .type("frontend developer {enter}");
    cy.wait(5000);
    cy.get(".msg-overlay-bubble-header__details").click();
    cy.wait(3000);

    // Applying filters
    cy.get(
      ".search-reusables__filter-list > :nth-child(1) > .artdeco-pill"
    ).click();
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

    // radio button
    // cy.get('label[data-test-text-selectable-option__label="Yes"]').each(($label) => {
    //   const forValue = $label.attr('for');
    //   const escapedForValue = Cypress.$.escapeSelector(forValue); // Escape special characters in ID
    //   cy.get(`#${escapedForValue}`).click({ force: true });
    // });

    // Check and interact with radio buttons
    cy.get("label[data-test-text-selectable-option__label]").each(($label) => {
      const labelText = $label.text().toLowerCase();
      const forValue = $label.attr("for");
      const escapedForValue = Cypress.$.escapeSelector(forValue); // Escape special characters in ID

      if (labelText.includes("disability")) {
        cy.get(`#${escapedForValue}[value="no"]`).click({ force: true });
      } else {
        cy.get(`#${escapedForValue}[value="yes"]`).click({ force: true });
      }
    });

    // Input field interaction
    cy.get(".artdeco-text-input--input").each(($input) => {
      cy.wrap($input).clear().type("4");
    });

    // Check if dropdown exists and handle it
    cy.get('[data-test-text-selectable-option="0"] > .t-14').then(
      (dropdown) => {
        if (dropdown.length === 1) {
          dropdown.click(); // Click on dropdown option
          cy.get("select[data-test-text-entity-list-form-select]").each(
            ($select) => {
              const isDisabilityQuestion = $select
                .text()
                .includes("disability");
              if (isDisabilityQuestion) {
                cy.wrap($select).select("No"); // Select "No" for disability question
              } else {
                cy.wrap($select).select("Yes"); // Select "Yes" for non-disability question
              }
            }
          );
        }
      }
    );

    // Assertion to verify selections
    cy.get('label[data-test-text-selectable-option__label="Yes"]').should(
      "be.visible"
    );
    cy.get("select[data-test-text-entity-list-form-select]").should(
      "be.visible"
    );
    cy.get(".artdeco-text-input--input").should("have.value", "4");

    cy.wait(20000);

    cy.get('button:contains("Review"), button:contains("Next")')
      .first()
      .click()
      .then(() => {
        cy.get(".jobs-easy-apply-modal__content").scrollTo("bottom");
        cy.wait(5000);
        cy.contains("Submit").click();
        cy.wait(5000);
        cy.get(".artdeco-modal__dismiss").click();
        cy.wait(4000);
        cy.get(".job-card-container__action").first().click();
      });
  });
});
