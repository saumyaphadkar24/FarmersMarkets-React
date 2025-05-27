import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';

// Helper: fit map bounds when a state is clicked
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds);
  }, [bounds, map]);
  return null;
}

const DensityChoropleth = () => {
  const [statesGeo, setStatesGeo] = useState(null);
  const [selectedStateBounds, setSelectedStateBounds] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  // Load states.geojson
  useEffect(() => {
    fetch('/states.geojson')
      .then(res => res.json())
      .then(setStatesGeo);
  }, []);

  // Handle state click
  const onStateClick = (event) => {
    const layer = event.target;
    const bounds = layer.getBounds();
    setSelectedStateBounds(bounds);
    setSelectedState(layer.feature.properties.STATEFP); // or use NAME for state name
  };

  // Style function: highlight if selected or hovered, else normal
  const style = (feature) => ({
    fillColor:
      selectedState === feature.properties.STATEFP
        ? "#FF56B7"
        : hoveredState === feature.properties.STATEFP
        ? "#FFB7E0"
        : "#cccccc",
    weight: 1,
    color: 'black',
    fillOpacity:
      selectedState === feature.properties.STATEFP
        ? 0.4
        : hoveredState === feature.properties.STATEFP
        ? 0.25
        : 0.15,
    dashArray: '2',
  });

  // Event handlers for GeoJSON features
  const onEachFeature = (feature, layer) => {
    layer.on({
      click: onStateClick,
      mouseover: function () {
        setHoveredState(feature.properties.STATEFP);
        layer.setStyle({
          fillColor: "#FFB7E0",
          fillOpacity: 0.25,
        });
      },
      mouseout: function () {
        setHoveredState(null);
        layer.setStyle(style(feature));
      },
    });
  };

  return (
    <div style={{ height: 500, borderRadius: 8, overflow: 'hidden', minWidth: 400 }}>
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {statesGeo &&
          <GeoJSON
            data={statesGeo}
            style={style}
            onEachFeature={onEachFeature}
          />
        }
        {/* Fit bounds when state is selected */}
        {selectedStateBounds && <FitBounds bounds={selectedStateBounds} />}
      </MapContainer>
    </div>
  );
};

export default DensityChoropleth;
