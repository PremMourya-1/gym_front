import toast from "react-hot-toast";
import { userApi } from "../../../Service/api";

export default async function getSmsTamplateData(setTicketList) {
  try {
    const res = await userApi.ticket();
    setTicketList(res.data.data);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}

async function addEditTicket(
  isEditing,
  listId,
  data,
  setIsLoading,
  setDrawer,
  setTicketList,
) {
  try {
    setIsLoading(true);
    let res;
    res = isEditing
      ? await userApi.editTicket({ id: listId, data })
      : await userApi.addTicket(data);

    setIsLoading(false);

    if (res.data.action) {
      toast.success(res.data.message);
      setDrawer(false);
      if (isEditing) {
        setTicketList((prev) => {
          return prev.map((item) => {
            if (item.id === listId) {
              return res.data.data;
            }
            return item;
          });
        });
      } else setTicketList((prev) => [res.data.data, ...prev]);
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
  }
}
async function deleteTicket(id, setIsLoading, setModal, setTicketList) {
  try {
    setIsLoading(true);
    const res = await userApi.deleteTicket({ id });
    setIsLoading(false);
    if (res.data.action) {
      setModal(false);
      setTicketList((prev) => {
        return prev.filter((it) => it.id !== id);
      });
    }
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}

export { deleteTicket, addEditTicket };
