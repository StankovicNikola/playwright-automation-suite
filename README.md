# playwright-automation-suite

End-to-end Playwright (TypeScript) test suite targeting [saucedemo.com](https://www.saucedemo.com), demonstrating Page Object Model, cross-browser parallel execution, UI and accessibility testing, and Allure reporting — with CI/CD via GitHub Actions.

## Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev/) | E2E test runner |
| TypeScript | Type-safe test authoring |
| Allure | Rich test reports with history |
| GitHub Actions | CI — runs on every push/PR |

## Project structure

```
pages/                  # Page Object Model classes
├── BasePage.ts
├── LoginPage.ts
├── InventoryPage.ts
├── CartPage.ts
└── CheckoutPage.ts
tests/
└── ui/
    ├── login.spec.ts       # Auth tests
    ├── inventory.spec.ts   # Product listing, sorting, cart
    └── checkout.spec.ts    # End-to-end checkout flow
utils/
├── auth.ts             # loginViaUi helper
├── users.ts            # Test user credentials
├── products.ts         # Product names and expected sort/price values
└── checkoutData.ts     # Checkout form data and expected order total
playwright.config.ts
```

## Getting started

```bash
npm install
npx playwright install --with-deps   # install browsers
```

### Run all tests

```bash
npm test
```

### Run by browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run by suite

```bash
npm run test:ui          # all UI tests
```

### View reports

```bash
npm run report:html      # open Playwright HTML report
npm run report:allure    # generate and open Allure report
```

## Test suites

### Login (`tests/ui/login.spec.ts`)

| Test | Description |
|------|-------------|
| standard_user logs in | Happy path — lands on `/inventory.html` |
| performance_glitch_user logs in | Verifies slow login still succeeds |
| Wrong password | Asserts error message |
| Locked out user | Asserts lock-out error |
| Missing username | Asserts "Username is required" |
| Missing password | Asserts "Password is required" |
| Logout | Redirects back to `/` |

### Inventory (`tests/ui/inventory.spec.ts`)

| Test | Description |
|------|-------------|
| Displays 6 products | Product count assertion |
| Each product has name, price, button | Per-item assertions |
| Sort A→Z | Default order check |
| Sort Z→A | Name sort descending |
| Sort price low→high | Price `$7.99` first |
| Sort price high→low | Price `$49.99` first |
| Add to cart — badge updates | Cart badge count = 1 |
| Add multiple items | Cart badge count = 2 |
| Remove from inventory page | Badge not visible |
| Navigate to cart | Cart page loads with correct item |

### Checkout (`tests/ui/checkout.spec.ts`)

| Test | Description |
|------|-------------|
| Full checkout flow | Add 2 items → cart → info form → verify `$39.98` total → complete |
| Missing first name | Error: "First Name is required" |
| Missing last name | Error: "Last Name is required" |
| Missing postal code | Error: "Postal Code is required" |
| Cancel returns to inventory | Continue Shopping button |

## Page Object Model

All pages extend `BasePage`, which wraps `page.goto()` with `waitForLoadState('networkidle')` and exposes a shared `getByTestId` locator helper. Page classes expose async methods:

```ts
await loginPage.goto()
await loginPage.login(users.standard.username, users.standard.password)
await inventoryPage.assertLoaded()
```

No selector strings or credential literals appear in test files — all locators live in page classes and all test data is imported from `utils/`.

## Utilities

### `utils/auth.ts`

`loginViaUi(page, username, password)` — navigates to `/`, fills credentials, waits for redirect to `/inventory.html`. Used in `beforeEach` blocks to set up authenticated state without repeating login logic in every test.

### `utils/users.ts`

Centralised credential object — import `users.standard`, `users.locked`, `users.glitch`, `users.problem` anywhere in the suite.

### `utils/products.ts`

Product names (`backpack`, `bikeLight`), sort expectations (`firstAZ`, `firstZA`), and boundary prices (`lowestPrice`, `highestPrice`) used across inventory and checkout tests.

### `utils/checkoutData.ts`

`checkoutData.validInfo` object containing `firstName`, `lastName`, `postalCode`, and `expectedTotal` — consumed by all checkout tests.

## Cross-browser & mobile

`playwright.config.ts` defines four projects run in parallel:

| Project | Device |
|---------|--------|
| `chromium` | Desktop Chrome |
| `firefox` | Desktop Firefox |
| `webkit` | Desktop Safari |
| `mobile-chrome` | Pixel 7 |

Set `workers: 4` in CI, `workers: 2` locally.

## Reporting

Two reporters are configured simultaneously:

- **HTML** (`playwright-report/`) — built-in Playwright report, open with `npm run report:html`
- **Allure** (`allure-results/`) — rich report with timeline, categories, and history trends; open with `npm run report:allure`

On failure, traces, screenshots, and videos are captured automatically (`trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'on-first-retry'`).

## CI/CD

GitHub Actions runs the full suite on every push to `main`/`develop` and on every pull request targeting `main`, in parallel across Chromium, Firefox, and WebKit:

```
.github/workflows/ci.yml
```

- Allure results are uploaded as artifacts after every run
- Playwright report is uploaded as an artifact on failure

## Test users

All credentials are from the public saucedemo demo site.

| Username | Password | Notes |
|----------|----------|-------|
| `standard_user` | `secret_sauce` | Default test user |
| `locked_out_user` | `secret_sauce` | Cannot log in |
| `problem_user` | `secret_sauce` | UI bugs present |
| `performance_glitch_user` | `secret_sauce` | Slow login |
