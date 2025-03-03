

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AgeRangeChart = () => {
  const [ageData, setAgeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState('all'); // Default is 'all'
  
  const defaultAgeGroups = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]; // Ensure all appear

  const fetchAgeData = async (selectedGender) => {
    setLoading(true);
    const endpoint =
      selectedGender === "all"
        ? "/api/profile/allDemographics"
        : selectedGender === "men"
        ? "/api/profile/maleDemographics"
        : "/api/profile/femaleDemographics";

    try {
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.success) {
        const key =
          selectedGender === "all" ? "ageDistribution" : selectedGender === "men" ? "maleAgeData" : "femaleAgeData";

        const receivedData = data[key] || [];

        // ✅ Ensure all age groups are included, even if missing from API
        const updatedAgeData = defaultAgeGroups.map((ageGroup) => {
          const found = receivedData.find((entry) => entry.age === ageGroup);
          return found ? found : { age: ageGroup, percentage: "0.00" }; // Add missing groups with 0%
        });

        setAgeData(updatedAgeData);
      }
    } catch (error) {
      console.error("Error fetching age data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAgeData(selectedGender);
  }, [selectedGender]); // Re-fetch when gender changes

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  // Prepare Data for Chart
  const chartData = {
    labels: ageData.map((entry) => entry.age),
    datasets: [
      {
        label: 'Age Range Distribution',
        data: ageData.map((entry) => entry.percentage),
        backgroundColor: '#0037EB',
        borderColor: '#0037EB',
        borderWidth: 0,
        barThickness: 10,
        borderRadius: 5,
      },
    ],
  };

  // Chart Options
  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        display: false,
        grid: { display: false },
      },
      y: {
        display: true,
        grid: { display: false },
        ticks: {
          font: { size: 14, weight: 'bold' },
          color: '#0037EB',
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      {/* Gender Selection Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        {['all', 'men', 'women'].map((gender) => (
          <button
            key={gender}
            onClick={() => setSelectedGender(gender)}
            style={{
              padding: '4px 16px',
              borderRadius: '5px',
              border: '1px solid #0037EB',
              backgroundColor: selectedGender === gender ? '#0037EB' : 'transparent',
              color: selectedGender === gender ? '#fff' : '#0037EB',
              cursor: 'pointer',
              transition: '0.3s',
            }}
          >
            {gender.charAt(0).toUpperCase() + gender.slice(1)}
          </button>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '300px' }}>
        <div style={{ width: '60%', height: '100%', marginLeft: '24px' }}>
          <Bar data={chartData} options={options} />
        </div>

        {/* Percentage Labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginLeft: '10px' }}>
          {chartData.datasets[0].data.map((value, index) => (
            <span key={index} style={{ fontSize: '12px', color: 'black' }}>
              {value}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgeRangeChart;

