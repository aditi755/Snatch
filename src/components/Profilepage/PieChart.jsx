import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const [chartData, setChartData] = useState(null);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [displayText, setDisplayText] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/profile/genderDemographics"); // Update with your actual API route
        const data = await response.json();
        
        if (!data.demographics) throw new Error("Invalid API Response");

        // Extract gender percentages
        const { male, female, unknown } = data.demographics;  
        const high = Math.max(male,female)
        console.log("high",high)
        if (high === male) {
          setTotalFollowers(male) 
          setDisplayText("Man")
          } else {
              setTotalFollowers(female);
              setDisplayText("Women");
        }  

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


  // Plugin to add center text
  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
      const { width, height, ctx } = chart;
      ctx.restore();
      
      // Center text styling
      ctx.font = `bold ${Math.round(height / 10)}px sans-serif`; // Adjust font size dynamically
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      const totalText = totalFollowers; // Hardcoded total
      const textX = width / 2;
      const textY = height / 2 - 32;

      ctx.fillStyle = "#0037EB"; // Blue text color
      ctx.fillText(totalText, textX, textY);
      ctx.font = `${Math.round(height / 20)}px sans-serif`;
      ctx.fillStyle = "#666"; // Grey subtext
      ctx.fillText(displayText, textX, textY + 25);
      
      ctx.save();
    },
  };
  
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
      tooltip: {
        enabled: false, // Disable tooltip
      },
    },
    cutout: "83%", // Creates the hole in the center of the doughnut
  };
  return (
    <>
    {chartData ? (
      <div className="flex flex-col items-center">
        {/* Pie Chart */}
        <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />


        {/* Gender Percentages Below the Chart */}
        <div className="mt-4 flex gap-3 text-black">
          <div className="flex items-center gap-2" style={{fontFamily: "Open Sans"}}>
            <span
              className="w-8 h-2 "
              
            ></span>
          {chartData.datasets[0].data[0].toFixed(1)}%
          </div>

          <div className="flex items-center gap-2" style={{fontFamily: "Open Sans"}}>
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
