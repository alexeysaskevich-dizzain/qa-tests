****# QA Tests Repository

This repository contains automated and manual QA tests for web projects.  
It includes two separate testing stacks:

- Playwright — visual regression & automated checks  
   Cypress — interactive/manual test runs  

---

# Requirements

Make sure you have installed:

- Node.js (v18+ recommended)
- npm
- Git

Check versions:

```bash
node -v
npm -v

# Getting Started

Clone the repository:

git clone https://github.com/alexeysaskevich-dizzain/qa-tests.git
cd qa-tests

# Running Playwright Tests

Playwright is used mainly for:

-visual regression
-automated page checks

Example (Cymulate DEV)
cd Playwright/cymulate-DEV-wp-regression-tests
npm install
npx playwright test

Update snapshots (baseline)
npx playwright test --update-snapshots

View HTML report
npx playwright show-report

# Running Cypress Tests (Interactive)

Cypress is used for:

- manual test runs
- debugging
- exploratory QA

Start Cypress UI
cd Cypress/cypress-tests
npm install
npx cypress open


- This opens the Cypress Test Runner
- Select any test and run it manually

# Notes

Tests are designed to run locally

No CI/CD is configured intentionally

Node modules are ignored in Git

# Typical Workflow
Playwright regression

Pull latest changes

Install dependencies

Run tests

Review report

Cypress testing

Open Cypress UI

Run needed spec

Debug if needed

# Troubleshooting
If tests fail after pulling

Run:

npm install


inside the test folder you are using.

If Playwright browsers missing
npx playwright install
****
