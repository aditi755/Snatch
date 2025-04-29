import React, {useState, useEffect} from 'react'
import PieChart from "../Profilepage/PieChart";
import SimpleWorldMap from "../Profilepage/Map";
import AgeRangeChart from "../Profilepage/AgeRangeChart";
import generateAudienceInsights from "@/utils/generateAudienceInsights";
const AudienceCard = () => {
  const [genderEndpoint, setGenderEndpoint] = useState("");
  const [ageEndpoint, setAgeEndpoint] = useState("");
  const [locationEndpoint, setLocationEndpoint] = useState("");
  const [insights, setInsights] = useState("");
  const [demographicData, setDemographicData] = useState({
    genderData: {},
    ageData: [],
    countryData: []
  });

  useEffect(() => {
    const fetchAllDemographics = async (username) => {
      try {
        // Fetch all demographic data with username
        const [genderRes, ageRes, countryRes] = await Promise.all([
          fetch(`/api/public-portfolio/audience/genderDemographics?username=${username}`),
          fetch(`/api/public-portfolio/audience/allDemographics?username=${username}`),
          fetch(`/api/public-portfolio/audience/countryDemographics?username=${username}`)
        ]);

        const [genderData, ageData, countryData] = await Promise.all([
          genderRes.json(),
          ageRes.json(),
          countryRes.json()
        ]);

        const combinedData = {
          genderData: genderData.demographics,
          ageData: ageData.ageDistribution,
          countryData: countryData.countryDistribution
        };

        setDemographicData(combinedData);

        // Generate insights using the combined data
        const generatedInsights = await generateAudienceInsights(combinedData);
        setInsights(generatedInsights);

      } catch (error) {
        console.error("Error fetching demographics:", error);
      }
    };

    // Get username from URL
    const pathnameParts = window.location.pathname.split("/");
    const username = pathnameParts[pathnameParts.length - 1] || 
                    pathnameParts[pathnameParts.length - 2];

    if (username) {
      setGenderEndpoint(`/api/public-portfolio/audience/genderDemographics?username=${username}`);
      setAgeEndpoint(`/api/public-portfolio/audience/allDemographics?username=${username}`);
      setLocationEndpoint(`/api/public-portfolio/audience/countryDemographics?username=${username}`);
      
      // Fetch all demographics data
      fetchAllDemographics(username);
    }
  }, []);


  return (
    <div className="lg:mt-10 w-full flex flex-col justify-center items-center mb-10">
    <h3 className="lg:text-6xl text-2xl font-qimano text-electric-blue text-center px-4 py-2 rounded-xl">
      Audience
    </h3>
   
   {/* show ai generated insights here */}

          {insights ? (
            <div className="mx-auto">
              <div className="text-gray-700 whitespace-pre-line text-center text-lg font-qimano mt-2 ">
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

    <div className='flex flex-col lg:flex-row gap-4 mt-5 lg:mt-1 w-full justify-center items-center lg:p-20'>
    {genderEndpoint && <PieChart apiEndpoint={genderEndpoint} />}
    {ageEndpoint && <AgeRangeChart apiEndpoint={ageEndpoint} />}
    {locationEndpoint && <SimpleWorldMap apiEndpoint={locationEndpoint} />}
    </div>

  </div>
  )
}

export default AudienceCard

