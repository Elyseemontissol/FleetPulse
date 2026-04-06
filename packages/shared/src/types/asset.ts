export const AssetTypes = [
  'sedan', 'suv', 'pickup', 'van', 'bus', 'truck',
  'heavy_truck', 'trailer', 'forklift', 'loader',
  'generator', 'mower', 'utility_cart', 'other',
] as const;

export type AssetType = (typeof AssetTypes)[number];

export const AssetCategories = ['vehicle', 'equipment'] as const;
export type AssetCategory = (typeof AssetCategories)[number];

export const AssetStatuses = [
  'active', 'in_shop', 'out_of_service', 'reserved', 'surplus', 'disposed',
] as const;
export type AssetStatus = (typeof AssetStatuses)[number];

export const FuelTypes = [
  'gasoline', 'diesel', 'electric', 'hybrid', 'propane', 'cng', 'none',
] as const;
export type FuelType = (typeof FuelTypes)[number];

export const OdometerUnits = ['miles', 'km'] as const;
export type OdometerUnit = (typeof OdometerUnits)[number];

export interface Asset {
  id: string;
  orgId: string;
  assetNumber: string;
  assetType: AssetType;
  category: AssetCategory;
  status: AssetStatus;

  // Vehicle identification
  vin?: string;
  licensePlate?: string;
  registrationExpiry?: string;

  // Specs
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  color?: string;
  fuelType?: FuelType;

  // Lifecycle
  acquisitionDate?: string;
  acquisitionCost?: number;
  disposalDate?: string;
  disposalMethod?: string;
  disposalValue?: number;

  // Assignment
  assignedDriverId?: string;
  assignedDepartment?: string;
  homeLocation?: string;

  // Meters
  currentOdometer: number;
  odometerUnit: OdometerUnit;
  currentHours: number;

  // Insurance
  insurancePolicy?: string;
  insuranceExpiry?: string;

  // Telematics
  telematicsDeviceId?: string;
  telematicsProvider?: string;

  // Metadata
  photoUrl?: string;
  notes?: string;
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AssetPosition {
  assetId: string;
  latitude: number;
  longitude: number;
  speedMph: number;
  heading: number;
  ignitionOn: boolean;
  address?: string;
  updatedAt: string;
}
