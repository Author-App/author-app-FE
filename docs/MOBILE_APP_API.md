# Mobile app — API reference

This document describes the **Author App** HTTP API for iOS/Android clients. The API is versioned and mounted under a configurable base path (see **Base URL** below).

**Audience:** mobile engineers integrating authentication, catalog, library, digital purchases, and **print (Lulu)** checkout.

---

## Base URL

All routes below are expressed relative to your deployed API root.

- Typical pattern: **`https://<your-domain><BASE_URL>/v1/...`**
- **`BASE_URL`** is configured server-side (env `BASE_URL`), often **`/api`**, which yields paths like **`https://api.example.com/api/v1/auth/login`**.

Confirm the exact value with your backend team or staging environment.

---

## Common conventions

### Headers

| Header                                 | When                                                            |
| -------------------------------------- | --------------------------------------------------------------- |
| `Content-Type: application/json`       | Requests with a JSON body                                       |
| `Authorization: Bearer <access_token>` | Protected routes (after login / signup where tokens are issued) |

### Success response envelope

Successful responses generally follow:

```json
{
  "success": true,
  "message": "Human-readable message",
  "statusCode": 200,
  "data": {}
}
```

The **`data`** payload is what your client should parse for domain objects.

### Error response envelope

Errors follow:

```json
{
  "success": false,
  "message": "Primary error message",
  "statusCode": 400,
  "code": 0,
  "errors": {
    "fieldName": ["First issue", "Second issue"]
  }
}
```

- **`errors`** may be omitted; when present, values are **arrays of strings** per field key.
- Always surface **`message`** to the user when **`errors`** is empty or missing.

---

## Authentication (`/v1/auth`)

| Method | Path                    | Auth           | Description                     |
| ------ | ----------------------- | -------------- | ------------------------------- |
| POST   | `/v1/auth/signup`       | No             | Register                        |
| POST   | `/v1/auth/login`        | No             | Login — returns session tokens  |
| POST   | `/v1/auth/google`       | No             | Google sign-in/up               |
| POST   | `/v1/auth/facebook`     | No             | Facebook sign-in/up             |
| POST   | `/v1/auth/refresh`      | Refresh header | See refresh flow below          |
| POST   | `/v1/auth/logout`       | Bearer         | Logout                          |
| GET    | `/v1/auth/me`           | Bearer         | Current user profile            |
| GET    | `/v1/auth/email/verify` | Query token    | Email verification link handler |
| POST   | `/v1/auth/email/resend` | Body           | Resend verification email       |

### Refresh token

The backend expects the refresh token in the **`x-refresh`** header on **`POST /v1/auth/refresh`** (not in the JSON body). Use the new **`access`** / **`refresh`** pair from the response and replace stored credentials.

---

## Books (`/v1/books`)

Requires **`Authorization: Bearer`** with role **USER** or **ADMIN** for these routes.

| Method | Path                         | Description                                                        |
| ------ | ---------------------------- | ------------------------------------------------------------------ |
| GET    | `/v1/books`                  | List books (query params per API validation — filters, pagination) |
| GET    | `/v1/books/:bookId`          | Book detail                                                        |
| PUT    | `/v1/books/:bookId/progress` | Update reading/listening progress (USER)                           |

**Print-related fields on book objects** (when applicable):

- Types **`hardcover`** / **`paperback`** indicate print-capable titles.
- **`printValidationStatus`**, **`printValidationErrors`** — admin pipeline validation; mobile may show messaging if exposed on public payloads.

**Digital vs print purchase:**

- **Ebook / audiobook:** use **`POST /v1/orders`** (see below).
- **Print:** use **`POST /v1/print/quote`** then **`POST /v1/print/orders`** — **do not** use `/v1/orders` for hardcover/paperback.

---

## Home feed (`/v1/home`)

| Method | Path       | Auth                   |
| ------ | ---------- | ---------------------- |
| GET    | `/v1/home` | Bearer (USER or ADMIN) |

Returns aggregated home/content payload as defined by `home.controller`.

---

## Library (`/v1/library`)

| Method | Path                           | Auth                                 |
| ------ | ------------------------------ | ------------------------------------ |
| GET    | `/v1/library`                  | Bearer (USER or ADMIN)               |
| PATCH  | `/v1/library/bookmark/:bookId` | Bearer — body includes bookmark flag |

---

## Digital orders — Stripe (`/v1/orders`)

Use for **non-print** books only (e.g. **ebook**, **audiobook**).

| Method | Path         | Auth          | Body                   |
| ------ | ------------ | ------------- | ---------------------- |
| POST   | `/v1/orders` | Bearer (USER) | `{ "bookId": "<id>" }` |

**Response `data`:** includes order fields and a Stripe **`clientSecret`** for:

- **Stripe PaymentSheet** (recommended), or
- **PaymentIntent** confirmation flow on mobile.

**Rules enforced server-side:**

- Book must exist; **not** free (free titles use library flows, not checkout).
- **Hardcover / paperback** are rejected — client must use the **print** endpoints below.
- User must not already own the book (where applicable).

| Method | Path                                 | Auth           | Description                                                              |
| ------ | ------------------------------------ | -------------- | ------------------------------------------------------------------------ |
| GET    | `/v1/orders/:orderId`                | Owner or ADMIN | Order detail                                                             |
| GET    | `/v1/orders/:orderId/verify-payment` | Owner          | Compares order with Stripe; check payment status after client completion |

**Money:** Book **`price`** is stored in **minor units (e.g. cents)**. Stripe PaymentIntent amounts match that.

**Admin-only:** `GET /v1/orders` (list) is **ADMIN** — not for the consumer app.

---

## Print orders — Lulu quote & checkout (`/v1/print`)

Use for **`hardcover`** / **`paperback`**. Flow:

1. **Quote** — get current tax-inclusive total from Lulu for shipping + line items.
2. **Create print order** — server re-runs quote and **must** match your quoted amounts (anti-tampering).
3. **Pay** — use returned Stripe **`clientSecret`** like digital orders.
4. **Poll** — optional **`GET`** print order for status / tracking.

### 1. Quote

**`POST /v1/print/quote`**

**Auth:** Bearer (USER or ADMIN)

**Body:**

```json
{
  "bookId": "string",
  "quantity": 1,
  "shippingOption": "MAIL",
  "shipping": {
    "countryCode": "US",
    "firstName": "Jane",
    "lastName": "Doe",
    "companyName": "optional",
    "street1": "123 Main St",
    "street2": "optional",
    "city": "City",
    "stateCode": "CA",
    "postcode": "90210",
    "phone": "+1...",
    "email": "jane@example.com"
  }
}
```

**`shippingOption`** must be one of:

`MAIL` | `PRIORITY_MAIL` | `GROUND_HD` | `GROUND_BUS` | `GROUND` | `EXPEDITED` | `EXPRESS`

**Response `data` (typical):**

- `bookId`, `title`
- **`amountCents`** — integer, smallest currency unit (use for display after dividing by 100 as needed)
- **`currency`**
- **`luluTotalCostInclTax`** — string; must be sent back unchanged on checkout
- `raw` — optional debug/raw Lulu payload

Store **`amountCents`** and **`luluTotalCostInclTax`** from this response for step 2.

### 2. Create print order + PaymentIntent

**`POST /v1/print/orders`**

**Auth:** Bearer (USER or ADMIN)

**Body:** Same as quote **plus**:

```json
{
  "bookId": "...",
  "quantity": 1,
  "shippingOption": "MAIL",
  "shipping": {},
  "quotedAmountCents": 12345,
  "luluTotalCostInclTax": "123.45"
}
```

- **`quotedAmountCents`** — must equal **`amountCents`** from the quote you are honoring **for the same** book, quantity, shipping, and shipping option.
- **`luluTotalCostInclTax`** — must match the quote string **exactly**.

The server recomputes the Lulu cost; if anything differs, you get **400** (quote mismatch — refresh quote UI and retry).

**Response `data` (typical):**

- **`printOrderId`**
- **`clientSecret`** — Stripe PaymentSheet / PI
- **`amountCents`**, **`currency`**, **`status`**

### 3. Get print order status

**`GET /v1/print/orders/:printOrderId`**

**Auth:** Bearer (USER or ADMIN) — must own the print order (server enforces).

**Query:**

- **`refresh=true`** — optional; may refresh tracking/status from Lulu when a print job exists.

**Response `data` includes (among others):** `status`, `luluStatus`, `luluPrintJobId`, `trackingUrls`, `fulfillmentError`, shipping snapshot, amounts, timestamps.

---

## Stripe on mobile (both digital and print)

1. Call **`POST /v1/orders`** or **`POST /v1/print/orders`** to obtain **`clientSecret`**.
2. Initialize Stripe SDK with your **publishable key** (from backend/env — ask team).
3. Present PaymentSheet (or equivalent) with **`clientSecret`**.
4. On success, optionally call **`GET /v1/orders/:orderId/verify-payment`** (digital) or **`GET /v1/print/orders/:printOrderId`** (print) to reflect fulfillment state.

Webhooks (`/v1/webhooks/stripe`, `/v1/webhooks/lulu`) are **server-only** — the app does not call them.

---

## Account / profile (optional)

Routes exist under **`/v1/account`**, **`/v1/profile`** — see Swagger at **`/docs/api`** on environments where docs are enabled, or inspect `src/routes/v1/` in this repo.

---

## Quick checklist for mobile

- [ ] Base URL + `BASE_URL` prefix confirmed for staging/production
- [ ] Store **access** + **refresh** tokens securely; refresh via **`x-refresh`**
- [ ] Use **`/v1/orders`** only for ebook/audiobook
- [ ] Use **`/v1/print/quote`** → **`/v1/print/orders`** for print
- [ ] Handle **`success: false`** with **`message`** and optional **`errors`** map
- [ ] Stripe **`clientSecret`** only from backend responses — never fabricate

---

## Document maintenance

This file is maintained alongside `author-app-be`. When routes change, update this document or regenerate from OpenAPI if available.

**Last updated:** 2026-04-29
