import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { loadFarmersMarkets, preprocessMarkets } from '../utils/dataLoader';
import 'leaflet/dist/leaflet.css';

const USAMap = () => {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    loadFarmersMarkets().then(raw => {
      setMarkets(preprocessMarkets(raw));
    });
  }, []);

  return (
    <div style={{ height: 500, borderRadius: 8, overflow: 'hidden' }}>
      <MapContainer
        center={[39.8283, -98.5795]} // Center of USA
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markets.map(m => (
          <CircleMarker
            key={m.FMID}
            center={[m.y, m.x]}
            radius={3}
            fillColor="#cc0088"
            color="#cc0088"
            fillOpacity={0.5}
            stroke={false}
          >
            <Popup>
              <b>{m.MarketName}</b><br />
              {m.city}, {m.State}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default USAMap;
