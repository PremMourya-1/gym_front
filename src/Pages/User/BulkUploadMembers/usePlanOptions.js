import { useEffect, useState } from "react";
import { getPlans } from "../../User/Plan/planService";

export function usePlanOptions() {
  const [planOptions, setPlanOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getPlans((data) => {
      if (!isMounted) return;
      setPlanOptions(Array.isArray(data) ? data : []);
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return { planOptions, loading, error };
}
