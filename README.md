Конечно 👍 Вот тот же README, но просто текстом без Markdown, чтобы ты мог вставить куда угодно (например в описание, Confluence или txt).

QA Tests Repository

This repository contains automated and manual QA tests for web projects.
It includes two separate testing stacks:

Playwright — visual regression and automated checks
Cypress — interactive and manual test runs

Repository Structure

qa-tests
Cypress
cypress-tests (Cypress project)

Playwright
cymulate-DEV-wp-regression-tests
cymulate-wp-regression-tests
skai-DEV-wp-regression-tests
skai-wp-regression-tests

Requirements

Make sure you have installed:

Node.js (version 18 or newer recommended)
npm
Git

You can check versions with:

node -v
npm -v

Getting Started

Clone the repository:

git clone https://github.com/alexeysaskevich-dizzain/qa-tests.git

cd qa-tests

Running Playwright Tests

Playwright is mainly used for visual regression and automated page checks.

Example for Cymulate DEV:

cd Playwright/cymulate-DEV-wp-regression-tests
npm install
npx playwright test

Update snapshots (baseline):

npx playwright test --update-snapshots

View HTML report:

npx playwright show-report

Running Cypress Tests (Interactive Mode)

Cypress is used for manual runs, debugging and exploratory testing.

Start Cypress UI:

cd Cypress/cypress-tests
npm install
npx cypress open

This opens the Cypress Test Runner where you can select and run any test manually.

Notes

Tests are designed to run locally.
CI/CD is intentionally not configured.
node_modules folders are ignored in Git.

Typical Workflow

Playwright regression:

Pull latest changes from Git

Install dependencies

Run tests

Review HTML report

Cypress testing:

Open Cypress UI

Run needed spec file

Debug if necessary

Troubleshooting

If tests fail after pulling the repo, run npm install inside the specific test folder you are working with.

If Playwright browsers are missing, run:

npx playwright install

Maintainers

QA Team
