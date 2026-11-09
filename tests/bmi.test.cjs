const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateBMI, categoryForBMI, validateInput } = require("../static/bmi.js");

test("valid measurements calculate BMI and pass validation", () => {
  assert.equal(validateInput("2026-11-09", 165, 58), null);
  assert.ok(Math.abs(calculateBMI(165, 58) - 21.3) < 0.1);
  assert.equal(categoryForBMI(calculateBMI(165, 58)).label, "정상");
});

test("BMI categories follow the adult reference boundaries", () => {
  assert.equal(categoryForBMI(18.49).label, "저체중");
  assert.equal(categoryForBMI(18.5).label, "정상");
  assert.equal(categoryForBMI(23).label, "과체중");
  assert.equal(categoryForBMI(25).label, "비만 1단계");
  assert.equal(categoryForBMI(30).label, "비만 2단계");
  assert.equal(categoryForBMI(35).label, "비만 3단계");
});

test("missing dates and out-of-range or non-numeric measurements are rejected", () => {
  assert.match(validateInput("", 165, 58), /날짜/);
  assert.match(validateInput("2026-11-09", 49.9, 58), /키/);
  assert.match(validateInput("2026-11-09", 165, 9.9), /몸무게/);
  assert.match(validateInput("2026-11-09", Number.NaN, 58), /키/);
  assert.match(validateInput("2026-11-09", 165, Number.NaN), /몸무게/);
});
