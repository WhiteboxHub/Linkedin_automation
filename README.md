
# Cypress Test for LinkedIn Easy Apply Functionality

This repository contains Cypress tests for automating the process of applying to jobs on LinkedIn using the Easy Apply feature.

## Prerequisites

Before running the tests, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Cypress

## Installation

1. Clone this repository to your local machine:

```
git clone https://github.com/your_username/linkedin-easy-apply.git
```

2. Navigate to the project directory:

```
cd linkedin-easy-apply
```

3. Install dependencies:

```
npm install
```

## Running Tests

To run the Cypress tests, execute the following command in your terminal:

```
npx cypress open
```

This will open the Cypress Test Runner. Click on the `template.spec.js` file to run the test.

## Test Description

The `template.spec.js` file contains a Cypress test script written in JavaScript. This script automates the process of logging into LinkedIn, searching for a job, applying for it using the Easy Apply feature, and submitting the application.

The test consists of the following steps:

1. Logging into LinkedIn.
2. Navigating to the job search page.
3. Entering the job title and initiating the search.
4. Selecting the Easy Apply filter.
5. Applying to the first job listed.
6. Filling out the necessary application details.
7. Reviewing and submitting the application.

## Customization

You can customize the test script by modifying the following:

- LinkedIn login credentials (`#username` and `#password`).
- Job search query (`"frontend developer"`).
- Phone number (`"9876543210"`).

## Note

- This test script assumes a stable internet connection and may require adjustments depending on the network speed.
- Ensure that you have a valid LinkedIn account and that you are not violating LinkedIn's terms of service by using automated testing.

