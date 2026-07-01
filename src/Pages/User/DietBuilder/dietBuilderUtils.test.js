import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateDailyTotals,
  calculateFoodNutrition,
  calculateMacroTargets,
} from "./dietBuilderUtils.js";

test("calculateMacroTargets returns sensible targets for a profile", () => {
  const targets = calculateMacroTargets({
    age: 30,
    gender: "male",
    height: 175,
    weight: 70,
    activityLevel: "moderate",
    goal: "fat loss",
  });

  assert.equal(targets.bmr > 0, true);
  assert.equal(targets.tdee > 0, true);
  assert.equal(targets.calories > 0, true);
  assert.equal(targets.protein > 0, true);
});

test("calculateFoodNutrition scales with quantity", () => {
  const nutrition = calculateFoodNutrition(
    {
      nutrition: { calories: 70, protein: 6, carbs: 0, fat: 5 },
    },
    3,
  );

  assert.deepEqual(nutrition, {
    calories: 210,
    protein: 18,
    carbs: 0,
    fat: 15,
  });
});

test("calculateDailyTotals sums macros across meals", () => {
  const totals = calculateDailyTotals([
    {
      foods: [
        {
          food: {
            nutrition: { calories: 100, protein: 10, carbs: 20, fat: 5 },
          },
          quantity: 2,
        },
      ],
    },
    {
      foods: [
        {
          food: { nutrition: { calories: 50, protein: 5, carbs: 5, fat: 1 } },
          quantity: 1,
        },
      ],
    },
  ]);

  assert.deepEqual(totals, { calories: 250, protein: 25, carbs: 45, fat: 11 });
});
