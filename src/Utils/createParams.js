// // ✅ Utility function
export const createParams = (payload = {}) => {
  const keys = Object.keys(payload);
  keys.filter((it) => {
    if (!payload[it]) {
      delete payload[it];
    }
  });

  if (!payload || Object.keys(payload).filter((it) => payload[it]).length === 0)
    return "";

  const queryString = new URLSearchParams(payload).toString();
  return `?${queryString}`;
};
