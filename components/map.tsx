import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import { Drone } from '../data/drones';
import { customMapStyles } from './mapStyles';

type MapProps = {
  drones: Drone[];
  selectedDrone: Drone | null;
  onDroneSelect: (drone: Drone) => void;
  baseLocation: google.maps.LatLngLiteral;
  isMoveModeActive: boolean;
  onMoveToLocation: (location: google.maps.LatLngLiteral) => void;
};

type DronePositions = {
  [key: string]: google.maps.LatLngLiteral;
};

const Map: React.FC<MapProps> = ({ drones, selectedDrone, onDroneSelect, baseLocation, isMoveModeActive, onMoveToLocation }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry'],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [dronePositions, setDronePositions] = useState<DronePositions>({});
  const [animationPath, setAnimationPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState<number>(10); // Скорость анимации

  useEffect(() => {
    const initialPositions: DronePositions = drones.reduce((acc: DronePositions, drone) => {
      acc[drone.id] = drone.location;
      return acc;
    }, {});
    setDronePositions(initialPositions);
  }, [drones]);

  const animateDroneMovement = useCallback(async (droneId, destination) => {
    const drone = drones.find(d => d.id === droneId);
    if (!drone) return;

    const start = dronePositions[droneId];
    const frames = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(start),
      new google.maps.LatLng(destination)
    ) / animationSpeed; // Количество кадров зависит от расстояния и скорости анимации

    let currentFrame = 0;
    setAnimationPath([start, destination]); // Устанавливаем маршрут

    return new Promise(resolve => {
      const interval = setInterval(() => {
        const progress = currentFrame / frames;
        const lat = start.lat + (destination.lat - start.lat) * progress;
        const lng = start.lng + (destination.lng - start.lng) * progress;
        setDronePositions(prev => ({ ...prev, [droneId]: { lat, lng } }));

        if (++currentFrame > frames) {
          clearInterval(interval);
          setAnimationPath([]); // Очищаем маршрут после завершения анимации
          resolve(true);
        }
      }, 1000 / animationSpeed); // Периодичность кадров
    });
  }, [drones, dronePositions, animationSpeed]);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (isMoveModeActive && event.latLng && selectedDrone) {
      animateDroneMovement(selectedDrone.id, event.latLng.toJSON());
      onMoveToLocation(event.latLng.toJSON());
    }
  }, [isMoveModeActive, selectedDrone, onMoveToLocation, animateDroneMovement]);

  const handleGoHome = useCallback(() => {
    if (selectedDrone) {
      animateDroneMovement(selectedDrone.id, baseLocation);
    }
  }, [selectedDrone, baseLocation, animateDroneMovement]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {isLoaded && (
        <GoogleMap
          zoom={5}
          center={baseLocation}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            styles: customMapStyles,
            streetViewControl: false,
            scaleControl: false,
            mapTypeControl: false,
            panControl: false,
            zoomControl: false,
            rotateControl: false,
            fullscreenControl: false
          }}
          onLoad={(map) => { mapRef.current = map; }}
          onClick={handleMapClick}
        >
          {drones.map(drone => (
            <Marker
              key={drone.id}
              position={dronePositions[drone.id]}
              icon={{ url: drone.icon, scaledSize: new google.maps.Size(30, 30) }}
              onClick={() => onDroneSelect(drone)}
            />
          ))}
          <Marker
            position={baseLocation}
            icon={{ url: '/icons/base-icon.png', scaledSize: new google.maps.Size(50, 50) }}
            onClick={handleGoHome}
          />
          {animationPath.length > 0 && (
            <Polyline
              path={animationPath}
              options={{
                strokeColor: '#c07a61',
                strokeOpacity: 1,
                strokeWeight: 1,
                icons: [{
                  icon: { path: google.maps.SymbolPath.CIRCLE, scale: 4 },
                  offset: '0',
                  repeat: '20px'
                }],
              }}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
