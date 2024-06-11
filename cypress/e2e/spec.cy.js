describe("LinkedIn Job Application Form", () => {
  before(() => {
    cy.session("login", () => {
      cy.visit("https://www.linkedin.com/login");
      cy.get("#username").type("Enter email@gmail.com");
      cy.get("#password").type("Enter Password {Enter}");
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
        cy.get(".artdeco-text-input--input").first().click().wait(5000);
      } else {
        cy.get(".artdeco-text-input--input").eq(2).click().wait(5000);
      }
    });

    cy.get(".artdeco-button--primary").first().scrollIntoView().click();
    cy.wait(6000);
    cy.get(".artdeco-button--primary").first().click();


    


// Click the "Yes" radio button directly
// cy.get('[data-test-text-selectable-option="0"] > .t-14')
//   .click();

cy.get('select[data-test-text-entity-list-form-select]').then(selectElement => {
  const isDisabilityQuestion = selectElement.text().includes("disability");

  if (isDisabilityQuestion) {
      cy.get('[data-test-text-selectable-option="1"] > .t-14').click(); // Click option 1 for disability question
  } else {
      cy.get('[data-test-text-selectable-option="0"] > .t-14').click(); // Click option 0 for non-disability question
  }
});




  // dropdown
cy.get('select[data-test-text-entity-list-form-select]').then(selectElement => {
  const isDisabilityQuestion = selectElement.text().includes("disability");

  if (isDisabilityQuestion) {
      cy.wrap(selectElement).select("No"); // Select "No" for disability question
  } else {
      cy.wrap(selectElement).select("Yes"); // Select "Yes" for non-disability question
  }
});

// input fi
cy.get(".artdeco-text-input--input").each(($input) => {
  cy.wrap($input).clear().type("4");
});

  
  
  
 
  

    cy.wait(5000);

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

















