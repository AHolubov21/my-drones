// components/DroneList.tsx

import React, { useState } from 'react';
import Image from 'next/image';
import { Drone } from '../data/drones';

type DroneListProps = {
  drones: Drone[];
  onSelectDrone: (drone: Drone) => void; // Функция для выбора дрона
};

const DroneList: React.FC<DroneListProps> = ({ drones, onSelectDrone }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Функция фильтрации дронов по запросу поиска
  const filteredDrones = drones.filter((drone) =>
    drone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    drone.id.includes(searchQuery)
  );

  // Обработчик изменения поля поиска
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="drone-list">
      <input
        type="text"
        placeholder="Search by name or ID"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />
      {filteredDrones.map(drone => (
        <div key={drone.id} className="drone-list-item" onClick={() => onSelectDrone(drone)}>
          <Image src={drone.icon} alt={drone.name} width={50} height={50} className="drone-icon" />
          <div className="drone-info">
            <h3 className="drone-name">{drone.name}</h3>
            <p>ID: {drone.id}</p>
            <p>Model: {drone.model}</p>
            <p>Status: {drone.status}</p>
            <p>Charge level: {drone.battery}%</p>
            {drone.averageSpeed && <p>Speed: {drone.averageSpeed} km/h</p>}
            {drone.batteryConsumptionRate && <p>Battery consumption: {drone.batteryConsumptionRate}% per km</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DroneList;
