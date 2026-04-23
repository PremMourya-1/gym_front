import toast from "react-hot-toast";
import adminApi from "../../../Service/api";
import { setNotification } from "../../../Store/Slices/NotificationSlice";

export default async function getTicketData(setTicketLIst) {
  try {
    const res = await adminApi.ticket();
    setTicketLIst(res.data.data);
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
async function replayToUser(
  data,
  setIsLoading,
  setTicketList,
  setModalOpen,
  notification,
  dispatch,
) {
  try {
    setIsLoading(true);
    const res = await adminApi.ticketReply(data);
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);

      setTicketList((prev) => {
        return prev.map((it) => (it.id === data.id ? res.data.data : it));
      });
      const filtered = notification.filter((it) => it.id !== data.id);
      dispatch(setNotification(filtered));
      setModalOpen(false);
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
async function ticketDelete(id, setIsLoading, setModal, setTicketList) {
  try {
    setIsLoading(true);
    const res = await adminApi.ticketDelete({ id });
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setModal(false);
      setTicketList((prev) => {
        return prev.filter((it) => it.id !== id);
      });
    } else toast.error(res.data.message);
  } catch (error) {
    console.log(error);
  }
}

export { replayToUser, ticketDelete };
