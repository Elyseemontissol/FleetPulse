export const TelematicsEventTypes = [
  'position', 'ignition_on', 'ignition_off', 'speeding',
  'harsh_brake', 'harsh_accel', 'idle', 'geofence_enter',
  'geofence_exit', 'dtc', 'low_battery',
] as const;
export type TelematicsEventType = (typeof TelematicsEventTypes)[number];

export interface TelematicsEvent {
  id: number;
  assetId: string;
  deviceId: string;
  eventType: TelematicsEventType;
  latitude?: number;
  longitude?: number;
  speedMph?: number;
  heading?: number;
  odometer?: number;
  engineHours?: number;
  fuelLevelPct?: number;
  dtcCodes?: string[];
  rawData?: Record<string, unknown>;
  recordedAt: string;
}

export const FuelTransactionSources = [
  'manual', 'wex', 'fleetcor', 'voyager', 'comdata',
] as const;
export type FuelTransactionSource = (typeof FuelTransactionSources)[number];

export interface FuelTransaction {
  id: number;
  orgId: string;
  assetId?: string;
  driverId?: string;
  transactionDate: string;
  fuelType?: string;
  quantityGallons: number;
  unitPrice?: number;
  totalCost: number;
  odometerAtFill?: number;
  stationName?: string;
  stationAddress?: string;
  latitude?: number;
  longitude?: number;
  source: FuelTransactionSource;
  externalTransactionId?: string;
  mpg?: number;
  receiptUrl?: string;
  createdAt: string;
}
