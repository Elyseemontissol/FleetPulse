export const InspectionTypes = [
  'pre_trip', 'post_trip', 'annual', 'dot', 'monthly', 'ad_hoc',
] as const;
export type InspectionType = (typeof InspectionTypes)[number];

export const InspectionStatuses = [
  'in_progress', 'submitted', 'reviewed', 'defects_resolved', 'closed',
] as const;
export type InspectionStatus = (typeof InspectionStatuses)[number];

export const InspectionResults = [
  'pass', 'fail', 'pass_with_defects',
] as const;
export type InspectionResult = (typeof InspectionResults)[number];

export const ItemStatuses = [
  'pass', 'fail', 'not_applicable', 'not_inspected',
] as const;
export type ItemStatus = (typeof ItemStatuses)[number];

export const DefectSeverities = ['minor', 'major', 'critical'] as const;
export type DefectSeverity = (typeof DefectSeverities)[number];

export interface Inspection {
  id: string;
  orgId: string;
  assetId: string;
  inspectionType: InspectionType;
  status: InspectionStatus;
  result?: InspectionResult;

  inspectorId: string;
  inspectorSignature?: string;
  inspectorSignedAt?: string;

  reviewerId?: string;
  reviewerSignature?: string;
  reviewerSignedAt?: string;
  reviewerNotes?: string;

  odometerReading?: number;
  hoursReading?: number;

  location?: string;
  notes?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionItem {
  id: number;
  inspectionId: string;
  category: string;
  itemName: string;
  status: ItemStatus;
  severity?: DefectSeverity;
  defectDescription?: string;
  photoUrls?: string[];
  sortOrder: number;
}

export const DVIR_CATEGORIES = [
  'Air Compressor',
  'Air Lines',
  'Battery',
  'Body',
  'Brakes',
  'Clutch',
  'Coupling Devices',
  'Defroster/Heater',
  'Drive Line',
  'Engine',
  'Exhaust',
  'Fifth Wheel',
  'Fluid Levels',
  'Frame and Assembly',
  'Front Axle',
  'Fuel Tanks',
  'Horn',
  'Lights',
  'Mirrors',
  'Muffler',
  'Oil Pressure',
  'Radiator',
  'Rear End',
  'Reflectors',
  'Safety Equipment',
  'Starter',
  'Steering',
  'Suspension',
  'Tires',
  'Transmission',
  'Wheels and Rims',
  'Windows',
  'Windshield Wipers',
  'Other',
] as const;
