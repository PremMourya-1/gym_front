import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import Table from "../../../Components/Table/Table";
import formatDate from "../../../Utils/formateDate";
import toCamelCase from "../../../Utils/modifyString";
import Switch from "../../../Components/Switch";

function OffersTable({ data, onEditClick, onDeleteClick, onChangeStatus }) {
  const columnsData = [
    {
      title: "Offer Name",
      selector: (row) => toCamelCase(row.offerName || row.name),
    },
    {
      title: "Apply Offer On",
      selector: (row) =>
        toCamelCase(
          row.planData?.name || row.planName || row.plan?.name || "-",
        ),
    },
    {
      title: "Offer Start Date",
      selector: (row) => formatDate(row.offerStartDate || row.startDate),
    },
    {
      title: "Offer End Date",
      selector: (row) => formatDate(row.offerEndDate || row.endDate),
    },
    {
      title: "Extra Days",
      selector: (row) => `${row.days || 0} Days`,
    },
    {
      title: "Active Clients",
      width: "120px",
      selector: (row) => {
        const count =
          row.activeClientsCount ??
          row.clientCount ??
          row.totalClients ??
          row.clients?.length ??
          0;
        return <span className="font-semibold">{count}</span>;
      },
    },
    {
      title: "Active",
      width: "80px",
      selector: (row) => (
        <Switch
          item={row}
          onChangeStatus={onChangeStatus}
          checked={Boolean(row.isActive)}
          type={"isActive"}
        />
      ),
    },
    {
      title: "Action",
      width: "100px",
      selector: (item) => (
        <ActionButtons
          data={item}
          onEdit={onEditClick}
          onDelete={onDeleteClick}
        />
      ),
    },
  ];

  return (
    <div className="card rounded-lg p-3">
      <Table columns={columnsData} data={data} />
    </div>
  );
}

export default OffersTable;
