import adminApi, { userApi } from "../../../Service/api";

export default async function changePassword(isAdmin, payload) {
  try {
    return isAdmin
      ? await adminApi.changePassword(payload)
      : await userApi.changePassword(payload);
  } catch (error) {
    console.error("Error change password :", error.message);
    return null;
  }
}
