export const UserRoles = [
  'admin',
  'fleet_manager',
  'shop_supervisor',
  'mechanic',
  'driver',
  'viewer',
] as const;

export type UserRole = (typeof UserRoles)[number];

export interface User {
  id: string;
  orgId: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  employeeId?: string;
  driverLicenseNumber?: string;
  driverLicenseExpiry?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
