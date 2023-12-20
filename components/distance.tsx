// components/distance.tsx

import React from 'react';

type DistanceProps = {
  distance: number; // Distance in meters
  duration: number; // Duration in seconds
  batteryCapacity: number; // Battery capacity in km/%
  consumptionRate: number; // Battery consumption per km  
};

// Functions for calculations
const calculateBatteryConsumption = (distance: number, batteryCapacity: number, consumptionRate: number): number => {
  // Convert distance to kilometers for calculation
  const distanceInKm = distance / 1000;
  return (distanceInKm * consumptionRate) / batteryCapacity;
};

const calculateETA = (distance: number, averageSpeed: number): number => {
  // Convert distance to kilometers and speed to km/h
  const distanceInKm = distance / 1000;
  return distanceInKm / averageSpeed;
};

const Distance: React.FC<DistanceProps> = ({ distance, duration, batteryCapacity, consumptionRate }) => {
  // Average drone flight speed (km/h), will be replaced with a more accurate value later
  const averageSpeed = 50;
  
  // Calculations
  const distanceInKm = distance / 1000; // Convert to kilometers
  const batteryConsumption = calculateBatteryConsumption(distance, batteryCapacity, consumptionRate);
  const eta = calculateETA(distance, averageSpeed); // Time in hours
  
  return (
    <div>
      <p>Distance: {distanceInKm.toFixed(2)} км</p>
      <p>Estimated delivery time: {eta.toFixed(2)} ч</p>
      <p>Battery consumption: {batteryConsumption.toFixed(2)}%</p>
    </div>
  );
};

export default Distance;
