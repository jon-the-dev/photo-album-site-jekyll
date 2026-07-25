const test = require("node:test");
const assert = require("node:assert/strict");

const { formatSlideNumber, wrapIndex } = require("../assets/js/site.js");

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
