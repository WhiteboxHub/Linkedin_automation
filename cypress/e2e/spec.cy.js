describe("LinkedIn Job Application Form", () => {
  it("passes", () => {
    cy.session("login", () => {
      // Typing username and password
      cy.visit("https://www.linkedin.com/login");
      cy.get("#username").type("Enter email");
      cy.get("#password").type("Enter Password {Enter}").wait(5000);
      // Waiting for login
      cy.wait(5000);
    });
    // Visiting LinkedIn homepage
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

    function easyApply() {
      cy.wait(3000);

      // Clicking on "Easy Apply" in navigation bar
      cy.contains("Easy Apply").first().click();
      cy.wait(3000);

      // Handling easy apply process "RIGHT SIDE"
      cy.wait(5000);
      cy.get(".jobs-apply-button--top-card").first().click();
      cy.wait(5000);
      cy.get(".artdeco-text-input--input")
        .click()
        .clear()
        .type("9876543210")
        .wait(5000);
      cy.get(".artdeco-button--primary").first().click();
      cy.wait(6000);
      cy.get(
        ".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view"
      )
        .first()
        .click();

      cy.get(".artdeco-text-input--label").first();

      cy.find("input").click().type("3");

      cy.wait(3000);

      cy.get('input[aria-required="true"]').click();

      cy.wait(3000);

      cy.contains("Review").click();

      cy.get(".jobs-easy-apply-modal__content").scrollTo("bottom");
      cy.wait(5000);
      cy.contains("Submit").click();
      cy.wait(5000);
      cy.get(".artdeco-modal__dismiss").click();
      cy.wait(4000);
      cy.get(".job-card-container__action").first().click();
    }
    easyApply();
  });
});
