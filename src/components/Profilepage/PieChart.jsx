import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const data = {
   
    datasets: [
      {
        data: [60,3, 40,3], // 60% for Women, 40% for Men
        backgroundColor: [
          '#0037EB', // Dark blue for Women
           'transparent',
          'rgba(0, 55, 235, 0.5)', // Light blue for Men
          'transparent',
        ],
        borderColor: [
          '#0037EB', 
          'transparent',
          'rgba(0, 55, 235, 0.5)', 
          'transparent',
        ],
        borderWidth: -10, 
        circumference: 360, 
        rotation: -90, 
        borderRadius: 10, // Rounded edges for segments
        spacing: 0, // No spacing between segments
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gender Distribution',
      },
    },
    cutout: '83%', // Adjust the size of the inner cutout
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;

