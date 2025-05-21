import React, { useState, useEffect } from "react";
import PieChart from "../Profilepage/PieChart";
import SimpleWorldMap from "../Profilepage/Map";
import AgeRangeChart from "../Profilepage/AgeRangeChart";
import generateAudienceInsights from "@/utils/generateAudienceInsights";
import { usePathname } from "next/navigation";
const AudienceCard = () => {
  const [genderEndpoint, setGenderEndpoint] = useState("");
  const [ageEndpoint, setAgeEndpoint] = useState("");
  const [locationEndpoint, setLocationEndpoint] = useState("");
  const [insights, setInsights] = useState("");
  const [demographicData, setDemographicData] = useState({
    genderData: {},
    ageData: [],
    countryData: [],
  });
  const pathname = usePathname();

  useEffect(() => {
    const fetchAllDemographics = async (username) => {
      try {
        const [genderRes, ageRes, countryRes] = await Promise.all([
          fetch(`/api/public-portfolio/audience/genderDemographics?username=${username}`),
          fetch(`/api/public-portfolio/audience/allDemographics?username=${username}`),
          fetch(`/api/public-portfolio/audience/countryDemographics?username=${username}`),
        ]);

        const [genderData, ageData, countryData] = await Promise.all([
          genderRes.json(),
          ageRes.json(),
          countryRes.json(),
        ]);

        const combinedData = {
          genderData: genderData.demographics,
          ageData: ageData.ageDistribution,
          countryData: countryData.countryDistribution,
        };

        setDemographicData(combinedData);
        const generatedInsights = await generateAudienceInsights(combinedData);
        setInsights(generatedInsights);
      } catch (error) {
        console.error("Error fetching demographics:", error);
      }
    };

    const parts = pathname.split("/").filter(Boolean);
    const username = parts[0];
   
    if (username) {
      setGenderEndpoint(`/api/public-portfolio/audience/genderDemographics?username=${username}`);
      setAgeEndpoint(`/api/public-portfolio/audience/allDemographics?username=${username}`);
      setLocationEndpoint(`/api/public-portfolio/audience/countryDemographics?username=${username}`);
      fetchAllDemographics(username);
    }
  }, []);

  return (
    <div className="lg:mt-10 w-full flex flex-col justify-center items-center mb-10">
      <h3 className="lg:text-6xl text-2xl font-qimano text-electric-blue text-center px-4 py-2 rounded-xl">
        Audience
      </h3>

      {/* AI-generated insights */}
      {insights ? (
        <div className="mx-auto">
          <div className="text-gray-700 whitespace-pre-line text-center text-lg font-qimano mt-2">
            {insights}
          </div>
        </div>
      ) : (
        <div className="mx-auto space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
        </div>
      )}

<div className="flex flex-col lg:flex-row gap-4 mt-6 w-full px-4 lg:px-20 justify-center items-stretch">
  {/* Gender */}
  {genderEndpoint && (
    <div className="bg-gray-100 shadow-md rounded-xl p-4 w-full lg:w-1/3 flex flex-col items-center justify-between min-h-[350px]">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Gender</h3>
      <PieChart apiEndpoint={genderEndpoint} />
    </div>
  )}

  {/* Age Range */}
  {ageEndpoint && (
    <div className="bg-gray-100 shadow-md rounded-xl p-4 w-full lg:w-1/3 flex flex-col items-center justify-between min-h-[350px]">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Age Range</h3>
      <AgeRangeChart apiEndpoint={ageEndpoint} />
    </div>
  )}

  {/* Location */}
  {locationEndpoint && (
    <div className="bg-gray-100 shadow-md rounded-xl p-4 w-full lg:w-1/3 flex flex-col items-center justify-between min-h-[350px]">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Top Locations</h3>
      <SimpleWorldMap apiEndpoint={locationEndpoint} />
    </div>
  )}
</div>

    </div>
  );
};

export default AudienceCard;
