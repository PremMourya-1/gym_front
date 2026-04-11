import moment from "moment";
import Table from "../../../../../Components/Table/Table";
import { useEffect, useState } from "react";

function BulkStudentTable({ data, oldData, checkedValues, setCheckedValues }) {
  const [allChecked, setAllChecked] = useState();

  useEffect(() => {
    setAllChecked(true);
    let trueObj = {};
    data.forEach((item) => {
      trueObj[item.id] = true;
    });
    setCheckedValues(trueObj);
  }, []);

  useEffect(() => {
    if (
      Object.values(checkedValues)?.length === data?.length &&
      Object.values(checkedValues)?.every((item) => item === true)
    ) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [checkedValues]);
  function handleChange(e) {
    const value = e.target.checked;
    const id = e.target.id;

    if (id === "all") {
      if (value) {
        setAllChecked(true);
        let trueObj = {};
        data.forEach((item) => {
          trueObj[item.id] = true;
        });

        setCheckedValues(trueObj);
      } else {
        let falseObj = {};
        data.forEach((item) => {
          falseObj[item.id] = false;
        });
        setCheckedValues(falseObj);
        setAllChecked(false);
      }
    } else {
      setCheckedValues({ ...checkedValues, [id]: value });
    }
  }

  function isExistInDb(row, type) {
    const isExist = oldData.some((item) => Number(item[type]) === row[type]);

    return isExist ? true : false;
  }

  const admissionNumbersInXlFile = {};
  function isAdmExistInData(row) {
    if (admissionNumbersInXlFile[row.admissionNo]) {
      return true;
    } else {
      admissionNumbersInXlFile[row.admissionNo] = true;

      return false;
    }
  }
  const admissionNumbersInXlFile2 = {};
  function isAdmExistInData2(row) {
    if (admissionNumbersInXlFile2[row.admissionNo]) {
      return true;
    } else {
      admissionNumbersInXlFile2[row.admissionNo] = true;

      return false;
    }
  }
  const deviceIdExistInXl = {};
  function isAdmExistInData3(row) {
    if (deviceIdExistInXl[row.deviceId]) {
      return true;
    } else {
      deviceIdExistInXl[row.deviceId] = true;
      return false;
    }
  }
  const deviceIdExistInXl2 = {};
  function isDeviceExistInData2(row) {
    if (deviceIdExistInXl2[row.deviceId]) {
      return true;
    } else {
      deviceIdExistInXl2[row.deviceId] = true;
      return false;
    }
  }

  const columns = [
    {
      title: () => {
        return (
          <>
            <input
              id="all"
              type="checkbox"
              className="form-check-input h-4 w-4 accent-[color:var(--primary-dark)] "
              onChange={handleChange}
              checked={allChecked}
            />
          </>
        );
      },
      width: "80px",
      selector: (row, index) => {
        return (
          <>
            {isExistInDb(row, "admissionNo") ||
            isExistInDb(row, "deviceId") ||
            isDeviceExistInData2(row) ||
            isAdmExistInData(row, index) ? (
              <>
                <input
                  type="checkbox"
                  className="form-check-input h-4 w-4  opacity-40"
                  id={row.id}
                  onChange={handleChange}
                  checked={false}
                  disabled
                />
              </>
            ) : (
              <input
                type="checkbox"
                className="form-check-input h-4 w-4 accent-[color:var(--primary-dark)] "
                id={row.id}
                onChange={handleChange}
                checked={
                  checkedValues && !isExistInDb(row, "admissionNo")
                    ? checkedValues[row.id]
                    : false
                }
              />
            )}
          </>
        );
      },
    },
    {
      title: "Adm No.",
      width: "115px",
      selector: (row) => {
        const admExist = oldData?.some(
          (item) => item.admissionNo === row.admissionNo
        );

        return (
          <>
            {admExist ? (
              <span
                className={` gap-2 h-3 w-3  flex  justify-center rounded-full bg-red-600  items-center`}
              ></span>
            ) : (
              isAdmExistInData2(row) && (
                <span
                  className={` gap-2 h-3 w-3  flex  justify-center rounded-full bg-yellow-600  items-center`}
                ></span>
              )
            )}
            {row.admissionNo}
          </>
        );
      },
    },
    {
      title: "Device Id",
      width: "115px",
      selector: (row) => {
        const deviceIdExist = oldData?.some(
          (item) => Number(item.deviceId) === row.deviceId
        );
        return (
          <>
            {deviceIdExist ? (
              <span
                className={` gap-2 h-3 w-3  flex  justify-center rounded-full bg-red-600  items-center`}
              ></span>
            ) : (
              isAdmExistInData3(row) && (
                <span
                  className={` gap-2 h-3 w-3  flex  justify-center rounded-full bg-yellow-600  items-center`}
                ></span>
              )
            )}
            {row.deviceId}
          </>
        );
      },
    },

    {
      title: "Adm Date",
      selector: (row) => moment(row.admissionDate).format("DD-MM-YYYY"),
    },

    {
      title: "Student Name",
      selector: (row) => row.studentName,
    },

    {
      title: "Father's Name",
      selector: (row) => row.fathersName,
    },

    {
      title: "Primary Mobile No",
      selector: (row) => row.primaryMobileNo,
    },
    {
      title: "Email",
      selector: (row) => row.email,
    },
    {
      title: "Addres",
      selector: (row) => row.address,
    },
  ];
  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
}

export default BulkStudentTable;
