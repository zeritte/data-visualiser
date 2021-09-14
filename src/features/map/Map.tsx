import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchMapDataAsync, selectMapData } from './mapSlice';

function UnwrappedMap() {
  const mapData = useAppSelector(selectMapData);
  const dispatch = useAppDispatch();
  const map = useMap();

  useEffect(() => {
    dispatch(fetchMapDataAsync());
  }, [dispatch]);

  return (
    <>
      {mapData && (
        <GeoJSON
          data={mapData}
          markersInheritOptions={false}
          style={{ weight: 10 }}
          eventHandlers={{
            click: (e) => {
              console.log('marker clicked', e);
            }
          }}
        />
      )}
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </>
  );
}

export function Map() {
  return (
    <MapContainer center={[-28.016666, 153.399994]} zoom={10}>
      <UnwrappedMap />
    </MapContainer>
  );
}
