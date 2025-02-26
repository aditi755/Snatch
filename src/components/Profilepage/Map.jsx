import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const SimpleWorldMap = () => {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 100,
      }}
      width={800}
      height={400}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="rgba(0, 55, 235, 0.5)"
              stroke="#D6D6DA"
            />
          ))
        }
      </Geographies>

      {/* Example Marker for a data point */}
      <Marker coordinates={[ -74.006, 40.7128 ]}>
        <circle r={5} fill="#FF5533" />
        <text textAnchor="middle" y={-10} style={{ fontFamily: 'system-ui', fill: '#5D5A6D' }}>
          New York
        </text>
      </Marker>
    </ComposableMap>
  );
};

export default SimpleWorldMap;