import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ chartData }) => {
  const data = {
    labels: chartData?.classes,
    datasets: [
      {
        label: "Present",
        data: chartData?.present,
        borderColor: "rgba(22, 163, 74, 0.8)",
        backgroundColor: "rgba(22, 163, 74, 0.2)",
        fill: true,
        tension: 0.4, // Smooth line
      },
      {
        label: "Absent",
        data: chartData?.absent,
        borderColor: "rgba(220, 38, 38, 0.8)",
        backgroundColor: "rgba(220, 38, 38, 0.2)",

        fill: true,
        tension: 0.4, // Smooth line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        // text: 'Three Line Chart Example',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
