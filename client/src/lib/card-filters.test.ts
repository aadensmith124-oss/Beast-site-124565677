import assert from "node:assert/strict";
import { test } from "node:test";
import { cardHasAttribute, extractCardState, type CardAttributeKey } from "./card-filters";

const extras = [
  "9999999999999999",
  "12/25",
  "123",
  "Jane Doe",
  "123 Oak Street",
  "Springfield",
  "CA",
  "90210",
  "jane@example.test",
  "Phone: (555) 555-1212",
  "DOB: 01/02/1990",
  "SSN: 123-45-6789",
  "IP: 192.168.0.1",
  "User-Agent: Mozilla/5.0",
].join("|");

test("detects whether common card data attributes are present", () => {
  const keys: CardAttributeKey[] = [
    "email",
    "phone",
    "name",
    "fullAddress",
    "dob",
    "ssn",
    "ipAddress",
    "userAgent",
  ];

  for (const key of keys) assert.equal(cardHasAttribute(extras, key), true, `${key} should be detected`);
});

test("does not infer personal data from basic card fields", () => {
  const basicCard = "9999999999999999|12/25|123";

  for (const key of ["email", "phone", "name", "fullAddress", "dob", "ssn", "ipAddress", "userAgent"] as const) {
    assert.equal(cardHasAttribute(basicCard, key), false, `${key} should not be inferred`);
  }
});

test("extracts state codes from delimited and labeled extras", () => {
  assert.equal(extractCardState(extras), "CA");
  assert.equal(extractCardState("state: New York|90210"), "NEW YORK");
  assert.equal(extractCardState("9999999999999999|12/25|123"), "");
});
