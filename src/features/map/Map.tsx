import { useEffect } from 'react';
import { MapContainer, GeoJSON, TileLayer, useMapEvents } from 'react-leaflet';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchMapDataAsync, filterOnZoom, selectMapData } from './mapSlice';

function UnwrappedMap() {
  const mapData = useAppSelector(selectMapData);
  const dispatch = useAppDispatch();
  const map = useMapEvents({
    zoomend: () => {
      dispatch(
        filterOnZoom([
          map.getBounds().getNorth(),
          map.getBounds().getSouth(),
          map.getBounds().getEast(),
          map.getBounds().getWest()
        ])
      );
    }
  });

  useEffect(() => {
    dispatch(fetchMapDataAsync());
  }, [dispatch]);

  return (
    <>
      {mapData && (
        <GeoJSON
          key={mapData?.features?.length ?? 'default'}
          data={mapData}
          markersInheritOptions={false}
          style={{ weight: 10 }}
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
