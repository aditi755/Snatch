import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/profile/genderDemographics"); // Update with your actual API route
        const data = await response.json();
        
        if (!data.demographics) throw new Error("Invalid API Response");

        // Extract gender percentages
        const { male, female } = data.demographics;

        setChartData({
          labels: ["Male", "Female" ],
          datasets: [
            {
              data: [parseFloat(male), parseFloat(female)],
              backgroundColor: [
                '#0037EB',
                'rgba(0, 55, 235, 0.5)', 
              ],
              borderColor: [
                '#0037EB', 
                'rgba(0, 55, 235, 0.5)', 
              ],
              borderWidth: -10, 
              circumference: 360, 
              rotation: -90, 
              borderRadius: 10,
              spacing: 8, 
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching demographics:", error.message);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 32, 
        },
      },
      title: {
        display: false,
        text: "Gender Distribution",
      },
    },
    cutout: "83%", 
  };

  return (
    <>
    {chartData ? (
      <div className="flex flex-col items-center">
        {/* Pie Chart */}
        <Doughnut data={chartData} options={options} />

        {/* Gender Percentages Below the Chart */}
        <div className="mt-4 flex gap-3 text-black">
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-2 "
              
            ></span>
          {chartData.datasets[0].data[0].toFixed(1)}%
          </div>

          <div className="flex items-center gap-2">
            <span
              className="w-8 h-2 "
              
            ></span>
           {chartData.datasets[0].data[1].toFixed(1)}%
          </div>
        </div>
      </div>
    ) : (
      <p>Loading...</p>
    )}

    
    </>
  );
};

export default DoughnutChart;
