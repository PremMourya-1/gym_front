import { useEffect, useState } from "react";
import getTicketData, {
  replayToUser,
  ticketDelete,
} from "./ticketEnquiryService";
import TicketTable from "../../User/Ticket/TicketTable";
import { useForm } from "react-hook-form";
import ModalWithoutButtons from "../../../Components/Modal/ModalWithoutButtons";
import CustomModal from "../../../Components/Modal/Modal";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import { useDispatch, useSelector } from "react-redux";

function TicketEnquiries() {
  const [ticketList, setTicketList] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState(false); // delete popup
  const [listId, setListId] = useState(null);

  const { handleSubmit, register, setValue } = useForm();

  useEffect(() => {
    getTicketData(setTicketList);
  }, []);
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  function handleReplay(data) {
    replayToUser(
      { id: listId, data: { ...data, status: 1 } },
      setIsLoading,
      setTicketList,
      setModalOpen,
      notification,
      dispatch
    );
  }
  function handleDeleteTicket() {
    ticketDelete(listId, setIsLoading, setModal, setTicketList);
  }

  function onEditClick(row) {
    setValue("messageReply", row.messageReply);
    setValue("status", row.status);
    setListId(row.id);
    setModalOpen(true);
  }
  function onDeleteClick(row) {
    setModal(true);
    setListId(row.id);
  }
  return (
    <>
      <TicketTable
        data={ticketList}
        isAdmin={true}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />

      <ModalWithoutButtons
        body={
          <>
            <form
              action=""
              onSubmit={handleSubmit(handleReplay)}
              className="p-4"
            >
              {/* <div className="inputBox mb-6">
                <select
                  required
                  name=""
                  id=""
                  className="formControl"
                  {...register("status")}
                >
                  <option value="" hidden>
                    Select
                  </option>
                  <option value={0}>Pending</option>
                  <option value={1}>Close</option>
                </select>
                <label htmlFor="">Select Status</label>
              </div> */}
              <div className="inputBox">
                <textarea
                  required
                  className="formControl"
                  {...register("messageReply")}
                />
                <label htmlFor="">
                  Message <span className="text-red-600">*</span>
                </label>
              </div>
              <button type="submit" className="btn btn-primary mt-4 ms-auto">
                Submit
              </button>
            </form>
          </>
        }
        onConfirm={handleReplay}
        loading={isLoading}
        open={modalOpen}
        setOpen={setModalOpen}
        title={"Reply To User"}
        isHeader={false}
      />

      <CustomModal
        isHeader={false}
        open={modal}
        setOpen={setModal}
        onConfirm={handleDeleteTicket}
        loading={isLoading}
        body={
          <>
            <ConfirmModal />
          </>
        }
      />
    </>
  );
}

export default TicketEnquiries;
