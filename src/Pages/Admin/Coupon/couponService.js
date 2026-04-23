import toast from "react-hot-toast";
import adminApi from "../../../Service/api";

async function getCouponList(setCouponList) {
  try {
    const res = await adminApi.coupon();
    setCouponList(res.data.data);
  } catch (e) {
    console.log(e);
  }
}
async function addEditCoupon(
  isEditing,
  data,
  id,
  setIsLoading,
  setDrawer,
  setCouponList,
) {
  try {
    // setIsLoading(true);
    let res;
    res = isEditing
      ? await adminApi.editCoupon({ id, data })
      : await adminApi.createCoupon(data);
    // setIsLoading(false);

    if (res.data.action) {
      setDrawer(false);
      toast.success(res.data.message);

      if (isEditing) {
        setCouponList((prev) => {
          return prev && prev.map((x) => (x.id === id ? res.data.data : x));
        });
      } else {
        setCouponList((prev) => {
          return prev ? [res.data.data, ...prev] : [res.data.data];
        });
      }
    } else toast.error(res.data.message);
  } catch (e) {
    console.log(e);
  }
}
async function deleteCoupon(id, setIsLoading, setCouponList, setModal) {
  try {
    setIsLoading(true);
    const res = await adminApi.deleteCoupon({ id });
    setIsLoading(false);
    if (res.data.action) {
      setModal(false);
      toast.success(res.data.message);
      setCouponList((prev) => {
        return prev && prev.filter((x) => x.id !== id);
      });
    } else toast.success(res.data.message);
  } catch (e) {
    console.log(e);
  }
}
export { getCouponList, deleteCoupon };

export default addEditCoupon;
