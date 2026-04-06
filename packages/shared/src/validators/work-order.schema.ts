import { z } from 'zod';
import { WorkOrderTypes, WorkOrderStatuses, Priorities, LineItemTypes } from '../types/work-order';

export const createWorkOrderSchema = z.object({
  assetId: z.string().uuid(),
  type: z.enum(WorkOrderTypes),
  pmScheduleId: z.string().uuid().optional(),
  inspectionId: z.string().uuid().optional(),
  priority: z.enum(Priorities).default('normal'),
  assignedTo: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  complaint: z.string().max(2000).optional(),
  scheduledDate: z.string().datetime().optional(),
  vendorName: z.string().max(200).optional(),
  notes: z.string().max(5000).optional(),
});

export const updateWorkOrderSchema = createWorkOrderSchema.partial().extend({
  status: z.enum(WorkOrderStatuses).optional(),
  cause: z.string().max(2000).optional(),
  correction: z.string().max(2000).optional(),
  vendorInvoice: z.string().max(100).optional(),
});

export const createLineItemSchema = z.object({
  lineType: z.enum(LineItemTypes),
  partNumber: z.string().max(100).optional(),
  partDescription: z.string().max(500).optional(),
  quantity: z.number().positive().default(1),
  unitCost: z.number().nonnegative().default(0),
  technicianId: z.string().uuid().optional(),
  laborHours: z.number().nonnegative().optional(),
  laborRate: z.number().nonnegative().optional(),
});

export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;
export type UpdateWorkOrderInput = z.infer<typeof updateWorkOrderSchema>;
export type CreateLineItemInput = z.infer<typeof createLineItemSchema>;
