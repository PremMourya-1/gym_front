import { useEffect, useState } from "react";
import DrawerComponent from "../../../../../Components/Drawer/Drawer";
import Table from "../../../../../Components/Table/Table";
import { MdSpellcheck } from "react-icons/md";
import DailyAttendanceTable from "./DailyAttendanceTable";
import getDailyAttendanceData, {
  createAttendance,
  getClassStudentData,
} from "./dailyAttendanceService";
import { useSelector } from "react-redux";
import moment from "moment";
import formatDate from "../../../../../Utils/formateDate";
import LoaderSpiner from "../../../../../Components/Loaders/LoaderSpiner";
import { Modal } from "rsuite";
import Tippy from "@tippyjs/react";

function DailyAttendance() {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData?.id);

  const [open, setOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [classData, setClassData] = useState();
  const [studentData, setStudentData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentMasterData, setStudentMasterData] = useState({});
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const [isNotify, setIsNotify] = useState(0);

  // preset lagane k liye
  const [studentAttendanceData, setStudentAttendanceData] = useState();
  const [allPresent, setAllPresent] = useState();

  useEffect(() => {
    const tempData = studentData?.map(
      ({ attendance, promotionId, studentId, admissionNo }) => {
        return {
          isPresent: attendance.isPresent,
          date: moment(date).format("YYYY-MM-DD"),
          promotionId,
          studentId,
          ...studentMasterData,
          admissionNo,
          sessionMasterId,
          direction: "IN",
          deviceLogId: 123,
          isMail: 1,
          isSms: 1,
        };
      }
    );

    setStudentAttendanceData(tempData);
  }, [studentData]);

  const studentListColumns = [
    // {
    //   title: "Sr No.",
    //   selector: (row, i) => i + 1,
    //   width: "60px",
    // },
    {
      title: "Adm No",
      selector: (row) => row.admissionNo,
      width: "80px",
    },
    {
      title: "Device Id",
      selector: (row) => row.deviceId,
      width: "80px",
    },

    {
      title: "Student Name",
      width: "140px",
      selector: (row) => row.studentName,
    },
    {
      title: "Father's Name",
      width: "140px",
      selector: (row) => row.fathersName,
    },
    {
      title: "Attendance",
      selector: (row, i) => {
        return (
          <>
            <form action="" className=" gap-4 items-center flex">
              <div className="flex gap-1">
                <input
                  className={`${
                    studentAttendanceData.find(
                      (it) => it.studentId === row.studentId
                    )?.isPresent === 1 && "accent-green-600 "
                  }`}
                  type="radio"
                  name="attendance"
                  id={i + "present"}
                  checked={
                    studentAttendanceData.find(
                      (it) => it.studentId === row.studentId
                    )?.isPresent === 1
                  }
                  onChange={() => {
                    const updated = studentAttendanceData.map((item) => {
                      if (item.studentId === row.studentId) {
                        return { ...item, isPresent: 1 };
                      } else return item;
                    });
                    setStudentAttendanceData(updated);
                  }}
                />
                <label className="text-sm" htmlFor={i + "present"}>
                  Present
                </label>
              </div>
              <div className="flex gap-1">
                <input
                  className={`${
                    studentAttendanceData.find(
                      (it) => it.studentId === row.studentId
                    )?.isPresent === 0 && "accent-red-600"
                  }`}
                  type="radio"
                  name="attendance"
                  id={i + "absent"}
                  checked={
                    studentAttendanceData.find(
                      (it) => it.studentId === row.studentId
                    )?.isPresent === 0
                  }
                  onChange={() => {
                    const updated = studentAttendanceData.map((item) => {
                      if (item.studentId === row.studentId) {
                        return { ...item, isPresent: 0 };
                      } else return item;
                    });
                    setStudentAttendanceData(updated);
                  }}
                />
                <label className="text-sm" htmlFor={i + "absent"}>
                  Absent
                </label>
              </div>
            </form>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getDailyAttendanceData(
      { sessionMasterId, date: moment(date).format("YYYY-MM-DD") },
      setClassData
    );
  }, []);

  function handleGetDayData(e) {
    e.preventDefault();
    date &&
      getDailyAttendanceData(
        { sessionMasterId, date },
        setClassData,
        setIsLoading
      );
  }

  function handleGetClassStudentData() {
    getClassStudentData(
      {
        sessionMasterId,
        date: moment(date).format("YYYY-MM-DD"),
        ...studentMasterData,
      },
      setStudentData,
      setLoading
    );
  }
  useEffect(() => {
    handleGetClassStudentData();
  }, [date, studentMasterData]);

  function onActionClick(row) {
    setDrawerTitle(
      `${row.className?.name} ${row.streamName?.name} ${row.sectionName?.name}`
    );
    setOpen(true);
    setStudentMasterData({
      classMasterId: row.className.id,
      streamMasterId: row.streamName.id,
      sectionMasterId: row.sectionName.id,
    });
  }

  useEffect(() => {
    isLoading && setClassData();
  }, [isLoading]);

  async function handleApplyAttendance() {
    const payload = studentAttendanceData
      .filter((it) => it.isPresent !== 2)
      .map((item) => {
        !item.isPresent && delete item.direction;
        return item;
      });

    const res = await createAttendance(
      { sendMessage: isNotify, data: payload },
      setAttendanceLoading
    );
    if (res.data.action) {
      const absent = studentAttendanceData.filter(
        (it) => it.isPresent === 0
      )?.length;
      const present = studentAttendanceData.filter(
        (it) => it.isPresent === 1
      )?.length;
      const noWorking = studentAttendanceData.filter(
        (it) => it.isPresent === 2
      )?.length;
      const updated = classData.map((it) => {
        if (
          it.className.id === studentMasterData.classMasterId &&
          it.sectionName.id === studentMasterData.sectionMasterId &&
          it.streamName.id === studentMasterData.streamMasterId
        ) {
          return { ...it, absent, present, noWorking };
        } else return it;
      });
      setClassData(updated);
      setModalOpen(false);
      setOpen(false);
    }
  }
  function onAllAttendance() {
    handleApplyAttendance();
  }

  return (
    <>
      <div className="card p-4 mb-4 ">
        <form
          onSubmit={handleGetDayData}
          className="flex items-center  sm:flex-wrap pt-4 gap-6"
        >
          <div className="inputBox w-[250px]">
            <input
              onChange={(e) => {
                setDate(e.target.value);
              }}
              required
              value={moment(date).format("YYYY-MM-DD")}
              max={moment(new Date()).format("YYYY-MM-DD")}
              type={"date"}
              className={`formControl`}
            />
            <label htmlFor={"id"}>
              Filter By Date <span className="text-red-600"> *</span>
            </label>
          </div>
          <button className="btn  btn-primary ">Get</button>
        </form>
      </div>

      <DrawerComponent
        open={open}
        setOpen={setOpen}
        title={drawerTitle}
        size={"900px"}
        body={
          <>
            <div className="mb-4 flex items-center justify-between md:flex-col md:items-end lg:gap-2">
              <div className="flex items-center justify-end gap-4 sm:gap-2">
                <span className="text-sm font-medium">
                  Total Student : {studentAttendanceData?.length}
                </span>
                <span className="text-sm font-medium text-[color:green] dark:text-green-500">
                  Total Present :{" "}
                  {
                    studentAttendanceData?.filter((it) => it?.isPresent === 1)
                      ?.length
                  }
                </span>
                <span className="text-sm font-medium text-[color:red]  dark:text-red-500">
                  Total Absent :{" "}
                  {
                    studentAttendanceData?.filter((it) => it?.isPresent === 0)
                      ?.length
                  }
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  id="attDate"
                  type="date"
                  className="opacity-0 w-0 pointer-events-none"
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                  value={date}
                />

                <Tippy content="Change Date">
                  <label
                    onClick={() => {
                      document.querySelector("#attDate").showPicker();
                    }}
                    htmlFor="date"
                    className="py-1.5 px-4 text-sm bg-slate-200  rounded-md font-semibold dark:bg-[color:var(--dark-bg-highlight)]"
                  >
                    {formatDate(date)}
                  </label>
                </Tippy>
                <Tippy content="Bulk Attendance">
                  <button
                    onClick={() => {
                      setModalOpen(true);
                    }}
                    type="button"
                    className=" text-[20px] hover:shadow-lg  text-white  bg-[color:var(--background)] py-1.5 px-2  rounded-md font-bold dark:bg-[color:var(--dark-bg-highlight)]"
                  >
                    <MdSpellcheck />
                  </button>
                </Tippy>
              </div>
            </div>
            {loading ? (
              <div className="h-[200px] flex justify-center items-center">
                <LoaderSpiner color={true} />
              </div>
            ) : (
              <>
                <Table columns={studentListColumns} data={studentData} />
                <div className="flex  justify-end gap-2  mt-4">
                  <div className="flex gap-2 items-center ">
                    <input
                      onChange={(e) => {
                        setIsNotify(Number(e.target.checked));
                      }}
                      checked={Number(isNotify)}
                      type="checkbox"
                      id="sendMessage"
                    />
                    <label htmlFor="sendMessage">Send Message</label>
                  </div>
                  <button
                    disabled={attendanceLoading}
                    className=" btn btn-primary "
                    onClick={handleApplyAttendance}
                  >
                    {attendanceLoading ? <LoaderSpiner /> : "Save Attendance"}
                  </button>
                  {/* <button
                    type="button"
                    disabled={notifyLoading}
                    className=" btn btn-primary "
                    onClick={sendPresentMessage}
                  >
                    {notifyLoading ? <LoaderSpiner /> : "Send Notification"}
                  </button> */}
                </div>
              </>
            )}
          </>
        }
      />

      <DailyAttendanceTable data={classData} onActionClick={onActionClick} />

      <Modal
        size={"400px"}
        backdrop={"static"}
        keyboard={false}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setAllPresent();
        }}
      >
        <Modal.Header
          className={`p-5 bg-[color:var(--background-light)] dark:bg-[color:var(--background-dark-light)]   `}
        >
          <Modal.Title className="capitalize">{"Mark  Attendance"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="p-4">
            <>
              <div className="flex gap-2 mb-2.5 items-center ">
                <input
                  type="radio"
                  className="accent-green-600 h-4 w-4 "
                  name="all"
                  onChange={(e) => {
                    setAllPresent(e.target.value);

                    setStudentAttendanceData(
                      studentAttendanceData.map((item) => {
                        return { ...item, isPresent: 1 };
                      })
                    );
                  }}
                  value={1}
                  id="present"
                />
                <label className="text-sm cursor-pointer" htmlFor="present">
                  Mark All Present
                </label>
              </div>
              <div className="flex gap-2 mb-2.5 items-center">
                <input
                  type="radio"
                  className="accent-red-600 h-4 w-4 "
                  name="all"
                  onChange={(e) => {
                    setAllPresent(e.target.value);
                    setStudentAttendanceData(
                      studentAttendanceData.map((item) => {
                        return { ...item, isPresent: 0 };
                      })
                    );
                  }}
                  value={0}
                  id="absent"
                />
                <label className="text-sm cursor-pointer" htmlFor="absent">
                  Mark All Absent
                </label>
              </div>
              {/* <div className="flex gap-2  items-center">
                <input
                  type="radio"
                  className="accent-blue-600 h-4 w-4 "
                  name="all"
                  onChange={(e) => {
                    setAllPresent(e.target.value);
                    setStudentAttendanceData(
                      studentAttendanceData.map((item) => {
                        return { ...item, isPresent: 2 };
                      })
                    );
                  }}
                  value={2}
                  id="notWorking"
                />
                <label className="text-sm cursor-pointer" htmlFor="notWorking">
                  Mark All Not Working
                </label>
              </div> */}
            </>

            <div className={`flex items-center gap-2 mt-5  justify-end`}>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setAllPresent();
                }}
                type="button"
                className=" btn btn-cancel"
              >
                Cancel
              </button>

              <button
                disabled={loading || !allPresent}
                onClick={onAllAttendance}
                type="button"
                className={`${
                  loading || !allPresent
                    ? "cursor-not-allowed pointer-events-none opacity-50"
                    : ""
                } btn btn-ok`}
              >
                {loading ? <LoaderSpiner /> : "Confirm"}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DailyAttendance;
