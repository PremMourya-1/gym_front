import { useContext, useEffect, useMemo, useState } from "react";
import getDashboardData from "./dashboardService";
import { ThemeContext } from "../../../Context/ThemeContext";
import Card from "../../../Components/Card/Card";
import RevenueChart from "./RevenueChart";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserPlus,
  FaRupeeSign,
  FaCalendarDay,
  FaUserTimes,
  FaVenusMars,
  FaExclamationCircle,
  FaBell,
  FaCog,
} from "react-icons/fa";

import toCamelCase from "../../../Utils/modifyString";
import { planColors } from "../../../Constant/Constant";
import Tippy from "@tippyjs/react";
import { useSelector } from "react-redux";

function Dashboard() {
  const { reload } = useContext(ThemeContext);
  const [data, setData] = useState();

  useEffect(() => {
    setData(); // Clear previous data while loading new data
    getDashboardData(setData);
  }, [reload]);

  const d = data;

  const borderColors = [
    "border-l-[#FF6B6B]", // red
    "border-l-[#4ECDC4]", // teal
    "border-l-[#FFD93D]", // yellow
    "border-l-[#6C5CE7]", // purple
    "border-l-[#00B894]", // green
    "border-l-[#FDCB6E]", // orange
    "border-l-[#0984E3]", // blue
    "border-l-[#E84393]", // pink
  ];

  const getRandomBorder = () =>
    borderColors[Math.floor(Math.random() * borderColors.length)];

  const borders = useMemo(() => Array(6).fill(0).map(getRandomBorder), []);

  const icons = [
    <FaUsers key={1} />, // total
    <FaUserPlus key={2} />, // this month
    <FaCalendarDay key={3} />, // today registered
    <FaRupeeSign key={4} />, // month collection
    <FaCalendarDay key={5} />, // today collection
    <FaUserTimes key={6} />, // expired
    <FaExclamationCircle key={7} />, // pending
    <FaVenusMars key={8} />, // gender
  ];

  const totalRevenue = d?.planDistribution?.reduce(
    (sum, p) => sum + (p.revenue || 0),
    0,
  );

  const actions = [
    {
      label: "Add Member",
      icon: <FaUserPlus />,
      link: "/clients/all/add-client",
      enabled: true,
    },
    {
      label: "Record Payment",
      icon: <FaRupeeSign />,
      link: "#",
      enabled: false,
    },
    {
      label: "Send Reminder",
      icon: <FaBell />,
      link: "#",
      enabled: false,
    },
    {
      label: "Settings",
      icon: <FaCog />,
      link: "/app-settings",
      enabled: true,
    },
  ];

  const user = useSelector((state) => state.auth);
  return (
    <div className="space-y-4">
      <div
        className="w-full relative capitalize border dark:border-none
  bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
  dark:from-gray-800 dark:via-gray-900 dark:to-black
  text-gray-800 dark:text-white p-4 rounded-2xl shadow-lg mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold">
          👋 Hello, {user?.username || "Gym Owner"}
        </h1>

        <p className="mt-2 text-sm md:text-base opacity-80">
          Welcome back! Ready to manage your gym today 💪
        </p>

        <span
          className="inline-block md:mt-4 absolute top-3 md:static h-max right-3 
    bg-black/10 dark:bg-white/20 
    px-3 py-1 text-sm rounded-full backdrop-blur"
        >
          🏋️ Gym Dashboard
        </span>
      </div>
      {/* 🔥 Top Summary Cards */}
      {/* 🔥 Top Summary Cards */}
      <div className="grid sm:grid-cols-2 xs:grid-cols-1 lg:grid-cols-3 grid-cols-4 gap-3">
        {/* Total Clients */}
        <Card
          className={`dashboardCard relative border-l-41 ${borders[0]} hover:-translate-y-1 hover:shadow-2xl transition-transform`}
        >
          <Link to={"clients/all"}>
            <div className="absolute top-3 right-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-3 rounded-xl text-lg">
              {icons[0]}
            </div>
            <p className="text-sm uppercase font-semibold">Total Clients</p>
            <p className="text-sm mb-1">All Time</p>
            <h2 className="text-xl font-semibold">{d?.totalClients || 0}</h2>
          </Link>
        </Card>

        {/* This Month Registered */}
        <Card className={`dashboardCard relative border-l-41 ${borders[1]}`}>
          <div className="absolute top-3 right-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 p-3 rounded-xl text-lg">
            {icons[1]}
          </div>
          <p className="text-sm uppercase font-semibold">
            This Month Registered
          </p>
          <p className="text-sm mb-1">New Clients</p>
          <h2 className="text-xl font-semibold">
            {d?.thisMonthRegistered || 0}
          </h2>
        </Card>

        {/* Today Registered */}
        <Card className={`dashboardCard relative border-l-41 ${borders[2]}`}>
          <div className="absolute top-3 right-3 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 p-3 rounded-xl text-lg">
            {icons[2]}
          </div>
          <p className="text-sm uppercase font-semibold">
            {`Today's`} Registered
          </p>
          <p className="text-sm mb-1">New Clients</p>
          <h2 className="text-xl font-semibold">{d?.todayRegistered || 0}</h2>
        </Card>

        {/* This Month Collection */}
        <Card className={`dashboardCard relative border-l-41 ${borders[3]}`}>
          <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 p-3 rounded-xl text-lg">
            {icons[3]}
          </div>
          <p className="text-sm uppercase font-semibold">
            This Month Collection
          </p>
          <p className="text-sm mb-1">Revenue</p>
          <h2 className="text-xl font-semibold text-[var(--success)]">
            ₹ {d?.thisMonthCollection || 0}
          </h2>
        </Card>

        {/* Today Collection */}
        <Card className={`dashboardCard relative border-l-41 ${borders[4]}`}>
          <div className="absolute top-3 right-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 p-3 rounded-xl text-lg">
            {icons[4]}
          </div>
          <p className="text-sm uppercase font-semibold">
            {`Today's`} Collection
          </p>
          <p className="text-sm mb-1">Revenue</p>
          <h2 className="text-xl font-semibold text-[var(--success)]">
            ₹ {d?.todayCollection || 0}
          </h2>
        </Card>

        {/* Expired */}
        <Card
          className={`dashboardCard relative border-l-41 ${borders[5]} hover:-translate-y-1 hover:shadow-2xl transition-transform`}
        >
          <Link to={"clients/expired"}>
            <div className="absolute top-3 right-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-xl text-lg">
              {icons[5]}
            </div>
            <p className="text-sm uppercase font-semibold">Expired</p>
            <p className="text-sm mb-1">Membership Ended</p>
            <h2 className="text-xl font-semibold text-[var(--danger)]">
              {d?.expired || 0}
            </h2>
          </Link>
        </Card>

        {/* Pending Payments */}
        <Card
          className={`dashboardCard relative border-l-41 ${borders[6]} hover:-translate-y-1 hover:shadow-2xl transition-transform`}
        >
          <Link to={"clients/pending-payments"}>
            <div className="absolute top-3 right-3 bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 p-3 rounded-xl text-lg">
              {icons[6]}
            </div>
            <p className="text-sm uppercase font-semibold">Pending Payments</p>
            <p className="text-sm mb-1">Total Due</p>
            <h2 className="text-xl font-semibold text-[var(--danger)]">
              ₹ {d?.totalPendingAmount || 0}
            </h2>
          </Link>
        </Card>

        {/* Gender */}
        <Card className={`dashboardCard relative border-l-41 ${borders[7]}`}>
          <div className="absolute top-3 right-3 bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 p-3 rounded-xl text-lg">
            {icons[7]}
          </div>
          <p className="text-sm uppercase font-semibold">Gender Ratio</p>
          <p className="text-sm mb-1">Male / Female</p>
          <h2 className="text-lg font-semibold">
            {d?.gender?.male || 0} / {d?.gender?.female || 0}
          </h2>
        </Card>
      </div>

      {/* 🔥 Recent Clients + Distribution */}
      <div className="grid grid-cols-12  gap-4">
        <Card shadow rounded className="col-span-8 lg:col-span-full">
          <h3 className="font-semibold mb-3 ">Last 12 {"Month's"} revenue</h3>
          <RevenueChart data={d?.last12MonthAnalytics} />
        </Card>
        <Card className="p-4 col-span-4 lg:col-span-full">
          <h3 className="font-semibold mb-4 text-[var(--text)]">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-4 items-start">
            {actions.map((a, i) => {
              const content = (
                <div
                  className={`p-5 rounded-xl flex flex-col items-center justify-center text-center transition-all
          ${
            a.enabled
              ? "bg-[var(--background-light)] hover:shadow-md hover:-translate-y-1 cursor-pointer"
              : "bg-[var(--background-light)] opacity-50 cursor-not-allowed"
          }`}
                >
                  {/* Icon */}
                  <div className="mb-3 bg-[var(--primary-tp)] text-[var(--primary)] p-3 rounded-xl text-lg">
                    {a.icon}
                  </div>

                  {/* Label */}
                  <p className="text-xs font-medium text-[var(--text)]">
                    {a.label}
                  </p>
                </div>
              );

              return a.enabled ? (
                <Link to={a.link} key={i}>
                  {content}
                </Link>
              ) : (
                <div key={i}>{content}</div>
              );
            })}
          </div>
        </Card>
        {/* <Card shadow rounded >
          <h3 className=" font-semibold mb-3 ">Client Distribution</h3>
          <PlanChart data={d?.planDistribution} />
        </Card> */}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
        {/* 🔥 Recent Payments */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[var(--text)]">
              Recent Payments
            </h3>
            {/* <span className="text-sm text-[var(--primary)] cursor-pointer">View All →</span> */}
          </div>

          <div className="">
            {d?.todaysRenewals?.length ? (
              d.todaysRenewals.map((p, i) => {
                const initials = toCamelCase(p.clientName)
                  ?.split(" ")
                  ?.map((w) => w[0])
                  ?.join("")
                  ?.slice(0, 2);

                return (
                  <div
                    key={i}
                    className="flex items-center last:pb-0 last:mb-0 last:border-none justify-between pb-4 mb-4 border-b border-color"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary-tp)] text-[var(--primary)] text-sm font-semibold">
                        {initials}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[var(--text)]">
                          {toCamelCase(p.clientName)}
                        </p>
                        <p className="text-xs text-[var(--text-light)]">
                          {p.plan} • Today
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[var(--success)]">
                        ₹ {p.paidAmount}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-[var(--text-light)]">
                No payments today
              </p>
            )}
          </div>
        </Card>

        {/* 🔥 Membership Plans */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 text-[var(--text)]">
            Membership Plans
          </h3>

          {/* 🔥 TOP STACKED BAR (REVENUE BASED) */}
          <div className="w-full h-2 bg-[var(--background-light)] rounded-full flex overflow-hidden mb-4">
            {d?.planDistribution?.map((p, i) => {
              const color = planColors[i % planColors.length];

              const percent = totalRevenue
                ? ((p.revenue || 0) / totalRevenue) * 100
                : 0;

              return (
                <Tippy
                  key={i}
                  content={
                    <div className="text-xs">
                      <p className="font-semibold">{toCamelCase(p.name)}</p>
                      <p>₹ {p.revenue || 0} /mo</p>
                      <p>{percent.toFixed(1)}%</p>
                    </div>
                  }
                  placement="top"
                  arrow={false}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      backgroundColor: color,
                    }}
                    className="h-full cursor-pointer"
                  />
                </Tippy>
              );
            })}
          </div>

          {/* 🔥 PLAN LIST */}
          <div className="space-y-4">
            {d?.planDistribution?.map((p, i) => {
              const color = planColors[i % planColors.length];

              return (
                <div
                  key={i}
                  className="mb-2 pb-2 border-color last:pb-0 border-b  last:!border-0 "
                >
                  {/* Top Row */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />

                      <div>
                        <p className="text-sm font-medium">
                          {toCamelCase(p.name)}
                        </p>
                        <p className="text-xs text-[var(--text-light)]">
                          {p.value} members
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-[var(--text)]">
                      ₹ {p.revenue || 0}
                      <span className="text-xs text-[var(--text-light)]">
                        {" "}
                        /mo
                      </span>
                    </p>
                  </div>

                  {/* Individual Progress */}
                  {/* <div className="w-full h-2 bg-[var(--background-light)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div> */}
                </div>
              );
            })}
          </div>

          {/* 🔥 TOTAL */}
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between items-center">
            <span className="text-sm text-[var(--text-light)]">
              Total Monthly
            </span>

            <span className="text-lg font-semibold text-[var(--primary)]">
              ₹ {totalRevenue}
              <span className="text-sm text-[var(--text-light)]"> /mo</span>
            </span>
          </div>
        </Card>

        <Card className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[var(--text)]">
              {" "}
              Expired Clients
            </h3>

            <Link
              to="/clients/expired"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              View All →
            </Link>
          </div>

          {/* List */}
          <div className="space-y-4">
            {d?.expiredClients?.length ? (
              d.expiredClients.slice(0, 5).map((c, i) => {
                const initials = toCamelCase(c.clientName)
                  ?.split(" ")
                  ?.map((w) => w[0])
                  ?.join("")
                  ?.slice(0, 2);

                return (
                  <div key={i} className="flex items-center justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10  h-10 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 text-sm font-semibold">
                        {initials}
                      </div>

                      {/* Info */}
                      <div>
                        <Link
                          to={`/clients/${c.id}`}
                          className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] capitalize"
                        >
                          {c.clientName}
                        </Link>

                        <p className="text-xs text-[var(--text-light)]">
                          +91 {c.mobileNo} • {c.daysExpired} days ago
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[var(--danger)]">
                        ₹ {c.pendingAmount || 0}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              // ✅ EMPTY STATE
              <div className="text-center py-6">
                <p className="text-sm text-[var(--text-light)]">
                  No expired clients
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
