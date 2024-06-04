describe("LinkedIn Job Application Form", () => {
  it("passes", () => {
    cy.session("login", () => {
      // Typing username and password
      cy.visit("https://www.linkedin.com/login");
      cy.get("#username").type("Enter email");
      cy.get("#password").type("password").type("{enter}");

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
    cy.wait(3000);

    // Clicking on "Easy Apply" in navigation bar
    cy.contains("Easy Apply").first().click();
    cy.wait(3000);

    // cy.get('.jobs-search-results__list > li:first-child .jobs-apply-button--top-card').then(($button) => {
    //   if ($button.hasClass('jobs-apply-button--applied')) {
    //     // If the button has already been clicked, click on the next job application
    //     cy.contains('.jobs-search-results__list > li', 'Easy Apply').eq(1).click();
    //   } else {
    //     // If the button has not been clicked, click on the first job application
    //     $button.click();
    //   }
    // });



   
    // Function to handle clicking on job applications until one without "Applied" is found
    const applyJobs = () => {
      cy.get(
        ".job-card-container__footer-item.job-card-container__footer-job-state"
      )
        .contains("Applied")
        .then(($appliedJob) => {
          if ($appliedJob.length > 0) {
            cy.get(".display-flex.job-card-container.relative.job-card-list")
              .eq(1)
              .click();
            applyJobs();
          } else {
            // No job application contains "Applied"
            cy.log("All job applications applied");
          }
        });
    };

    // Clicking on the first job application
    cy.get(
      ".job-card-container__footer-item.job-card-container__footer-job-state"
    )
      .contains("Applied")
      .then(($appliedJob) => {
        if ($appliedJob.length > 0) {
          // If the first job application contains "Applied", click on the second job application
          cy.get(".display-flex.job-card-container.relative.job-card-list")
            .eq(1)
            .click();
        } else {
          // If the first job application does not contain "Applied", click on it
          cy.get(
            ".job-card-container__footer-item.job-card-container__footer-job-state"
          )
            .first()
            .click();
        }
        // Apply for other jobs if needed
        applyJobs();
      });





    
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

    cy.get(".artdeco-text-input--label")
      .invoke("text")
      .then((text) => {
        if (text.includes("*")) {
          // If "*" is present, click on the input field and enter "3"
          cy.get(".artdeco-text-input--label").click().type("3");
        }
      });
    cy.contains("Review").click();

    cy.get(".jobs-easy-apply-modal__content").scrollTo("bottom");
    cy.wait(5000);
    cy.contains("Submit").click();
    cy.wait(5000);
  });
});
