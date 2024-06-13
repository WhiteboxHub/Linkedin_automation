function fillInputFields() {
  cy.get(".artdeco-text-input--input", { timeout: 10000 }).then(($inputs) => {
    if ($inputs.length > 0) {
      $inputs.each((index, input) => {
        cy.wrap(input).clear().type("4");
      });
    } else {
      cy.log("No input fields found");
      // If no input fields are found, proceed to handle radio buttons
      handleRadioButtons();
    }
  });
}

function handleRadioButtons() {
  cy.get("label[data-test-text-selectable-option__label]", {
    timeout: 10000,
  }).then(($radioButtons) => {
    if ($radioButtons.length > 0) {
      $radioButtons.each((index, radioButton) => {
        const labelText = Cypress.$(radioButton).text().toLowerCase();
        const forValue = Cypress.$(radioButton).attr("for");
        if (forValue) {
          const escapedForValue = Cypress.$.escapeSelector(forValue);
          if (labelText.includes("disability")) {
            cy.get(`#${escapedForValue}[value="no"]`).click({ force: true });
          } else {
            cy.get(`#${escapedForValue}[value="yes"]`).click({ force: true });
          }
        }
      });
    } else {
      cy.log("No radio buttons found");
    }
    // After handling radio buttons, proceed to fill dropdowns
    fillDropdowns();
  });
}

function fillDropdowns() {
  cy.get("select[data-test-text-entity-list-form-select]", {
    timeout: 10000,
  }).then(($dropdowns) => {
    if ($dropdowns.length > 0) {
      $dropdowns.each((index, dropdown) => {
        const dropdownText = Cypress.$(dropdown).text().toLowerCase();
        if (dropdownText.includes("disability")) {
          cy.wrap(dropdown).select("No");
        } else {
          cy.wrap(dropdown).select("Yes");
        }
      });
    } else {
      cy.log("No dropdowns found");
    }
    // After handling dropdowns, proceed to click the "Review" or "Next" button
    handleNextOrReviewButton();
  });
}

function handleNextOrReviewButton() {
  cy.get('button:contains("Review"), button:contains("Next")', {
    timeout: 10000,
  }).then(($buttons) => {
    if ($buttons.length > 0) {
      cy.wrap($buttons.first()).click({ force: true });
    } else {
      cy.log("No 'Review' or 'Next' button found");
      // Optionally, you can call processForm() again if you want to retry the whole process
      cy.wait(1000);
      processForm();
    }
  });
}

describe("LinkedIn Job Application Form", () => {
  before(() => {
    cy.session("login", () => {
      cy.visit("https://www.linkedin.com/login");
      cy.get("#username").type("shivapatel001k@gmail.com");
      cy.get("#password").type("143Shivak@{Enter}");
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

    // Start the process
    fillInputFields();
    cy.wait(20000);

    // Click the "Review" or "Next" button if present
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
