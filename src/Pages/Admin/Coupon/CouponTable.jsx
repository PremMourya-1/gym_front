import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import Table from "../../../Components/Table/Table";
import formatDate from "../../../Utils/formateDate";

function CouponTable({ onEditClick, onDeleteClick, data }) {
  const columns = [
    {
      title: "code",
      selector: (item) => {
        return <span className="uppercase">{item.code}</span>;
      },
    },
    {
      title: "Discount",
      selector: (item) => {
        return item.discount;
      },
    },

    {
      title: "Start Date",
      selector: (item) => {
        return formatDate(item.startDate);
      },
    },
    {
      title: "End Date",
      selector: (item) => {
        return formatDate(item.endDate);
      },
    },

    {
      title: "Action",
      selector: (item) => {
        return (
          <ActionButtons
            data={item}
            onEdit={onEditClick}
            onDelete={onDeleteClick}
          />
        );
      },
    },
  ];

  return (
    <>
      <div className="card p-4">
        <Table columns={columns} data={data} />
      </div>
    </>
  );
}

export default CouponTable;
