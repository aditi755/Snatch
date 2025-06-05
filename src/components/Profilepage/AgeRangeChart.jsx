import React, { useEffect, useState } from 'react';

const AgeRangeChart = ({ apiEndpoint }) => {
  const [ageData, setAgeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState('all');

  const defaultAgeGroups = ['13-17', '18-24', '25-34', '35-44', '45-54'];

  const fetchAgeData = async (selectedGender) => {
    setLoading(true);
    const getGenderedEndpoint = () => {
      if (selectedGender === 'all') return apiEndpoint;
      if (selectedGender === 'men') return apiEndpoint.replace('allDemographics', 'maleDemographics');
      if (selectedGender === 'women') return apiEndpoint.replace('allDemographics', 'femaleDemographics');
    };

    const endpoint = getGenderedEndpoint();

    try {
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.success) {
        const key =
          selectedGender === 'all'
            ? 'ageDistribution'
            : selectedGender === 'men'
            ? 'maleAgeData'
            : 'femaleAgeData';

        const receivedData = data[key] || [];

        const updatedAgeData = defaultAgeGroups.map((ageGroup) => {
          const found = receivedData.find((entry) => entry.age === ageGroup);
          return found ? found : { age: ageGroup, percentage: '0.00' };
        });

        setAgeData(updatedAgeData);
      }
    } catch (error) {
      console.error('Error fetching age data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgeData(selectedGender);
  }, [selectedGender]);

  if (loading) {
    return <p className="text-center text-gray-600 font-apfel-grotesk-regular">Loading...</p>;
  }

  return (
    <div className="w-full max-w-[360px] mx-auto px-3 font-apfel-grotesk-regular">
      {/* Gender Buttons */}
      <div className="flex justify-center gap-2 mb-12 sm:mb-14">
        {['all', 'men', 'women'].map((gender) => (
          <button
            key={gender}
            onClick={() => setSelectedGender(gender)}
            className={`px-3 sm:px-4 py-[6px] rounded-md text-xs sm:text-sm font-medium transition ${
              selectedGender === gender ? 'bg-[#0037EB] text-white' : 'bg-[#E5E7EB] text-[#333]'
            }`}
          >
            {gender.charAt(0).toUpperCase() + gender.slice(1)}
          </button>
        ))}
      </div>

      {/* Bars */}
      <div className="space-y-6">
        {ageData.map(({ age, percentage }, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            {/* Age label */}
            <span className="text-xs sm:text-sm text-[#0037EB] mb-[2px]">{age}</span>

            {/* Bar + Percentage */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 h-[5px] bg-[#e5e7f0] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-[#0037EB] rounded-full transition-all duration-300"
                  style={{ width: `${parseFloat(percentage)}%` }}
                />
              </div>
              <span className="text-xs sm:text-sm text-[#0037EB] w-[30px] sm:w-[38px] text-right">
                {parseFloat(percentage).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgeRangeChart;
