describe("LinkedIn Job Application Form", () => { // Describing the test suite for LinkedIn job application form
  it("passes", () => { // Describing the test case
    cy.session("login", () => { // Creating a login session
      cy.visit("https://www.linkedin.com/login"); // Visiting LinkedIn login page
      cy.get("#username").type("srikanthprabha62@gmail.com"); // Typing username
      cy.get("#password").type("Rajan@91 {Enter}").wait(5000); // Typing password and submitting
    });
    cy.wait(5000); // Waiting for 5 seconds
    cy.visit("https://www.linkedin.com"); // Visiting LinkedIn homepage
    cy.wait(10000); // Waiting for 10 seconds

    // Clicking on the search bar to initiate job search
    cy.get(".global-nav__primary-items > :nth-child(2) > .app-aware-link > .t-12").click();
    cy.get(".search-global-typeahead__collapsed-search-button-text") // Selecting the search bar
      .click() // Clicking on the search bar
      .wait(6000) // Waiting for 6 seconds
      .type("frontend developer {Enter}"); // Typing job title and pressing Enter
    cy.wait(5000); // Waiting for 5 seconds
    cy.get(".msg-overlay-bubble-header__details").click(); // Clicking to close any overlay bubble
    cy.wait(5000); // Waiting for 5 seconds

    // Applying filters to find jobs
    cy.get(".search-reusables__filter-list > :nth-child(1) > .artdeco-pill").click(); // Clicking on the Easy Apply filter
    cy.wait(6000); // Waiting for 6 seconds

    // Clicking on the "Easy Apply" button of the first job
    cy.contains("Easy Apply").first().click();
    cy.wait(5000); // Waiting for 5 seconds

    // Function to handle the easy apply process
    function easyApply() {
      cy.wait(5000); // Waiting for 5 seconds
      cy.get(".jobs-apply-button--top-card").first().click(); // Clicking on the apply button
      cy.wait(5000); // Waiting for 5 seconds

      cy.get(".artdeco-text-input--input") // Selecting the input field for phone number
        .click() // Clicking on the input field
        .clear() // Clearing any existing value
        .type("9876543210") // Typing the phone number
        .wait(5000); // Waiting for 5 seconds
      cy.get(".artdeco-button--primary") // Selecting the 'Next' button
        .first() // Selecting the first 'Next' button
        .click(); // Clicking on the 'Next' button
      cy.wait(6000); // Waiting for 6 seconds

      cy.get( // Selecting the 'Submit' button
        ".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view",
        { timeout: 10000 } // Setting a timeout for selection
      )
        .first() // Selecting the first occurrence
        .click(); // Clicking on the 'Submit' button

      // Reading questions from a JSON file and filling them
      cy.fixture('questions.json').then((data) => {
        const allQuestions = data.questions; // Extracting all questions from the JSON data

        // Function to fill a single question
        const fillQuestion = (item) => {
          return cy.contains(new RegExp(item.question, "i"), { timeout: 10000 }).then($question => {
            if ($question.length > 0) {
              return cy.wrap($question)
                .parent()
                .find('input, select, [role="radiogroup"]')
                .then($input => {
                  if ($input.is('input') && !$input.val()) {
                    cy.wrap($input).should('be.visible').clear().type(item.answer); // Filling input type question
                  } else if ($input.is('select') && !$input.val()) {
                    cy.wrap($input).should('be.visible').select(item.answer); // Filling select type question
                  } else if ($input.attr('role') === 'radiogroup' && !$input.find('input:checked').length) {
                    cy.wrap($input).should('be.visible').contains(item.answer).click(); // Filling radio type question
                  }
                }).then(() => true);
            }
            return false;
          });
        };

        // Function to chain fill questions recursively
        const chainFillQuestions = (questions) => {
          if (questions.length === 0) {
            return cy.wrap(null); // Return a resolved promise if no questions remain
          }
          const [first, ...rest] = questions;
          return fillQuestion(first).then((filled) => {
            return chainFillQuestions(rest); // Recursively fill remaining questions
          });
        };

        // Check if any question from JSON file is present in additional questions in LinkedIn application
        cy.get('.jobs-easy-apply-form__additional-questions').then($additionalQuestions => {
          const additionalQuestionTexts = $additionalQuestions.find('.jobs-easy-apply-form__question').map((index, element) => Cypress.$(element).text()).get();
          const matchingQuestions = allQuestions.filter(question => additionalQuestionTexts.includes(question.question));
          
          if (matchingQuestions.length > 0) {
            chainFillQuestions(matchingQuestions).then(() => {
              // Handle Review or Next button click
              cy.contains('button', 'Review', { timeout: 10000 }).then($reviewButton => {
                if ($reviewButton.length > 0) {
                  cy.wrap($reviewButton).click(); // Clicking on 'Review' button if present
                } else {
                  cy.contains('button', 'Next', { timeout: 10000 }).then($nextButton => {
                    if ($nextButton.length > 0) {
                      cy.wrap($nextButton).click(); // Clicking on 'Next' button if 'Review' button is not present
                    }
                  });
                }
              });
            });
          } else {
            // If no matching questions found, wait for 20 seconds
            cy.wait(20000); // Waiting for 20 seconds
          }
        });
      });
    }
    easyApply(); // Calling the easy apply function
  });
});
