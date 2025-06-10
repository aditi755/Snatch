import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ apiEndpoint }) => {
  const [chartData, setChartData] = useState(null);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        if (!data.demographics) throw new Error("Invalid API Response");

        const { male, female } = data.demographics;
        const high = Math.max(male, female);

        if (high === male) {
          setTotalFollowers(male);
          setDisplayText("Men");
        } else {
          setTotalFollowers(female);
          setDisplayText("Women");
        }

        setChartData({
          labels: ["Male", "Female"],
          datasets: [
            {
              data: [parseFloat(male), parseFloat(female)],
              backgroundColor: ["#0037EB", "rgba(0, 55, 235, 0.3)"],
              borderColor: ["#0037EB", "rgba(0, 55, 235, 0.3)"],
              borderWidth: 0,
              circumference: 360,
              rotation: -90,
              borderRadius: 50,
              spacing: 6,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching demographics:", error.message);
      }
    };

    fetchData();
  }, []);

  // Plugin to add center text
  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
      const { width, height, ctx } = chart;
      ctx.restore();

      ctx.font = `bold ${Math.round(height / 8)}px 'Apfel Grotezk', sans-serif`;
      ctx.fillStyle = "#0037EB";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(totalFollowers.toLocaleString(), width / 2, height / 2 - 10);

      ctx.font = `${Math.round(height / 20)}px 'Open Sans', sans-serif`;
      ctx.fillStyle = "#666";
      ctx.fillText(displayText, width / 2, height / 2 + 20);
      ctx.save();
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    cutout: "78%",
  };

  return (
    <>
      {chartData ? (
        <div className="flex flex-col items-center w-full px-4 py-6">
          {/* Doughnut Chart */}
          <div className="relative w-[230px] h-[230px]">
            <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
          </div>

          {/* Gender Legend */}
          <div className="mt-6 flex justify-between w-full max-w-[240px] text-sm font-apfel-grotesk-regular">
            {/* Male */}
            <div className="flex flex-col items-center gap-1 ml-8">
              <div className="flex items-center gap-2">
                <span className="w-6 h-1.5 bg-[#0037EB] rounded-full"></span>
                <span className="text-[#0037EB]">Men</span>
              </div>
              <span className="text-black ml-7">
                {chartData.datasets[0].data[0].toFixed(1)}%
              </span>
            </div>

            {/* Female */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-1.5 bg-[rgba(0,55,235,0.3)] rounded-full"></span>
                <span className="text-[#888]">Women</span>
              </div>
              <span className="text-black ml-8">
                {chartData.datasets[0].data[1].toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-sm text-center">Loading...</p>
      )}
    </>
  );
};

export default DoughnutChart;
