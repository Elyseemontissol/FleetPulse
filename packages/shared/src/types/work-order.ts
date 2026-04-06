export const WorkOrderTypes = [
  'preventive', 'corrective', 'inspection_defect', 'emergency', 'recall',
] as const;
export type WorkOrderType = (typeof WorkOrderTypes)[number];

export const WorkOrderStatuses = [
  'open', 'assigned', 'in_progress', 'on_hold',
  'parts_pending', 'completed', 'closed', 'cancelled',
] as const;
export type WorkOrderStatus = (typeof WorkOrderStatuses)[number];

export const Priorities = ['low', 'normal', 'high', 'critical'] as const;
export type Priority = (typeof Priorities)[number];

export const LineItemTypes = ['part', 'labor', 'other'] as const;
export type LineItemType = (typeof LineItemTypes)[number];

export interface WorkOrder {
  id: string;
  orgId: string;
  workOrderNumber: string;
  assetId: string;
  type: WorkOrderType;
  pmScheduleId?: string;
  inspectionId?: string;
  status: WorkOrderStatus;
  priority: Priority;

  requestedBy?: string;
  assignedTo?: string;

  title: string;
  description?: string;
  complaint?: string;
  cause?: string;
  correction?: string;

  odometerAtCreation?: number;
  hoursAtCreation?: number;

  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;

  totalPartsCost: number;
  totalLaborCost: number;
  totalOtherCost: number;

  vendorName?: string;
  vendorInvoice?: string;

  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderLine {
  id: number;
  workOrderId: string;
  lineType: LineItemType;
  partNumber?: string;
  partDescription?: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  technicianId?: string;
  laborHours?: number;
  laborRate?: number;
  createdAt: string;
}

export interface PMSchedule {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  intervalMiles?: number;
  intervalHours?: number;
  intervalDays?: number;
  intervalMonths?: number;
  appliesToTypes?: string[];
  appliesToAssets?: string[];
  estimatedLaborHours?: number;
  estimatedCost?: number;
  taskChecklist?: string[];
  partsNeeded?: Array<{ partNumber: string; description: string; qty: number }>;
  priority: Priority;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
