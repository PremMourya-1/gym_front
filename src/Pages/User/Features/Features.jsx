import Card from "../../../Components/Card/Card";

function Features() {
    const features = [
        {
            name: "Client Registration",
            desc: "Add new clients with plan & joining details",
            status: "Live",
        },
        {
            name: "All Clients List",
            desc: "View & manage all clients with filters",
            status: "Live",
        },
        {
            name: "Expired Clients",
            desc: "Auto list of expired plans for follow-up",
            status: "Live",
        },
        {
            name: "Dashboard Analytics",
            desc: "12 month revenue + client insights",
            status: "Live",
        },
        {
            name: "Plan Renewal",
            desc: "Renew plans in one click",
            status: "Live",
        },
        {
            name: "Attendance System",
            desc: "Track daily presence (manual/biometric)",
            status: "Upcoming",
        },
        {
            name: "Client Photo",
            desc: "Identify clients quickly via photo",
            status: "Upcoming",
        },
        {
            name: "Reward System",
            desc: "Give points to regular clients",
            status: "Upcoming",
        },
        {
            name: "Auto Reminders",
            desc: "WhatsApp/SMS before expiry",
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
                                <td className="p-3 font-medium text-[var(--text)]">
                                    {f.name}
                                </td>

                                <td className="p-3 text-[var(--muted)]">
                                    {f.desc}
                                </td>

                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${f.status === "Live"
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