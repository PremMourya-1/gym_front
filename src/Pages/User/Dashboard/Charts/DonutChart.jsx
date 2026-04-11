import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const data = {
    // labels: ["Present", "Absent", "Leave"],
    datasets: [
      {
        label: "Votes",
        data: [500, 119, 90],
        backgroundColor: [

          "rgba(22, 163, 74, 0.8)",
          "rgba(220, 38, 38, 0.8)",
          "rgba(15, 176, 230, 0.8)",
        ],
        borderColor: [
          "rgba(22, 163, 74, 0.8)",
          "rgba(220, 38, 38, 0.8)",
          "rgba(15, 176, 230, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "60%", margin: "auto" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DonutChart;
