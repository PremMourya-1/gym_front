import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import TicketTable from "./TicketTable";
import getSmsTamplateData, { addEditTicket } from "./ticketService";
import LoaderSpiner from "../../../Components/Loaders/LoaderSpiner";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import UseFilter from "../../../Hooks/UseFilter";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import Tippy from "@tippyjs/react";
import UseShortKey from "../../../Hooks/UseShortKey";
import FileUpload from "../../../Components/Form/FileUpload/FileUpload";
import { TiAttachment } from "react-icons/ti";

function Ticket() {
  const [drawer, setDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listId, setListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ticketList, setTicketList] = useState();
  const [attechmentFile, setAttechmentFile] = useState(null);
  const [attachment, setAttachment] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    // formState: { errors },
  } = useForm();

  useEffect(() => {
    getSmsTamplateData(setTicketList);
  }, []);

  function handleAddTicket(data) {
    const formData = new FormData();
    formData.append("message", data.message);
    attechmentFile && formData.append("attachment", attechmentFile);

    addEditTicket(
      isEditing,
      listId,
      formData,
      setIsLoading,
      setDrawer,
      setTicketList
    );
  }

  function onEditClick(row) {
    setListId(row.id);
    setIsEditing(true);
    setDrawer(true);
    setValue("messageType", row.messageType);
    setValue("message", row.message);
    setValue("variable", row.variable);
    setValue("templateId", row.templateId);
  }
  const { query, setQuery, filteredData } = UseFilter(ticketList, "message");
  UseShortKey(setDrawer);

  useEffect(() => {
    !drawer && setAttachment(false);
  }, [drawer]);
  useEffect(() => {
    !attachment && setAttechmentFile(null);
  }, [attachment]);
  return (
    <>
      <div className="breadCrumbAndSearchBar">
        <BreadCrumb />
        <div className="searchAndButton">
          <div className="searchContainer">
            <div className="inputBox w-full">
              <input
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                value={query}
                required
                type={"textarea"}
                autoFocus
                className={`formControl `}
              />
              <label htmlFor={"id"}>Search</label>
            </div>
          </div>
          <div className="buttons shrink-0">
            <Tippy content="Ctrl + M" placement="bottom">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setDrawer(true);
                  reset();
                }}
                className={`btn group  btn-primary md:w-full`}
              >
                <LuPlus className="h-4 w-4 group-hover:fill-white transition-none" />
                {`Create Ticket`}
              </button>
            </Tippy>
          </div>
        </div>
      </div>

      <TicketTable data={filteredData} onEditClick={onEditClick} />
      <DrawerComponent
        size={"420px"}
        open={drawer}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} ${"Ticket"}`}
        body={
          <>
            <form onSubmit={handleSubmit(handleAddTicket)}>
              <div className="inputBox">
                <textarea
                  required
                  className="formControl "
                  {...register("message")}
                  autoFocus
                ></textarea>
                <label
                  htmlFor={"isActive"}
                  className="text-sm font-medium h-max"
                >
                  Message <span className="text-red-600">*</span>
                </label>
              </div>

              <div className="">
                <button
                  type="button"
                  onClick={() => {
                    setAttachment(!attachment);
                  }}
                  className="flex items-center gap-1  mb-2 px-3 py-1 rounded-md hover:shadow-sm bg-gray-100 dark:bg-gray-700 text-sm"
                >
                  <TiAttachment className="text-xl dark:text-white text-gray-500" />{" "}
                  Add Attachment
                </button>

                {attachment && <FileUpload setFile={setAttechmentFile} />}
              </div>
              {/* 
                <div className="col-span-2">
                  <label
                    htmlFor={"isActive"}
                    className="text-sm font-medium h-max "
                  >
                    Upload File
                  </label>
                  <div className="inputBox ">
                    <input
                      onChange={(e) => {
                        setAttechmentFile(e.target.files[0]);
                      }}
                      type="file"
                      className="formControl"
                    />
                  </div>
                </div> */}

              <button
                disabled={isLoading}
                className="btn ms-auto btn-primary mt-4"
              >
                {isLoading ? <LoaderSpiner /> : isEditing ? "Update" : "Send"}
              </button>
            </form>
          </>
        }
      />
    </>
  );
}

export default Ticket;
