import { z } from 'zod';
import { InspectionTypes, ItemStatuses, DefectSeverities } from '../types/inspection';

export const createInspectionSchema = z.object({
  assetId: z.string().uuid(),
  inspectionType: z.enum(InspectionTypes),
  odometerReading: z.number().int().nonnegative().optional(),
  hoursReading: z.number().nonnegative().optional(),
  location: z.string().max(200).optional(),
  notes: z.string().max(5000).optional(),
});

export const updateInspectionItemSchema = z.object({
  status: z.enum(ItemStatuses),
  severity: z.enum(DefectSeverities).optional(),
  defectDescription: z.string().max(1000).optional(),
});

export const submitInspectionSchema = z.object({
  inspectorSignature: z.string().min(1), // base64 encoded signature image
  notes: z.string().max(5000).optional(),
});

export const reviewInspectionSchema = z.object({
  reviewerSignature: z.string().min(1),
  reviewerNotes: z.string().max(5000).optional(),
});

export type CreateInspectionInput = z.infer<typeof createInspectionSchema>;
export type UpdateInspectionItemInput = z.infer<typeof updateInspectionItemSchema>;
export type SubmitInspectionInput = z.infer<typeof submitInspectionSchema>;
export type ReviewInspectionInput = z.infer<typeof reviewInspectionSchema>;
