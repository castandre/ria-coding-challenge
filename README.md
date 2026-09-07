# RIA Money Transfer — E2E Test Automation Challenge

Cypress E2E test suite for [riamoneytransfer.com](https://www.riamoneytransfer.com/), built as a QA automation take-home challenge. Covers two areas: the Ria Calculator on the homepage, and the account registration flow on the secure site.

## Tech stack

- [Cypress](https://www.cypress.io/) 16
- JavaScript

## Project structure

```
cypress/
  e2e/
    Tests/
      ria/
        homepage_calculator.cy.js   # Part 1: Ria Calculator tests
        login_page.cy.js            # Part 2: Get Started -> secure site tests
  support/
    commands.js                     # custom commands (e.g. cy.dismissCookieBanner())
coverage/
  challenge/                        # original task requirements, for reference
evidence/                           # screenshots of passing test runs
RIA_Test_Cases_Final.xlsx           # test case documentation (Part 1 and Part 2 sheets)
```

## Setup

```
npm install
```

## Running the tests

Open the Cypress Test Runner (interactive):
```
npx cypress open
```

Run all tests headlessly:
```
npx cypress run
```

Run a single spec:
```
npx cypress run --spec "cypress/e2e/Tests/ria/homepage_calculator.cy.js"
```

## Test cases

Full test case documentation (ID, title, priority, steps, expected result) is in `RIA_Test_Cases_Final.xlsx`, split into a sheet per part. Short summary:

**Part 1 — `homepage_calculator.cy.js`**
- `TC01` — Converts 25000 CLP to HTG when sending to Haiti, regardless of field order
- `TC02` — Shows a validation error for invalid Amount input (letters, symbols, negative, empty)
- `TC03` — "Send to" dropdown lists countries and updates the currency label on selection
- `TC04` — Handles numeric edge-case formats (decimal, leading zeros, comma, maximum limit)
- `TC05` — Recalculates the converted amount when the Amount field is updated

**Part 2 — `login_page.cy.js`**
- `TC01` — "Get Started" redirects to `secure.riamoneytransfer.com`
- `TC02` — Register button, email/phone field, and password field are present
- `TC03` — Clicking Register redirects to the country selection page

## Feedback to the developer

While automating `TC02`, I found that the Amount field does not implement the validation message required by the acceptance criteria.

**Expected (per the task's acceptance criteria):** typing alphabetic characters into the Amount field should show the message *"Please enter a valid amount"*.

**Actual:** the field silently blocks non-numeric keystrokes — no error message is shown at all, for letters or for any of the other invalid inputs tested (symbols, negative numbers, empty field).

`TC02` is written to assert the behavior the acceptance criteria describes, so it currently **fails** when run — that failure is the proof that the required validation message is missing. I left it failing intentionally rather than rewriting it to match the current (incomplete) behavior, since the goal of this test is to catch and report this gap, not hide it.

### Behavior observations (from exploratory testing on TC04)

These aren't bugs — just notes on how the Amount field actually behaves, found while testing numeric edge cases beyond the stated acceptance criteria:

- **Decimal rounding on blur:** typing `25000.50` keeps the decimal value while the field is focused, but once you click away (blur), the field rounds it to the nearest integer (`25001`).
- **Comma and period are allowed, unlike other special characters:** `TC02` confirmed the field blocks letters and symbols like `@#$%`, but `,` and `.` are exceptions — both can be typed directly into the field.
- **Misplaced commas get auto-corrected:** typing digits with commas in the "wrong" spots (e.g. `23,30,500`) doesn't get rejected — the field re-groups them into the correct thousands format (`2,300,500`) based on the underlying digits, ignoring where the commas were actually typed.

## Evidence

Screenshots of test runs are in `evidence/`.
