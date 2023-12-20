import React from 'react';
import Image from 'next/image';
import { Drone } from '../data/drones';

type DroneDetailsProps = {
  drone: Drone | null;
  onClose: () => void;
  onCommand: (command: string, droneId: string, additionalData?: any) => void;
  setIsMoveModeActive: (isMoveModeActive: boolean) => void;
};

const DroneDetails: React.FC<DroneDetailsProps> = ({ drone, onClose, onCommand, setIsMoveModeActive }) => {
  const handleWaitHere = () => {
    if (drone) {
      onCommand('wait', drone.id);
      setIsMoveModeActive(false);
    }
  };

  // Эта функция активирует режим перемещения
  const handleMoveTo = () => {
    if (drone) {
      // Установим флаг isMoveModeActive в true, чтобы карта перешла в режим выбора позиции
      setIsMoveModeActive(true);
    }
  };

  // Эта функция отправит команду для возвращения дрона на базу
  const handleGoHome = () => {
    if (drone) {
      // Отправляем команду 'home' и идентификатор дрона, чтобы начать движение к базе
      onCommand('home', drone.id);
      setIsMoveModeActive(false);
    }
  };

  if (!drone) {
    return <div>Select a drone to display details</div>;
  }

  return (
    <div className="drone-details">
      <div className="close-button" onClick={onClose}>×</div>
      <Image src={drone.icon} alt={drone.name} width={100} height={100} />
      <h2>{drone.name}</h2>
      <p>ID: {drone.id}</p>
      <p>Model: {drone.model}</p>
      <p>Charge: {drone.battery}%</p>
      <div className="battery-status">
        <div className="battery-level" style={{ width: `${drone.battery}%` }}></div>
      </div>
      {drone.payload && <p>Cargo: {drone.payload.description}</p>}
      {drone.route && <p>Speed: {drone.route.speed} mph</p>}
      <button className="button" onClick={handleWaitHere}>Wait Here</button>
      <button className="button" onClick={handleMoveTo}>Move To</button>
      <button className="button" onClick={handleGoHome}>Go Home</button>
    </div>
  );
};

export default DroneDetails;
