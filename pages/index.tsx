// pages/index.tsx

import React, { useState, useCallback } from 'react';
import Map from '../components/map';
import DroneList from '../components/DroneList';
import DroneDetails from '../components/DroneDetails';
import { Drone, drones as dronesData, baseLocation } from '../data/drones';

const IndexPage: React.FC = () => {
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  const [drones, setDrones] = useState<Drone[]>(dronesData);
  const [isMoveModeActive, setIsMoveModeActive] = useState(false); // Состояние для активации режима перемещения

  const calculateEta = (drone: Drone, destination: google.maps.LatLngLiteral): number | undefined => {
    if (!drone.averageSpeed) return undefined;
    // Реализация функции расчета ETA
    // ...
  };

  const handleSelectDrone = useCallback((drone: Drone) => {
    setSelectedDrone(drone);
    setIsMoveModeActive(false);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedDrone(null);
  }, []);

  const handleDroneCommand = async (command: string, droneId: string, additionalData?: any) => {
    const droneIndex = drones.findIndex(d => d.id === droneId);
    if (droneIndex === -1) return;

    let updatedDrone = { ...drones[droneIndex] };

    switch (command) {
      case 'move':
        if (additionalData?.destination) {
          const speed = updatedDrone.averageSpeed || 0; // Значение по умолчанию для speed
          updatedDrone = {
            ...updatedDrone,
            status: 'on a way',
            route: {
              ...updatedDrone.route,
              destination: additionalData.destination,
              eta: calculateEta(updatedDrone, additionalData.destination),
              speed: speed
            }
          };
        }
        break;
      case 'wait':
        updatedDrone = { ...updatedDrone, status: 'waiting' };
        break;
      case 'home':
        updatedDrone = {
          ...updatedDrone,
          status: 'on a way',
          route: {
            ...updatedDrone.route,
            destination: baseLocation,
            eta: calculateEta(updatedDrone, baseLocation),
            speed: updatedDrone.averageSpeed || 0
          }
        };
        break;
      default:
        console.log(`Command ${command} is not recognized.`);
    }

    setDrones(drones => drones.map(d => d.id === droneId ? updatedDrone : d));
  };

  const onMoveToLocation = (location: google.maps.LatLngLiteral) => {
    if (selectedDrone) {
      handleDroneCommand('move', selectedDrone.id, { destination: location });
      setIsMoveModeActive(false);
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <DroneList drones={drones} onSelectDrone={handleSelectDrone} />
      </div>
      <div className="map-container">
        <Map
          drones={drones}
          selectedDrone={selectedDrone}
          onDroneSelect={handleSelectDrone}
          baseLocation={baseLocation}
          isMoveModeActive={isMoveModeActive}
          onMoveToLocation={onMoveToLocation}
        />
      </div>
      {selectedDrone && (
        <div className="sidebar-right">
          <DroneDetails
            drone={selectedDrone}
            onClose={handleCloseDetails}
            onCommand={handleDroneCommand}
            setIsMoveModeActive={setIsMoveModeActive}
          />
        </div>
      )}
    </div>
  );
};

export default IndexPage;
