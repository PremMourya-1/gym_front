import { userApi } from "../../../Service/api";
import { makeToast } from "../../../Components/Common/Toast/Toast";

export const bulkImportMembers = async (payload, callbacks = {}) => {
  const { onSuccess, onError, onFinally } = callbacks;

  try {
    const response = await userApi.bulkImportMembers(payload);
    const responseData = response?.data || {};
    const nestedData = responseData?.data || {};
    const notInserted = Array.isArray(nestedData?.notInserted)
      ? nestedData.notInserted
      : Array.isArray(nestedData)
        ? nestedData
        : [];
    const insertedCount = Number(
      nestedData?.insertedCount ?? responseData?.insertedCount ?? 0,
    );
    const normalizedResponse = {
      ...responseData,
      insertedCount,
      notInserted,
      rejectedRows: notInserted,
    };

    if (responseData?.action) {
      const message =
        responseData?.message ||
        `${insertedCount} members imported successfully!`;
      makeToast(message, "success");

      if (onSuccess) {
        onSuccess(normalizedResponse);
      }

      return normalizedResponse;
    }

    const errorMsg =
      responseData?.message ||
      "Some members failed to import. Please check rejected rows.";
    makeToast(errorMsg, "warning");

    if (onSuccess) {
      onSuccess(normalizedResponse);
    }

    return normalizedResponse;
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
