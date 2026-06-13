import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../../Components/Card/Card";
import Button from "../../../Components/Button/Button";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import { FaCheckCircle, FaBolt } from "react-icons/fa";
import {
  getCurrentSubscription,
  getSubscriptionPlans,
  startSubscriptionPayment,
} from "./subscriptionService";

const getPlanFeatures = (plan) => {
  if (Array.isArray(plan?.features) && plan.features.length) {
    return plan.features.filter(Boolean);
  }

  if (plan?.description) {
    return plan.description
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return ["Core gym management access"];
};

function SubscriptionPlans() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [payingPlanId, setPayingPlanId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsPageLoading(true);
      await Promise.all([
        getSubscriptionPlans(setPlans),
        getCurrentSubscription(setCurrentSubscription),
      ]);
      setIsPageLoading(false);
    };

    loadData();
  }, []);

  const activePlanId = useMemo(() => {
    if (currentSubscription?.status === "expired") return null;
    return currentSubscription?.planId || null;
  }, [currentSubscription]);

  const sortedPlanAmounts = useMemo(() => {
    return [...(plans || [])]
      .map((item) => Number(item?.amount || 0))
      .sort((a, b) => a - b);
  }, [plans]);

  const maxPlanAmount = sortedPlanAmounts[sortedPlanAmounts.length - 1] || 0;

  const handleUpgradeOrRenew = async (plan) => {
    setPayingPlanId(plan.id);
    await startSubscriptionPayment({
      plan,
      user,
      dispatch,
      setIsLoading: (loading) => {
        if (!loading) {
          setPayingPlanId(null);
        }
      },
      onSuccess: () => {
        getCurrentSubscription(setCurrentSubscription);
      },
    });
    setPayingPlanId(null);
  };

  return (
    <div className="space-y-4">
      <div className="breadcrumbAndButton">
        <BreadCrumb
          title={"Subscription Plans"}
          content={[{ title: "Subscription Plans", slug: "#" }]}
        />
      </div>

      {isPageLoading ? (
        <Card className="border border-color">
          <p className="text-sm text-light">Loading subscription plans...</p>
        </Card>
      ) : null}

      {!isPageLoading && !plans?.length ? (
        <Card className="border border-color">
          <p className="text-sm text-light">
            No subscription plans are available right now.
          </p>
        </Card>
      ) : null}

      <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-3">
        {plans
          .filter((it) => it.name !== "free")
          ?.map((plan) => {
            const features = getPlanFeatures(plan);
            const isActive = activePlanId === plan.id;
            const isSubmitting = payingPlanId === plan.id;
            const isTopPlan = Number(plan?.amount || 0) === maxPlanAmount;
            const planAmount = Number(plan?.amount || 0);
            const planDuration = Number(plan?.duration || 0);

            return (
              <Card
                key={plan.id}
                className={`
    relative  rounded-2xl border transition-all duration-300
    bg-[var(--background)] dark:bg-[var(--background-dark)]
    border-color
  `}
              >
                <div className="p-5 md:p-4 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-light mb-1.5">
                        Subscription Plan
                      </p>

                      <h3 className="text-[26px] leading-[1.1] font-bold capitalize text-[var(--text)] dark:text-[var(--text-dark)]">
                        {plan.name}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-2 pt-0.5">
                      {isTopPlan ? (
                        <span className="absolute -top-[10px] left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[var(--background)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)] border border-color whitespace-nowrap">
                          <FaBolt className="text-[10px]" />
                          Most Popular
                        </span>
                      ) : null}

                      {isActive ? (
                        <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-semibold whitespace-nowrap">
                          Active Plan
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mt-7 border-y border-color py-5">
                    <div className="flex items-end gap-2">
                      <h2 className="text-4xl font-extrabold text-[var(--primary)] leading-none tracking-tight">
                        ₹{planAmount}
                      </h2>

                      <span className="text-sm text-light mb-1">
                        / {planDuration} Month
                        {planDuration > 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="text-xs text-light mt-2">
                      Simple and transparent pricing.
                    </p>
                    <p className="text-xs text-light mt-2">
                      Choose the perfect plan for your fitness goals.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mt-6 flex-1">
                    <p className="text-sm font-semibold mb-4 text-[var(--text)] dark:text-[var(--text-dark)]">
                      Description
                    </p>

                    <ul className="space-y-2.5">
                      {features.map((feature, index) => (
                        <li
                          key={`${plan.id}_${index}`}
                          className="flex items-start gap-2.5 text-sm text-light leading-5"
                        >
                          <div className="min-w-5 h-5 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mt-[1px]">
                            <FaCheckCircle className="text-[10px] text-[var(--primary)]" />
                          </div>

                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="mt-7">
                    <Button
                      disabled={isSubmitting}
                      onClick={() => handleUpgradeOrRenew(plan)}
                      variant={isActive ? "outline" : "primary"}
                      className="w-full h-[46px] rounded-xl font-semibold text-sm justify-center"
                    >
                      {isSubmitting
                        ? "Processing..."
                        : isActive
                          ? "Renew Plan"
                          : "Upgrade Plan"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
}

export default SubscriptionPlans;
