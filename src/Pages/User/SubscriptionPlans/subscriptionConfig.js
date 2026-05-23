const SUBSCRIPTION_PAYMENT_CONFIG = {
  razorpayScriptUrl: "https://checkout.razorpay.com/v1/checkout.js",
  defaultCurrency: "INR",
  merchantName: "Gym Management",
  descriptionSuffix: "Subscription",
  themeColor: import.meta.env.VITE_RAZORPAY_THEME_COLOR || "#1f8ef1",
  keyPlaceholder: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
};

const PAYMENT_PROVIDER = {
  RAZORPAY: "razorpay",
  MOCK: "mock",
};

const buildRazorpayOptions = ({
  razorpayKey,
  order,
  plan,
  user,
  onPaymentSuccess,
  onPaymentDismiss,
}) => {
  return {
    key: razorpayKey,
    amount: order.amount,
    currency: order.currency || SUBSCRIPTION_PAYMENT_CONFIG.defaultCurrency,
    name: SUBSCRIPTION_PAYMENT_CONFIG.merchantName,
    description: `${plan?.name || "Plan"} ${SUBSCRIPTION_PAYMENT_CONFIG.descriptionSuffix}`,
    order_id: order.id,
    prefill: {
      name: user?.ownerName || user?.gymName || "",
      email: user?.email || "",
      contact: user?.phone || "",
    },
    notes: {
      gymId: user?.id,
      planId: plan?.id,
    },
    theme: {
      color: SUBSCRIPTION_PAYMENT_CONFIG.themeColor,
    },
    handler: onPaymentSuccess,
    modal: {
      ondismiss: onPaymentDismiss,
    },
  };
};

export { SUBSCRIPTION_PAYMENT_CONFIG, PAYMENT_PROVIDER, buildRazorpayOptions };
