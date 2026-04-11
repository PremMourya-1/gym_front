import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";

export default function RevenueChart({ data }) {
    return (
        <div className="w-full h-[360px]  pb-2 ">


            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />
                    <YAxis />

                    {/* ✅ Custom Tooltip (₹ + clean labels) */}
                    <Tooltip
                        formatter={(value) => `₹${value}`}
                        labelFormatter={(label) => `Month: ${label}`}
                    />

                    {/* ✅ Capitalized Labels */}
                    <Legend
                        formatter={(value) => {
                            const map = {
                                revenue: "Revenue",
                                expected: "Expected",
                                discount: "Discount",
                                pending: "Pending",
                            };
                            return map[value] || value;
                        }}
                    />

                    {/* Revenue */}
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#22c55e"
                        strokeWidth={2}
                    />

                    {/* Expected */}
                    <Line
                        type="monotone"
                        dataKey="expected"
                        name="Expected"
                        stroke="var(--primary)"
                        strokeWidth={3}
                    />

                    {/* Discount */}
                    <Line
                        type="monotone"
                        dataKey="discount"
                        name="Discount"
                        stroke="#eab308"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                    />

                    {/* Pending */}
                    <Line
                        type="monotone"
                        dataKey="pending"
                        name="Pending"
                        stroke="#dc2626"
                        strokeWidth={2}
                    />

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}