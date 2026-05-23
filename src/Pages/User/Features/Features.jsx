import Card from "../../../Components/Card/Card";

function Features() {
  const features = [
    {
      name: "Client Registration & Profile",
      desc: "Add and manage member profile with plan, joining date, and photo",
      status: "Live",
    },
    {
      name: "All Clients List",
      desc: "Search, filter, and manage all active members",
      status: "Live",
    },
    {
      name: "Expired Clients",
      desc: "Auto-segment expired memberships for quick follow-up",
      status: "Live",
    },
    {
      name: "Pending Payments",
      desc: "Track clients with pending dues and recover payments",
      status: "Live",
    },
    {
      name: "Plan Management",
      desc: "Create and manage gym plans with pricing and duration",
      status: "Live",
    },
    {
      name: "Plan Renewal",
      desc: "Renew memberships quickly with pending/discount support",
      status: "Live",
    },
    {
      name: "Bulk Upload Members",
      desc: "Import members from Excel with mapping, validation, and rejected row reasons",
      status: "Live",
    },
    {
      name: "Smart Gender Handling",
      desc: "Use Excel gender when available, else predict from first name with manual override",
      status: "Live",
    },
    {
      name: "Smart Plan Detection",
      desc: "Auto-select nearest plan by paid amount when plan is not mapped directly",
      status: "Live",
    },
    {
      name: "Auto Discount Calculation",
      desc: "If discount is missing and paid amount is lower than plan price, discount is auto-calculated",
      status: "Live",
    },
    {
      name: "Dashboard Analytics",
      desc: "12 month revenue + client insights",
      status: "Live",
    },
    {
      name: "Subscription Plans & Billing",
      desc: "Subscription management for software plan lifecycle",
      status: "Live",
    },
    {
      name: "Attendance System",
      desc: "Daily attendance tracking with manual + biometric support",
      status: "Upcoming",
    },
    {
      name: "Automated Reminder Engine",
      desc: "Auto WhatsApp/SMS reminders for renewals, dues, and inactivity",
      status: "Upcoming",
    },
    {
      name: "Receipt & Invoice Module",
      desc: "Generate and share printable/digital receipts for every transaction",
      status: "Upcoming",
    },
    {
      name: "Staff & Access Management",
      desc: "Role-based access for reception, trainer, and admin operations",
      status: "Upcoming",
    },
    {
      name: "Advanced Reports Export",
      desc: "Export monthly revenue, collection, and retention reports in Excel/PDF",
      status: "Upcoming",
    },
    {
      name: "Member Engagement & Rewards",
      desc: "Reward points and retention programs for regular members",
      status: "Upcoming",
    },
  ];

  return (
    <Card className="">
      <h2 className="text-lg font-semibold mb-4 text-[var(--primary)]">
        Features Overview
      </h2>

      <div className="overflow-hidden border border-[var(--border)] rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[var(--background-light)] text-left">
            <tr>
              <th className="p-3">Feature</th>
              <th className="p-3">Description</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {features.map((f, i) => (
              <tr
                key={i}
                className="border-t border-[var(--border)] hover:bg-[var(--primary-tp)] transition"
              >
                <td className="p-3 font-medium text-[var(--text)]">{f.name}</td>

                <td className="p-3 text-[var(--muted)]">{f.desc}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      f.status === "Live"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {f.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default Features;
