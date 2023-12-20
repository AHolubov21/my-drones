// data/drones.ts

export type Drone = {
  id: string;
  name: string;
  model: string;
  icon: string;
  status: 'waiting' | 'on a way';
  battery: number;
  averageSpeed?: number;
  batteryConsumptionRate?: number;
  payload?: {
    weight: number;
    description: string;
  };
  route?: {
    speed: number;
    destination: google.maps.LatLngLiteral;
    eta?: number;
  };
  location: google.maps.LatLngLiteral;
};

export const drones: Drone[] = [
  { id: '2110', name: 'Drone 1', model: 'DJI Mavic 2 Pro', icon: '/icons/drone1.png', status: 'on a way', battery: 65, location: { lat: 33.651070, lng: -19.347015 }, averageSpeed: 30, batteryConsumptionRate: 0.1, payload: { weight: 0.5, description: 'Camera' } },
  { id: '2462', name: 'Drone 2', model: 'DJI Mavic 2 Pro', icon: '/icons/drone2.png', status: 'waiting', battery: 37, location: { lat: 61.651070, lng: -39.347015 }, averageSpeed: 45, batteryConsumptionRate: 0.2, payload: { weight: 0.5, description: 'Camera' } },
  { id: '8563', name: 'Drone 3', model: 'DJI Mavic 2 Pro', icon: '/icons/drone3.png', status: 'on a way', battery: 92, location: { lat: 67.651070, lng: -69.347015 }, averageSpeed: 12, batteryConsumptionRate: 0.1, payload: { weight: 0.5, description: 'Camera' } },
  { id: '4464', name: 'Drone 4', model: 'DJI Mavic 2 Pro', icon: '/icons/drone4.png', status: 'waiting', battery: 84, location: { lat: 10.651070, lng: -35.347015 }, averageSpeed: 17, batteryConsumptionRate: 0.11, payload: { weight: 0.5, description: 'Camera' } },
  { id: '5313', name: 'Drone 5', model: 'DJI Mavic 2 Pro', icon: '/icons/drone5.png', status: 'on a way', battery: 73, location: { lat: 49.651070, lng: -89.347015 }, averageSpeed: 24, batteryConsumptionRate: 0.12, payload: { weight: 0.5, description: 'Camera' } },
  { id: '1246', name: 'Drone 6', model: 'DJI Mavic 2 Pro', icon: '/icons/drone3.png', status: 'waiting', battery: 98, location: { lat: 39.651070, lng: -46.347015 }, averageSpeed: 33, batteryConsumptionRate: 0.15, payload: { weight: 0.5, description: 'Camera' } },
  // Examples of drones with new fields
  // ... 
];

export const baseLocation: google.maps.LatLngLiteral = { lat: 63.408201, lng: -45.051031 };

// Utility function to calculate ETA based on distance and speed
const calculateEta = (distance: number, speed: number): number => {
  return distance / (speed * 1000 / 3600); // Convert speed to m/s and calculate ETA
};

// Function to update drone information with new status and destination
const updateDroneInfo = (drone: Drone, newStatus: 'waiting' | 'on a way', destination?: google.maps.LatLngLiteral) => {
  drone.status = newStatus;
  if (destination && newStatus === 'on a way' && drone.averageSpeed) {
    // Assuming google.maps is available in the global scope
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(drone.location),
      new google.maps.LatLng(destination)
    );
    drone.route = {
      speed: drone.averageSpeed,
      destination: destination,
      eta: calculateEta(distance, drone.averageSpeed),
    };
  } else {
    delete drone.route;
  }
};

// Function to set a drone to 'waiting' status
export const waitDrone = (droneId: string): void => {
  const drone = drones.find(d => d.id === droneId);
  if (drone) {
    updateDroneInfo(drone, 'waiting');
  }
};

// Function to command a drone to return to the base location
export const returnDroneHome = (droneId: string): void => {
  const drone = drones.find(d => d.id === droneId);
  if (drone) {
    updateDroneInfo(drone, 'on a way', baseLocation);
  }
};

// Function to command a drone to move to a new location
export const moveToLocation = (droneId: string, newLocation: google.maps.LatLngLiteral): void => {
  const drone = drones.find(d => d.id === droneId);
  if (drone) {
    updateDroneInfo(drone, 'on a way', newLocation);
  }
};