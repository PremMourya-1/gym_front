import toast from "react-hot-toast";
import { userApi } from "../../../Service/api";

const getClients = async (payload, setData, setDataIndb, setIsLoading) => {
  try {
    setIsLoading?.(true);
    const res = await userApi.client(payload);
    if (res.data.action) {
      setData(res.data.data?.data);
      setDataIndb?.(res.data.data.totalCount);
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    setIsLoading?.(false);
  }
};
const getExpiredClients = async (
  payload,
  setData,
  setDataIndb,
  setIsLoading,
) => {
  try {
    setIsLoading?.(true);
    const res = await userApi.expiredClients(payload);
    if (res.data.action) {
      setData(res.data.data?.data);
      setDataIndb?.(res.data.data.totalCount);
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    setIsLoading?.(false);
  }
};

async function addEditClient(
  data,
  id,
  setDrawer,
  setClientList,
  setIsLoading,
  setPhotoFile,
) {
  try {
    setIsLoading(true);
    let res;
    if (id) {
      if (setPhotoFile) {
        res = await userApi.uploadClientPhoto({ id, data });
      } else {
        res = await userApi.editClient({ id, data });
      }
    } else if (setPhotoFile) {
      res = await userApi.createClient(data);
    }

    setIsLoading(false);

    if (res.data.action) {
      setDrawer(false);
      toast.success(res.data.message);

      if (id) {
        setClientList(
          (prev) =>
            prev &&
            prev.map((x) => (x.id === id ? { ...x, ...res.data.data } : x)),
        );
        setPhotoFile?.();
      } else {
        setClientList((prev) =>
          prev ? [res.data.data, ...prev] : [res.data.data],
        );
      }
    } else toast.error(res.data.message);
    return res;
  } catch (e) {
    console.log(e);
  } finally {
    setIsLoading(false);
  }
}

async function deleteClient(id, setIsLoading, setClientList, setModal) {
  try {
    setIsLoading(true);

    const res = await userApi.deleteClient({ id });

    setIsLoading(false);

    if (res.data.action) {
      setModal(false);
      toast.success(res.data.message);

      setClientList?.((prev) => prev && prev.filter((x) => x.id !== id));
    } else toast.error(res.data.message);
  } catch (e) {
    console.log(e);
  }
}
async function receivePending(payload, setIsLoading, setModal, setReload) {
  try {
    setIsLoading(true);

    const res = await userApi.receivePending(payload);

    setIsLoading(false);
    if (res.data.action) {
      setModal(false);
      setReload((prev) => prev + 1);
    } else toast.error(res.data.message);
  } catch (e) {
    console.log(e);
  }
}

export { getClients, deleteClient, getExpiredClients, receivePending };
export default addEditClient;
