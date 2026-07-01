export const calculateMacroTargets = (profile) => {
  const weight = Number(profile.weight);
  const height = Number(profile.height);
  const age = Number(profile.age);
  const gender = profile.gender?.toLowerCase();
  const activity = profile.activityLevel?.toLowerCase();
  const goal = profile.goal?.toLowerCase();

  if (
    ![weight, height, age].every((value) => Number.isFinite(value) && value > 0)
  ) {
    return {
      bmr: 0,
      tdee: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
  }

  const bmr =
    gender === "female"
      ? 10 * weight + 6.25 * height - 5 * age - 161
      : 10 * weight + 6.25 * height - 5 * age + 5;

  const activityFactor =
    {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryactive: 1.9,
    }[activity] || 1.55;

  const tdee = Math.round(bmr * activityFactor);

  let calories = tdee;
  if (goal === "fat loss") calories = Math.max(1600, tdee - 400);
  if (goal === "weight gain") calories = tdee + 400;
  if (goal === "muscle gain") calories = tdee + 250;
  if (goal === "maintenance") calories = tdee;

  const protein = Math.round(weight * 2.1);
  const carbs = Math.round((calories * 0.35) / 4);
  const fat = Math.round((calories * 0.25) / 9);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories: Math.round(calories),
    protein,
    carbs,
    fat,
  };
};

export const calculateFoodNutrition = (food, quantity = 1) => {
  const multiplier = Number(quantity) || 0;

  return {
    calories: Math.round((food?.nutrition?.calories || 0) * multiplier),
    protein: Math.round((food?.nutrition?.protein || 0) * multiplier),
    carbs: Math.round((food?.nutrition?.carbs || 0) * multiplier),
    fat: Math.round((food?.nutrition?.fat || 0) * multiplier),
  };
};

export const calculateDailyTotals = (meals = []) => {
  return meals.reduce(
    (totals, meal) => {
      const mealTotals = (meal.foods || []).reduce(
        (sum, foodEntry) => {
          const nutrition = calculateFoodNutrition(
            foodEntry.food,
            foodEntry.quantity,
          );
          return {
            calories: sum.calories + nutrition.calories,
            protein: sum.protein + nutrition.protein,
            carbs: sum.carbs + nutrition.carbs,
            fat: sum.fat + nutrition.fat,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      );

      return {
        calories: totals.calories + mealTotals.calories,
        protein: totals.protein + mealTotals.protein,
        carbs: totals.carbs + mealTotals.carbs,
        fat: totals.fat + mealTotals.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
};
