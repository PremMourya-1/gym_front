import toast from "react-hot-toast";
import { userApi } from "../../../Service/api";
import { setLocaleStorageItem } from "../../../Utils/localeStorage";
import { USER_DETAILS } from "../../../Constant/Constant";
import {
  loginToggleAction,
  updateAuthDataForSession,
} from "../../../Store/Slices/AuthSlice";
import {
  buildRazorpayOptions,
  PAYMENT_PROVIDER,
  SUBSCRIPTION_PAYMENT_CONFIG,
} from "./subscriptionConfig";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = SUBSCRIPTION_PAYMENT_CONFIG.razorpayScriptUrl;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const syncUserSession = (dispatch, gymData) => {
  if (!gymData) return;

  const existingData = JSON.parse(localStorage.getItem(USER_DETAILS)) || {};
  const mergedData = {
    ...existingData,
    ...gymData,
    isAdmin: false,
  };

  setLocaleStorageItem(USER_DETAILS, mergedData);
  dispatch(updateAuthDataForSession(gymData));
  dispatch(loginToggleAction(mergedData));
};

const getSubscriptionPlans = async (setData, setIsLoading) => {
  try {
    setIsLoading?.(true);
    const res = await userApi.subscriptionPlans();
    if (res.data.action) {
      setData?.(res.data.data || []);
      return res.data.data || [];
    }

    toast.error(res.data.message);
    return [];
  } catch (error) {
    console.log(error);
    return [];
  } finally {
    setIsLoading?.(false);
  }
};

const getCurrentSubscription = async (setData, setIsLoading) => {
  try {
    setIsLoading?.(true);
    const res = await userApi.currentSubscription();

    if (res.data.action) {
      setData?.(res.data.data);
      return res.data.data;
    }

    toast.error(res.data.message);
    return null;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    setIsLoading?.(false);
  }
};

const verifySubscriptionPayment = async ({
  payload,
  dispatch,
  onSuccess,
  setIsLoading,
}) => {
  try {
    setIsLoading?.(true);

    const verifyRes = await userApi.verifySubscriptionPayment(payload);
    if (!verifyRes.data.action) {
      toast.error(verifyRes.data.message);
      return null;
    }

    syncUserSession(dispatch, verifyRes.data.data?.gym);
    onSuccess?.(verifyRes.data.data);
    toast.success(verifyRes.data.message);

    return verifyRes.data.data;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    setIsLoading?.(false);
  }
};

const startSubscriptionPayment = async ({
  plan,
  user,
  dispatch,
  onSuccess,
  setIsLoading,
  onMockCheckout,
}) => {
  try {
    setIsLoading?.(true);

    const orderRes = await userApi.createSubscriptionOrder({ planId: plan.id });

    if (!orderRes.data.action) {
      toast.error(orderRes.data.message);
      return null;
    }

    if (orderRes.data.data?.isFreePlan) {
      syncUserSession(dispatch, orderRes.data.data?.gym);
      onSuccess?.(orderRes.data.data);
      toast.success(orderRes.data.message);
      return orderRes.data.data;
    }

    const order = orderRes.data.data?.order;
    if (!order?.id) {
      toast.error("Invalid payment order response");
      return null;
    }

    if (order.provider === PAYMENT_PROVIDER.MOCK) {
      setIsLoading?.(false);

      let shouldProceed = true;
      if (onMockCheckout) {
        shouldProceed = await onMockCheckout({
          plan,
          order,
          provider: PAYMENT_PROVIDER.MOCK,
        });
      }

      if (!shouldProceed) {
        return null;
      }

      setIsLoading?.(true);
      return await verifySubscriptionPayment({
        payload: {
          planId: plan.id,
          razorpay_order_id: order.id,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: "mock_signature",
        },
        dispatch,
        onSuccess,
        setIsLoading,
      });
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load");
      return null;
    }

    const razorpayKeyId =
      orderRes.data.data?.razorpayKeyId ||
      SUBSCRIPTION_PAYMENT_CONFIG.keyPlaceholder;
    if (!razorpayKeyId) {
      toast.error("Razorpay key is missing in configuration");
      return null;
    }

    return await new Promise((resolve) => {
      const options = buildRazorpayOptions({
        razorpayKey: razorpayKeyId,
        order,
        plan,
        user,
        onPaymentSuccess: async (response) => {
          const verifyData = await verifySubscriptionPayment({
            payload: {
              planId: plan.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            dispatch,
            onSuccess,
            setIsLoading,
          });
          resolve(verifyData);
        },
        onPaymentDismiss: () => {
          setIsLoading?.(false);
          resolve(null);
        },
      });

      const instance = new window.Razorpay(options);
      instance.open();
    });
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    setIsLoading?.(false);
  }
};

export {
  getSubscriptionPlans,
  getCurrentSubscription,
  startSubscriptionPayment,
};
