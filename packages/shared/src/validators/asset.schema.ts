import { z } from 'zod';
import { AssetTypes, AssetCategories, AssetStatuses, FuelTypes, OdometerUnits } from '../types/asset';

export const createAssetSchema = z.object({
  assetNumber: z.string().min(1).max(50),
  assetType: z.enum(AssetTypes),
  category: z.enum(AssetCategories),
  status: z.enum(AssetStatuses).default('active'),
  vin: z.string().max(17).optional(),
  licensePlate: z.string().max(20).optional(),
  registrationExpiry: z.string().datetime().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  make: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  trim: z.string().max(100).optional(),
  color: z.string().max(50).optional(),
  fuelType: z.enum(FuelTypes).optional(),
  acquisitionDate: z.string().datetime().optional(),
  acquisitionCost: z.number().nonnegative().optional(),
  assignedDriverId: z.string().uuid().optional(),
  assignedDepartment: z.string().max(100).optional(),
  homeLocation: z.string().max(200).optional(),
  currentOdometer: z.number().int().nonnegative().default(0),
  odometerUnit: z.enum(OdometerUnits).default('miles'),
  currentHours: z.number().nonnegative().default(0),
  insurancePolicy: z.string().max(100).optional(),
  insuranceExpiry: z.string().datetime().optional(),
  telematicsDeviceId: z.string().max(100).optional(),
  telematicsProvider: z.string().max(50).optional(),
  photoUrl: z.string().url().optional(),
  notes: z.string().max(2000).optional(),
  customFields: z.record(z.unknown()).optional(),
});

export const updateAssetSchema = createAssetSchema.partial();

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
