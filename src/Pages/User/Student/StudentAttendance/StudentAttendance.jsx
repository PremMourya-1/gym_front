import { Tabs } from "rsuite";
import DailyAttendance from "./DailyAttendance/DailyAttendance";
import MonthlyAttendance from "./MonthlyAttendance/MonthlyAttendance";
import BiometricAttendance from "./BiometricAttendance/BiometricAttendance";
import BreadCrumb from "../../../../Components/Common/BreadCrumb/BreadCrumb";

function StudentAttendance() {
  // const tab
  return (
    <>
      <div className="breadCrumbAndSearchBar">
        <BreadCrumb />
      </div>
      <Tabs
        className="rounded-lg w-full"
        defaultActiveKey="1"
        appearance="pills"
      >
        <Tabs.Tab eventKey="1" title="Daily Attendance">
          <DailyAttendance />
        </Tabs.Tab>
        <Tabs.Tab eventKey="2" title="Monthly Attendance">
          <MonthlyAttendance />
        </Tabs.Tab>
        <Tabs.Tab eventKey="3" title="Biometric Attendance">
          <BiometricAttendance />
        </Tabs.Tab>
      </Tabs>
    </>
  );
}

export default StudentAttendance;
