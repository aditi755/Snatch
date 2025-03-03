import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en); // Register English locale

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const SimpleWorldMap = () => {
  const [highlightedCountries, setHighlightedCountries] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await fetch("/api/profile/countryDemographics");
        const data = await response.json();
        if (data.success) {
          // Convert country codes to full country names and store with percentage
          const formattedCountries = data.countryDistribution
            .map(entry => ({
              name: countries.getName(entry.country, "en") || entry.country, // Get full name
              percentage: entry.percentage,
            }))
            .filter(entry => entry.name); // Remove invalid entries
        
          // Sort by percentage and take the top 4
          const sortedTop = formattedCountries
            .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
            .slice(0, 4);
        
          setHighlightedCountries(formattedCountries.map(c => c.name)); // Only names for map
          setTopCountries(sortedTop);
        }
        
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountryData();
  }, []);

  return (
    <div>
    <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }} width={800} height={400}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const countryName = geo.properties.name;
            const isHighlighted = highlightedCountries.includes(countryName);

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={isHighlighted ? "rgba(0, 0, 139, 1)" : "rgba(227, 227, 227, 1)"}
                stroke="#D6D6DA"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>

<div className="mt-10">
{topCountries.map((country, index) => (
  <div key={index} className="flex justify-between items-center border-b border-gray-300 py-3 font-apfel-grotesk-regular ml-3 mr-2">
    <span className="flex gap-5">
    <span className="text-gray-500 text-sm">0{index + 1}</span>
    <span className=" font-medium text-gray-500">{country.name}</span>
      </span>
    
    <span className="text-electric-blue ">{country.percentage}%</span>
  </div>
))}
</div>


</div>
  );
};

export default SimpleWorldMap;

