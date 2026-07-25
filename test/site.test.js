const test = require("node:test");
const assert = require("node:assert/strict");

const {
  analyticsParamsFromDataset,
  formatSlideNumber,
  isValidMeasurementId,
  wrapIndex,
} = require("../assets/js/site.js");

test("wrapIndex keeps carousel positions inside the slide range", () => {
  assert.equal(wrapIndex(0, 6), 0);
  assert.equal(wrapIndex(6, 6), 0);
  assert.equal(wrapIndex(-1, 6), 5);
  assert.equal(wrapIndex(14, 6), 2);
});

test("formatSlideNumber produces editorial two-digit labels", () => {
  assert.equal(formatSlideNumber(0), "01");
  assert.equal(formatSlideNumber(8), "09");
  assert.equal(formatSlideNumber(11), "12");
});

test("isValidMeasurementId only accepts GA4 measurement IDs", () => {
  assert.equal(isValidMeasurementId("G-ABC12345"), true);
  assert.equal(isValidMeasurementId(" g-test123456 "), true);
  assert.equal(isValidMeasurementId("UA-123456-1"), false);
  assert.equal(isValidMeasurementId(""), false);
});

test("analyticsParamsFromDataset maps explicit analytics properties", () => {
  assert.deepEqual(
    analyticsParamsFromDataset({
      analyticsDestination: "selected_work",
      analyticsEvent: "cta_clicked",
      analyticsLocation: "home_hero",
      unrelatedValue: "ignored",
    }),
    {
      destination: "selected_work",
      location: "home_hero",
    }
  );
});
