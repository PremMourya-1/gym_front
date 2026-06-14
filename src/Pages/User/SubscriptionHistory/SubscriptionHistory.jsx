import { useEffect, useState } from "react";
import subscriptionHistory from "./subscriptionHistoryService";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import SubscriptionHistoryTable from "./SubscriptionHistoryTable";

function SubscriptionHistory() {
  const [data, setData] = useState();
  useEffect(() => {
    subscriptionHistory(setData);
  }, []);
  return (
    <div>
      {" "}
      <div className="breadcrumbAndButton">
        <BreadCrumb
          title={"offers"}
          content={[{ title: "Subscription history", slug: "#" }]}
        />
      </div>
      <SubscriptionHistoryTable data={data} />
    </div>
  );
}

export default SubscriptionHistory;
