import { useMemo, useState } from "react";
import Card from "../../../Components/Card/Card";
import Button from "../../../Components/Button/Button";
import ModalWithoutButtons from "../../../Components/Modal/ModalWithoutButtons";
import InputBox from "../../../Components/Form/InputBox/InputBox";
import foodDatabase, {
  foodCategories,
} from "../../../Data/UserData/dietBuilderFoodData";
import {
  calculateDailyTotals,
  calculateFoodNutrition,
  calculateMacroTargets,
} from "./dietBuilderUtils";
import { FaAppleAlt, FaPlus, FaTrash, FaUtensils } from "react-icons/fa";
import { LuTarget } from "react-icons/lu";
import { MdOutlineTimer } from "react-icons/md";

const initialProfile = {
  age: "30",
  gender: "male",
  height: "175",
  weight: "72",
  activityLevel: "moderate",
  goal: "muscle gain",
  dietPreference: "non vegetarian",
};

const createMeal = (index) => ({
  id: Date.now() + index,
  name:
    ["Breakfast", "Lunch", "Pre Workout", "Post Workout", "Dinner"][index] ||
    `Meal ${index + 1}`,
  time: ["09:00", "13:00", "17:00", "19:00", "21:00"][index] || "09:00",
  foods: [],
});

const getStatusTone = (current, target) => {
  if (target === 0)
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
  if (current >= target)
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  if (current >= target * 0.7)
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
};

function DietBuilder() {
  const [profile, setProfile] = useState(initialProfile);
  const [meals, setMeals] = useState([createMeal(0)]);
  const [activeModal, setActiveModal] = useState(null);
  console.log(activeModal);
  const [modalQty, setModalQty] = useState(1);
  const [editingFoodId, setEditingFoodId] = useState(null);

  const targetMacros = useMemo(() => calculateMacroTargets(profile), [profile]);
  const dailyTotals = useMemo(() => calculateDailyTotals(meals), [meals]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleAddMeal = () => {
    setMeals((current) => [...current, createMeal(current.length)]);
  };

  const handleMealChange = (mealId, field, value) => {
    setMeals((current) =>
      current.map((meal) =>
        meal.id === mealId ? { ...meal, [field]: value } : meal,
      ),
    );
  };

  const openFoodModal = (mealId, food, existingFoodId = null) => {
    setActiveModal({ mealId, food, existingFoodId });
    setEditingFoodId(existingFoodId);
    setModalQty(existingFoodId ? 1 : 1);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalQty(1);
    setEditingFoodId(null);
  };

  const handleAddFoodToMeal = () => {
    if (!activeModal) return;
    const { mealId, food, existingFoodId } = activeModal;
    const quantity = Number(modalQty) || 1;

    setMeals((current) =>
      current.map((meal) => {
        if (meal.id !== mealId) return meal;

        if (existingFoodId) {
          return {
            ...meal,
            foods: meal.foods.map((entry) =>
              entry.id === existingFoodId ? { ...entry, quantity } : entry,
            ),
          };
        }

        return {
          ...meal,
          foods: [
            ...meal.foods,
            {
              id: Date.now(),
              food,
              quantity,
            },
          ],
        };
      }),
    );

    closeModal();
  };

  const handleRemoveFood = (mealId, foodId) => {
    setMeals((current) =>
      current.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              foods: meal.foods.filter((entry) => entry.id !== foodId),
            }
          : meal,
      ),
    );
  };

  const groupedFoods = useMemo(() => {
    return foodCategories.reduce((groups, category) => {
      groups[category.key] = foodDatabase.filter(
        (food) => food.category === category.key,
      );
      return groups;
    }, {});
  }, []);

  const statusCards = [
    {
      label: "Calories",
      current: dailyTotals.calories,
      target: targetMacros.calories,
    },
    {
      label: "Protein",
      current: dailyTotals.protein,
      target: targetMacros.protein,
    },
    { label: "Carbs", current: dailyTotals.carbs, target: targetMacros.carbs },
    { label: "Fat", current: dailyTotals.fat, target: targetMacros.fat },
  ];

  return (
    <div className="w-full space-y-5">
      <div className=" top-0 z-20 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)]/95 p-4 shadow-xl backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
              Daily Macro Snapshot
            </p>
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Trainer Controlled Diet Builder
            </h2>
          </div>
          <div className="grid w-full gap-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Calories",
                current: dailyTotals.calories,
                target: targetMacros.calories,
              },
              {
                label: "Protein",
                current: dailyTotals.protein,
                target: targetMacros.protein,
              },
              {
                label: "Carbs",
                current: dailyTotals.carbs,
                target: targetMacros.carbs,
              },
              {
                label: "Fat",
                current: dailyTotals.fat,
                target: targetMacros.fat,
              },
            ].map((item) => {
              const percent = item.target
                ? Math.min(100, Math.round((item.current / item.target) * 100))
                : 0;
              return (
                <div
                  key={item.label}
                  className="min-w-[140px] rounded-xl border border-[var(--border)] bg-[var(--background-light)] p-3"
                >
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--text)]">
                      {item.label}
                    </span>
                    <span className="text-[var(--muted)]">
                      {item.current}/{item.target}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--border)]">
                    <div
                      className="h-2 rounded-full bg-[var(--primary)]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid w-full gap-5 grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <Card className="rounded-2xl border border-[var(--border)] shadow-lg">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                  Client Profile
                </p>
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  Nutrition Setup
                </h3>
              </div>
              <div className="rounded-full bg-[var(--primary-tp)] px-3 py-1 text-sm font-medium text-[var(--primary)]">
                Live Targets
              </div>
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="relative inputBox">
                <InputBox
                  label="Age"
                  id="age"
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="inputBox">
                <label
                  className="mb-2 block text-sm font-medium text-[var(--text)]"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={profile.gender}
                  onChange={handleProfileChange}
                  className="formControl"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="relative inputBox">
                <InputBox
                  label="Height (cm)"
                  id="height"
                  type="number"
                  name="height"
                  value={profile.height}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="relative inputBox">
                <InputBox
                  label="Weight (kg)"
                  id="weight"
                  type="number"
                  name="weight"
                  value={profile.weight}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="inputBox">
                <label
                  className="mb-2 block text-sm font-medium text-[var(--text)]"
                  htmlFor="activityLevel"
                >
                  Activity Level
                </label>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={profile.activityLevel}
                  onChange={handleProfileChange}
                  className="formControl"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="veryactive">Very Active</option>
                </select>
              </div>
              <div className="inputBox">
                <label
                  className="mb-2 block text-sm font-medium text-[var(--text)]"
                  htmlFor="goal"
                >
                  Goal
                </label>
                <select
                  id="goal"
                  name="goal"
                  value={profile.goal}
                  onChange={handleProfileChange}
                  className="formControl"
                >
                  <option value="fat loss">Fat Loss</option>
                  <option value="weight gain">Weight Gain</option>
                  <option value="muscle gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="inputBox">
                <label
                  className="mb-2 block text-sm font-medium text-[var(--text)]"
                  htmlFor="dietPreference"
                >
                  Diet Preference
                </label>
                <select
                  id="dietPreference"
                  name="dietPreference"
                  value={profile.dietPreference}
                  onChange={handleProfileChange}
                  className="formControl"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non vegetarian">Non Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-light)] p-4 grid-cols-1 sm:grid-cols-2 grid-cols-4">
              <div>
                <p className="text-sm text-[var(--muted)]">BMR</p>
                <p className="text-xl font-semibold text-[var(--text)]">
                  {targetMacros.bmr || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">TDEE</p>
                <p className="text-xl font-semibold text-[var(--text)]">
                  {targetMacros.tdee || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Target Calories</p>
                <p className="text-xl font-semibold text-[var(--text)]">
                  {targetMacros.calories || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Target Protein</p>
                <p className="text-xl font-semibold text-[var(--text)]">
                  {targetMacros.protein || "—"}g
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                  Meal Plans
                </p>
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  Create Daily Meals
                </h3>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddMeal}
                icon="add"
              >
                Add Meal
              </Button>
            </div>

            {meals.map((meal, mealIndex) => (
              <Card
                key={meal.id}
                className="rounded-2xl border border-[var(--border)] shadow-lg"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[var(--primary-tp)] p-2.5 text-[var(--primary)]">
                      <FaUtensils />
                    </div>
                    <div>
                      <input
                        value={meal.name}
                        onChange={(event) =>
                          handleMealChange(meal.id, "name", event.target.value)
                        }
                        className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-base font-semibold text-[var(--text)] outline-none"
                      />
                      <p className="text-sm text-[var(--muted)]">
                        {mealIndex + 1} · Customize meal name
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-light)] px-3 py-2">
                    <MdOutlineTimer className="text-[var(--primary)]" />
                    <input
                      type="time"
                      value={meal.time}
                      onChange={(event) =>
                        handleMealChange(meal.id, "time", event.target.value)
                      }
                      className="bg-transparent text-sm font-medium text-[var(--text)] outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {foodCategories.map((category) => (
                    <div key={category.key}>
                      <div className="mb-2 flex items-center gap-2">
                        <FaAppleAlt className="text-[var(--primary)]" />
                        <h4 className="text-sm font-semibold text-[var(--text)]">
                          {category.label}
                        </h4>
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
                        {groupedFoods[category.key].map((food) => (
                          <button
                            key={food.id}
                            type="button"
                            onClick={() => openFoodModal(meal.id, food)}
                            className="min-w-[120px] rounded-2xl border border-[var(--border)] bg-[var(--background-light)] p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <img
                              src={food.image}
                              alt={food.name}
                              className="mb-2 h-14 w-full rounded-xl object-cover"
                            />
                            <p className="text-sm font-medium text-[var(--text)]">
                              {food.name}
                            </p>
                            <p className="text-xs text-[var(--muted)]">
                              {food.servingType}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--background-light)] p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-semibold text-[var(--text)]">
                      Added Foods
                    </p>
                    <span className="text-sm text-[var(--muted)]">
                      {meal.foods.length} items
                    </span>
                  </div>
                  {meal.foods.length ? (
                    <div className="space-y-2">
                      {meal.foods.map((entry) => {
                        const nutrition = calculateFoodNutrition(
                          entry.food,
                          entry.quantity,
                        );
                        return (
                          <div
                            key={entry.id}
                            className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <p className="font-medium text-[var(--text)]">
                                {entry.quantity} × {entry.food.name}
                              </p>
                              <p className="text-sm text-[var(--muted)]">
                                {nutrition.calories} kcal · P{" "}
                                {nutrition.protein}g · C {nutrition.carbs}g · F{" "}
                                {nutrition.fat}g
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openFoodModal(meal.id, entry.food, entry.id)
                                }
                              >
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  handleRemoveFood(meal.id, entry.id)
                                }
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
                      Select foods from the food carousel to build this meal.
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <Card className="rounded-2xl border border-[var(--border)] shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                  Nutrition Status
                </p>
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  Daily Progress
                </h3>
              </div>
              <div className="rounded-full bg-[var(--primary-tp)] p-2 text-[var(--primary)]">
                <LuTarget />
              </div>
            </div>
            <div className="space-y-3">
              {statusCards.map((item) => {
                const statusTone = getStatusTone(item.current, item.target);
                const remaining = item.target - item.current;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--background-light)] p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-semibold text-[var(--text)]">
                        {item.label}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone}`}
                      >
                        {item.current >= item.target
                          ? "Completed"
                          : item.current >= item.target * 0.7
                            ? "Under target"
                            : "Needs more"}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted)]">
                      {item.current} / {item.target}
                      {item.target > 0 && item.current < item.target
                        ? ` · Remaining ${remaining}${item.label === "Calories" ? " kcal" : "g"}`
                        : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="rounded-2xl border border-[var(--border)] shadow-lg">
            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                Target Summary
              </p>
              <h3 className="text-lg font-semibold text-[var(--text)]">
                Daily Macro Goals
              </h3>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-light)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">Calories</span>
                  <span className="font-semibold text-[var(--text)]">
                    {targetMacros.calories} kcal
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-light)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">Protein</span>
                  <span className="font-semibold text-[var(--text)]">
                    {targetMacros.protein}g
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-light)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">Carbs</span>
                  <span className="font-semibold text-[var(--text)]">
                    {targetMacros.carbs}g
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-light)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">Fat</span>
                  <span className="font-semibold text-[var(--text)]">
                    {targetMacros.fat}g
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ModalWithoutButtons
        open={Boolean(activeModal)}
        setOpen={closeModal}
        title={activeModal?.food?.name || "Select food"}
        size="md"
        body={
          <>
            <div className="space-y-4 bg-[var(--background)] p-5">
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-light)] p-3">
                <img
                  src={activeModal?.food?.image}
                  alt={activeModal?.food?.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div>
                  <p className="font-semibold text-[var(--text)]">
                    {activeModal?.food?.name}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    Serving Type: {activeModal?.food?.servingType}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="inputBox">
                  <input
                    required
                    id="quantity"
                    type="number"
                    min="1"
                    value={modalQty}
                    onChange={(event) => setModalQty(event.target.value)}
                    className="formControl"
                  />
                  <label
                    className="mb-2 block text-sm font-medium text-[var(--text)]"
                    htmlFor="quantity"
                  >
                    Quantity
                  </label>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-light)] p-4">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    Live Preview
                  </p>
                  {activeModal?.food &&
                    (() => {
                      const preview = calculateFoodNutrition(
                        activeModal.food,
                        modalQty,
                      );
                      return (
                        <div className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                          <p>Calories: {preview.calories}</p>
                          <p>Protein: {preview.protein}g</p>
                          <p>Carbs: {preview.carbs}g</p>
                          <p>Fat: {preview.fat}g</p>
                        </div>
                      );
                    })()}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddFoodToMeal}
                >
                  Add Food
                </Button>
              </div>
            </div>
          </>
        }
      ></ModalWithoutButtons>
    </div>
  );
}

export default DietBuilder;
