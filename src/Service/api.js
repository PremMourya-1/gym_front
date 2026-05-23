import { apiJson, apiMultipart } from "./service";
import { adminUrl, userUrl } from "./url";

const adminApi = {
  dashboard: () => apiJson.get(adminUrl.dashboard),
  adminLogin: (payload) => apiJson.post(adminUrl.login, payload),
  sendOtp: (payload) => apiJson.post(adminUrl.sendOtp, payload),
  adminFrogotPassword: (payload) =>
    apiJson.post(adminUrl.adminFrogotPassword, payload),
  adminLogout: (payload) => apiJson.get(adminUrl.logout, payload),
  changePassword: (payload) => apiJson.put(adminUrl.changePassword, payload),
  userPermission: () => apiJson.get(adminUrl.userPermission),
  //
  createPlan: (payload) => apiJson.post(adminUrl.plan + "/add", payload),
  plan: () => apiJson.get(adminUrl.plan),
  editPlan: (payload) =>
    apiJson.put(`${adminUrl.plan}/${payload.id}`, payload.data),
  deletePlan: ({ id }) => apiJson.delete(`${adminUrl.plan}/${id}`),
  //
  //
  createGym: (payload) => apiJson.post(adminUrl.gym + "/add", payload),
  gym: () => apiJson.get(adminUrl.gym),
  editGym: (payload) =>
    apiJson.put(`${adminUrl.gym}/${payload.id}`, payload.data),
  deleteGym: ({ id }) => apiJson.delete(`${adminUrl.gym}/${id}`),
};

const userApi = {
  // dashboard
  userLogout: () => apiJson.get(userUrl.logout),
  dashboard: () => apiJson.get(userUrl.dashboard),
  notification: (payload) => apiJson.post(userUrl.notification, payload),
  updateProfile: (payload) => apiMultipart.put(userUrl.updateProfile, payload),
  userLogin: (payload) => apiJson.post(userUrl.login, payload),

  //

  createPlan: (payload) => apiJson.post(userUrl.plan + "/add", payload),
  plan: () => apiJson.get(userUrl.plan),
  editPlan: (payload) =>
    apiJson.put(`${userUrl.plan}/${payload.id}`, payload.data),
  deletePlan: ({ id }) => apiJson.delete(`${userUrl.plan}/${id}`),
  createOffer: (payload) => apiJson.post(userUrl.offer + "/add", payload),
  offer: () => apiJson.get(userUrl.offer),
  editOffer: (payload) =>
    apiJson.put(`${userUrl.offer}/${payload.id}`, payload.data),
  deleteOffer: ({ id }) => apiJson.delete(`${userUrl.offer}/${id}`),
  //
  createClient: (payload) => apiJson.post(userUrl.client + "/add", payload),

  client: (payload) => apiJson.get(`${userUrl.client}${payload}`),
  clientExcelData: (payload) =>
    apiJson.get(`${userUrl.client}/excel-data${payload || ""}`),
  expiredClients: (payload) =>
    apiJson.get(`${userUrl.client + "/expired"}${payload}`),
  editClient: (payload) =>
    apiJson.put(`${userUrl.client}/${payload.id}`, payload.data),
  uploadClientPhoto: (payload) =>
    apiJson.put(`${userUrl.client}/client-photo/${payload.id}`, payload.data),
  deleteClient: ({ id }) => apiJson.delete(`${userUrl.client}/${id}`),
  bulkImportMembers: (payload) => apiJson.post(userUrl.bulkImport, payload),
  //
  renewalList: (payload) => apiJson.get(userUrl.renew + "/" + payload.id),
  renewPlan: (payload) => apiJson.post(userUrl.renew + "/add", payload),
  receivePending: (payload) =>
    apiJson.post(userUrl.renew + "/receivePending/" + payload.id, payload.data),
  subscriptionPlans: () => apiJson.get(userUrl.subscriptionPlans),
  currentSubscription: () => apiJson.get(userUrl.currentSubscription),
  createSubscriptionOrder: (payload) =>
    apiJson.post(userUrl.subscriptionCreateOrder, payload),
  verifySubscriptionPayment: (payload) =>
    apiJson.post(userUrl.subscriptionVerifyPayment, payload),
  activateSubscription: (payload) =>
    apiJson.post(userUrl.subscriptionActivate, payload),
  //  change password
  changePassword: (payload) => apiJson.put(userUrl.changePassword, payload),
};

export { userApi };
export default adminApi;
