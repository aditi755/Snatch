import React, {useState, useEffect} from 'react'
import PieChart from "../Profilepage/PieChart";
import SimpleWorldMap from "../Profilepage/Map";
import AgeRangeChart from "../Profilepage/AgeRangeChart";
const AudienceCard = () => {
  const [genderEndpoint, setGenderEndpoint] = useState("");
  const [ageEndpoint, setAgeEndpoint] = useState("");
  const [locationEndpoint, setLocationEndpoint] = useState("");

  useEffect(() => {
    const pathnameParts = window.location.pathname.split("/");
    const username =
      pathnameParts[pathnameParts.length - 1] ||
      pathnameParts[pathnameParts.length - 2];

    if (username) {
      setGenderEndpoint(`/api/public-portfolio/audience/genderDemographics?username=${username}`);
      setAgeEndpoint(`/api/public-portfolio/audience/allDemographics?username=${username}`);
      setLocationEndpoint(`/api/public-portfolio/audience/countryDemographics?username=${username}`);
    }
  }, []);

  return (
    <div className="lg:mt-10 w-full flex flex-col justify-center items-center mb-10">
    <h3 className="lg:text-6xl text-2xl font-qimano text-electric-blue text-center px-4 py-2 rounded-xl">
      Audience
    </h3>

    <p className="text-center text-lg font-qimano text-gray-600 mt-2 max-w-[600px]">
      Here are the demographics of your audience. This data is collected from your Instagram account and it will be visible to the public with your audience.
      </p>

    <div className='flex flex-col lg:flex-row gap-4 mt-5 lg:mt-1 w-full justify-center items-center lg:p-20'>
    {genderEndpoint && <PieChart apiEndpoint={genderEndpoint} />}
    {ageEndpoint && <AgeRangeChart apiEndpoint={ageEndpoint} />}
    {locationEndpoint && <SimpleWorldMap apiEndpoint={locationEndpoint} />}
    </div>

  </div>
  )
}

export default AudienceCard

