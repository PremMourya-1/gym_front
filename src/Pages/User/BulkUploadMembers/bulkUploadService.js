import { userApi } from "../../../Service/api";
import { makeToast } from "../../../Components/Common/Toast/Toast";

export const bulkImportMembers = async (payload, callbacks = {}) => {
  console.log("yes");
  const { onSuccess, onError, onFinally } = callbacks;

  try {
    const response = await userApi.bulkImportMembers(payload);

    // Check for action flag (true = success)
    if (response?.data?.action) {
      const rejectedData = response?.data?.data || [];
      const successCount = payload?.rows?.length - rejectedData.length;

      // Show success message
      const message =
        response?.data?.message ||
        `${successCount} members imported successfully!`;
      makeToast(message, "success");

      // Call onSuccess with full response including rejected data
      if (onSuccess) {
        onSuccess({
          ...response.data.data,
          successCount,
          rejectedCount: rejectedData.length,
          rejectedRows: rejectedData,
        });
      }

      return response.data;
    } else {
      // action is false - partial or complete failure
      const rejectedData = response?.data?.data || [];
      const successCount = payload?.rows?.length - rejectedData.length;

      const errorMsg =
        response?.data?.message ||
        "Some members failed to import. Please check rejected rows.";
      makeToast(errorMsg, "warning");

      // Call onSuccess with rejection details even on partial failure
      if (onSuccess) {
        onSuccess({
          ...response.data,
          successCount,
          rejectedCount: rejectedData.length,
          rejectedRows: rejectedData,
        });
      }

      return response.data;
    }
  } catch (error) {
    const errorMsg =
      error?.response?.data?.message ||
      error?.message ||
      "An error occurred while importing members.";

    makeToast(errorMsg, "error");

    if (onError) {
      onError(error);
    }

    console.error("Bulk import error:", error);
    return null;
  } finally {
    if (onFinally) {
      onFinally();
    }
  }
};
