import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#4ade80", "#60a5fa", "#f59e0b"];

export default function PlanChart({ data }) {
    return (
        <div className="w-full h-[340px]  rounded-2xl p-4 ">

            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                    >
                        {data?.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}