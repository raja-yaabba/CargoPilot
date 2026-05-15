export type Shipment = {
  id: string;
  orderId: string;
  mode: "Road" | "Sea" | "Air";
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  hub: string;
  carrier: string;
  plannedDeparture: string;
  plannedArrival: string;
  actualArrival: string;
  delayDays: number;
  costEur: number;
  weightKg: number;
  volumeM3: number;
  priority: "Low" | "Medium" | "High";
  status: "Delivered" | "Delayed" | "In transit" | "At risk";
  delayReason: string;
  co2Kg: number;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  costPerKg: number;
  dataQualityFlag?: string | null;
};

const manualShipments: Shipment[] = [
  { id: "SHP-0001", orderId: "ORD-95181", mode: "Road", originCity: "Paris", originCountry: "France", destinationCity: "Madrid", destinationCountry: "Spain", originLat: 48.8566, originLng: 2.3522, destinationLat: 40.4168, destinationLng: -3.7038, hub: "Lyon Hub", carrier: "RoadFast Europe", plannedDeparture: "2024-05-01", plannedArrival: "2024-05-03", actualArrival: "2024-05-03", delayDays: 0, costEur: 1200, weightKg: 5000, volumeM3: 20, priority: "Medium", status: "Delivered", delayReason: "No delay", co2Kg: 350, riskScore: 10, riskLevel: "Low", costPerKg: 0.24, dataQualityFlag: null },
  { id: "SHP-0002", orderId: "ORD-95182", mode: "Sea", originCity: "Shanghai", originCountry: "China", destinationCity: "Rotterdam", destinationCountry: "Netherlands", originLat: 31.2304, originLng: 121.4737, destinationLat: 51.9225, destinationLng: 4.47917, hub: "Rotterdam Port", carrier: "OceanBridge", plannedDeparture: "2024-04-10", plannedArrival: "2024-05-15", actualArrival: "2024-05-20", delayDays: 5, costEur: 4500, weightKg: 25000, volumeM3: 60, priority: "Low", status: "Delayed", delayReason: "Port congestion", co2Kg: 1200, riskScore: 65, riskLevel: "Medium", costPerKg: 0.18, dataQualityFlag: null },
  { id: "SHP-0003", orderId: "ORD-95183", mode: "Air", originCity: "New York", originCountry: "USA", destinationCity: "Frankfurt", destinationCountry: "Germany", originLat: 40.7128, originLng: -74.0060, destinationLat: 50.1109, destinationLng: 8.6821, hub: "Frankfurt Airport", carrier: "SkyFreight Express", plannedDeparture: "2024-05-10", plannedArrival: "2024-05-11", actualArrival: "", delayDays: 2, costEur: 8500, weightKg: 1500, volumeM3: 10, priority: "High", status: "At risk", delayReason: "Weather disruption", co2Kg: 4500, riskScore: 85, riskLevel: "Critical", costPerKg: 5.66, dataQualityFlag: "Missing actual arrival" },
  { id: "SHP-0004", orderId: "ORD-95184", mode: "Road", originCity: "Berlin", originCountry: "Germany", destinationCity: "Warsaw", destinationCountry: "Poland", originLat: 52.5200, originLng: 13.4050, destinationLat: 52.2297, destinationLng: 21.0122, hub: "Berlin East Hub", carrier: "RoadFast Europe", plannedDeparture: "2024-05-12", plannedArrival: "2024-05-13", actualArrival: "", delayDays: 1, costEur: 800, weightKg: 2000, volumeM3: 15, priority: "Medium", status: "In transit", delayReason: "Road traffic", co2Kg: 150, riskScore: 30, riskLevel: "Medium", costPerKg: 0.4, dataQualityFlag: null },
  { id: "SHP-0005", orderId: "ORD-95185", mode: "Sea", originCity: "Singapore", originCountry: "Singapore", destinationCity: "Le Havre", destinationCountry: "France", originLat: 1.3521, originLng: 103.8198, destinationLat: 49.4944, destinationLng: 0.1079, hub: "Le Havre Port", carrier: "DeepSea Logistics", plannedDeparture: "2024-04-01", plannedArrival: "2024-05-05", actualArrival: "2024-05-12", delayDays: 7, costEur: 5200, weightKg: 18000, volumeM3: 45, priority: "High", status: "Delayed", delayReason: "Customs delay", co2Kg: 950, riskScore: 90, riskLevel: "Critical", costPerKg: 0.28, dataQualityFlag: null },
  { id: "SHP-0006", orderId: "ORD-95186", mode: "Air", originCity: "Tokyo", originCountry: "Japan", destinationCity: "London", destinationCountry: "UK", originLat: 35.6762, originLng: 139.6503, destinationLat: 51.5074, destinationLng: -0.1278, hub: "Heathrow Airport", carrier: "SkyFreight Express", plannedDeparture: "2024-05-14", plannedArrival: "2024-05-15", actualArrival: "", delayDays: 0, costEur: 15000, weightKg: 800, volumeM3: 5, priority: "High", status: "In transit", delayReason: "No delay", co2Kg: 5200, riskScore: 40, riskLevel: "Medium", costPerKg: 18.75, dataQualityFlag: "Abnormal transport cost" },
  { id: "SHP-0007", orderId: "ORD-95187", mode: "Road", originCity: "Milan", originCountry: "Italy", destinationCity: "Munich", destinationCountry: "Germany", originLat: 45.4642, originLng: 9.1900, destinationLat: 48.1351, destinationLng: 11.5820, hub: "Munich South Hub", carrier: "", plannedDeparture: "2024-05-13", plannedArrival: "2024-05-14", actualArrival: "", delayDays: 0, costEur: 950, weightKg: 3000, volumeM3: 18, priority: "Medium", status: "In transit", delayReason: "No delay", co2Kg: 180, riskScore: 20, riskLevel: "Low", costPerKg: 0.31, dataQualityFlag: "Missing carrier" },
  { id: "SHP-0008", orderId: "ORD-95188", mode: "Road", originCity: "Paris", originCountry: "France", destinationCity: "Madrid", destinationCountry: "Spain", originLat: 48.8566, originLng: 2.3522, destinationLat: 40.4168, destinationLng: -3.7038, hub: "Lyon Hub", carrier: "RoadFast Europe", plannedDeparture: "2024-05-01", plannedArrival: "2024-05-03", actualArrival: "2024-05-03", delayDays: -2, costEur: 1200, weightKg: -500, volumeM3: 20, priority: "Medium", status: "Delivered", delayReason: "No delay", co2Kg: 350, riskScore: 10, riskLevel: "Low", costPerKg: 0.24, dataQualityFlag: "Duplicate id" },
  { id: "SHP-0009", orderId: "ORD-95189", mode: "Sea", originCity: "Los Angeles", originCountry: "USA", destinationCity: "Tokyo", destinationCountry: "Japan", originLat: 34.0522, originLng: -118.2437, destinationLat: 35.6762, destinationLng: 139.6503, hub: "LA Port", carrier: "PacificWaves", plannedDeparture: "2024-04-20", plannedArrival: "2024-05-05", actualArrival: "2024-05-08", delayDays: 3, costEur: 3800, weightKg: 12000, volumeM3: 35, priority: "Medium", status: "Delayed", delayReason: "Carrier capacity issue", co2Kg: 800, riskScore: 50, riskLevel: "Medium", costPerKg: 0.31, dataQualityFlag: null },
  { id: "SHP-0010", orderId: "ORD-95190", mode: "Air", originCity: "Dubai", originCountry: "UAE", destinationCity: "Paris", destinationCountry: "France", originLat: 25.2048, originLng: 55.2708, destinationLat: 48.8566, destinationLng: 2.3522, hub: "Dubai Airport", carrier: "AirJet Logistics", plannedDeparture: "2024-05-15", plannedArrival: "2024-05-16", actualArrival: "", delayDays: 0, costEur: 6200, weightKg: 2000, volumeM3: 8, priority: "High", status: "In transit", delayReason: "No delay", co2Kg: 2800, riskScore: 35, riskLevel: "Low", costPerKg: 3.1, dataQualityFlag: null },
  { id: "SHP-0011", orderId: "ORD-95191", mode: "Road", originCity: "Prague", originCountry: "Czechia", destinationCity: "Vienna", destinationCountry: "Austria", originLat: 50.0755, originLng: 14.4378, destinationLat: 48.2082, destinationLng: 16.3738, hub: "Vienna North Hub", carrier: "GreenTrucking", plannedDeparture: "2024-05-10", plannedArrival: "2024-05-11", actualArrival: "2024-05-15", delayDays: 4, costEur: 650, weightKg: 4000, volumeM3: 25, priority: "Low", status: "Delayed", delayReason: "Documentation issue", co2Kg: 120, riskScore: 60, riskLevel: "High", costPerKg: 0.16, dataQualityFlag: null },
  { id: "SHP-0012", orderId: "ORD-95192", mode: "Sea", originCity: "Mumbai", originCountry: "India", destinationCity: "Antwerp", destinationCountry: "Belgium", originLat: 19.0760, originLng: 72.8777, destinationLat: 51.2194, destinationLng: 4.4025, hub: "Antwerp Port", carrier: "OceanBridge", plannedDeparture: "2024-03-15", plannedArrival: "2024-04-20", actualArrival: "2024-05-02", delayDays: 12, costEur: 4100, weightKg: 22000, volumeM3: 55, priority: "Medium", status: "Delivered", delayReason: "Weather disruption", co2Kg: 1100, riskScore: 78, riskLevel: "High", costPerKg: 0.18, dataQualityFlag: null }
];

const generateShipments = (count: number, startIdInt: number): Shipment[] => {
  const modes: Shipment["mode"][] = ["Road", "Sea", "Air"];
  const carriers = ["RoadFast Europe", "OceanBridge", "SkyFreight Express", "DeepSea Logistics", "AirJet Logistics", "GreenTrucking", "PacificWaves", "FastLane Logistics", "GlobalTransit", "EuroHaul", "AeroSwift", null];
  const delayReasons = ["Port congestion", "Customs delay", "Weather disruption", "Carrier capacity issue", "Road traffic", "Documentation issue", "Airport handling delay", "Warehouse bottleneck", "No delay"];
  const cities = [
    { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
    { city: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
    { city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
    { city: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
    { city: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
    { city: "Rotterdam", country: "Netherlands", lat: 51.9225, lng: 4.47917 },
    { city: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
    { city: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
    { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
    { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
    { city: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777 },
    { city: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437 }
  ];

  let res: Shipment[] = [];
  for (let i = 0; i < count; i++) {
    const id = startIdInt + i;
    const mode = modes[id % modes.length];
    const origin = cities[i % cities.length];
    const destination = cities[(i + 3) % cities.length];
    const carrier = carriers[i % carriers.length] || "";
    
    // Introduce some delay logic
    const isDelayed = (id % 5 === 0);
    const delayDays = isDelayed ? (id % 12) + 1 : 0;
    const delayReason = isDelayed ? delayReasons[id % (delayReasons.length - 1)] : "No delay";
    const status = isDelayed ? "Delayed" : (id % 7 === 0 ? "In transit" : "Delivered");
    
    // Cost logic
    let costEur = 1000 + (id % 4000);
    if (mode === 'Air') costEur *= 3;
    if (mode === 'Sea') costEur /= 2;

    const riskScore = delayDays > 0 ? Math.min(100, delayDays * 10 + (costEur > 5000 ? 20 : 0)) : (id % 15);
    let riskLevel: Shipment['riskLevel'] = "Low";
    if (riskScore > 80) riskLevel = "Critical";
    else if (riskScore > 50) riskLevel = "High";
    else if (riskScore > 20) riskLevel = "Medium";

    res.push({
      id: `SHP-${id.toString().padStart(4, '0')}`,
      orderId: `ORD-${95200 + id}`,
      mode,
      originCity: origin.city,
      originCountry: origin.country,
      destinationCity: destination.city,
      destinationCountry: destination.country,
      originLat: origin.lat,
      originLng: origin.lng,
      destinationLat: destination.lat,
      destinationLng: destination.lng,
      hub: `${origin.city} Hub`,
      carrier,
      plannedDeparture: "2024-05-10",
      plannedArrival: "2024-05-15",
      actualArrival: delayDays > 0 ? "" : "2024-05-15",
      delayDays,
      costEur: Math.round(costEur),
      weightKg: 1000 + (id % 5000),
      volumeM3: 5 + (id % 50),
      priority: id % 3 === 0 ? "High" : id % 2 === 0 ? "Medium" : "Low",
      status,
      delayReason,
      co2Kg: Math.round(costEur / 10),
      riskScore,
      riskLevel,
      costPerKg: Math.round((costEur / (1000 + (id % 5000))) * 100) / 100,
      dataQualityFlag: null
    });
  }
  return res;
};

export const shipments: Shipment[] = [...manualShipments, ...generateShipments(200, 13)];
