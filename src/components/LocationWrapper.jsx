import React from "react";
import LocationCard from "./LocationCard";

const LocationWrapper = ({
  topLocations,
  selectedLocationType,
  setSelectedLocationType,
}) => {
  return (
    <LocationCard
      topLocations={topLocations}
      selectedLocationType={selectedLocationType}
      setSelectedLocationType={setSelectedLocationType}
    />
  );
};

export default LocationWrapper;
