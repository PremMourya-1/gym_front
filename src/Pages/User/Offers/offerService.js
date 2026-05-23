import toast from "react-hot-toast";
import { userApi } from "../../../Service/api";

async function getOffers(setOfferList) {
  try {
    const res = await userApi.offer();
    setOfferList(res.data.data);
  } catch (e) {
    console.log(e);
  }
}

async function createAndOffer(data, id, setDrawer, setOfferList, setIsLoading) {
  try {
    setIsLoading(true);
    const res = id
      ? await userApi.editOffer({ id, data })
      : await userApi.createOffer(data);
    setIsLoading(false);

    if (res.data.action) {
      setDrawer(false);
      toast.success(res.data.message);

      if (id) {
        setOfferList((prev) => {
          return prev && prev.map((x) => (x.id === id ? res.data.data : x));
        });
      } else {
        setOfferList((prev) => {
          return prev ? [res.data.data, ...prev] : [res.data.data];
        });
      }
    } else {
      toast.error(res.data.message);
    }
  } catch (e) {
    console.log(e);
    setIsLoading(false);
  }
}

async function deleteOffer(id, setIsLoading, setOfferList, setModal) {
  try {
    setIsLoading(true);
    const res = await userApi.deleteOffer({ id });
    setIsLoading(false);
    if (res.data.action) {
      setModal(false);
      toast.success(res.data.message);
      setOfferList((prev) => {
        return prev && prev.filter((x) => x.id !== id);
      });
    } else {
      toast.error(res.data.message);
    }
  } catch (e) {
    console.log(e);
    setIsLoading(false);
  }
}

export { getOffers, deleteOffer };

export default createAndOffer;
