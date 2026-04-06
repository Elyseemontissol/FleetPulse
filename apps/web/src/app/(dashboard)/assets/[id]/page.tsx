'use client';

import { Header } from '@/components/layout/Header';
import Link from 'next/link';
import {
  ArrowLeft, Car, Wrench, ClipboardCheck, Fuel,
  MapPin, Calendar, User, Activity,
} from 'lucide-react';

export default function AssetDetailPage({ params }: { params: { id: string } }): React.JSX.Element {
  // Placeholder - will be replaced with API calls
  const asset = {
    id: params.id,
    asset_number: 'V-0342',
    make: 'Ford',
    model: 'F-150 XLT',
    year: 2023,
    vin: '1FTFW1E89NFA12345',
    license_plate: 'NY ABC-1234',
    color: 'White',
    fuel_type: 'Gasoline',
    status: 'active',
    category: 'vehicle',
    asset_type: 'pickup',
    current_odometer: 34521,
    assigned_department: 'Facilities',
    assigned_driver: 'John Smith',
    home_location: 'Building 134 Lot',
    acquisition_date: '2023-03-15',
    acquisition_cost: 45250,
    insurance_expiry: '2026-12-31',
    registration_expiry: '2026-09-30',
  };

  const tabs = [
    { name: 'Overview', icon: Car },
    { name: 'Work Orders', icon: Wrench },
    { name: 'Inspections', icon: ClipboardCheck },
    { name: 'Fuel History', icon: Fuel },
    { name: 'Location', icon: MapPin },
  ];

  return (
    <div>
      <Header
        title={`${asset.asset_number} - ${asset.year} ${asset.make} ${asset.model}`}
        actions={
          <Link href="/assets" className="btn-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assets
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Odometer</p>
              <p className="text-lg font-semibold">{asset.current_odometer.toLocaleString()} mi</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-semibold capitalize">{asset.status}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Next PM Due</p>
              <p className="text-lg font-semibold">Oil Change @ 35,000</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Inspection</p>
              <p className="text-lg font-semibold">Apr 3, 2026</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Vehicle Details */}
          <div className="card lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">VIN</p>
                <p className="font-medium">{asset.vin}</p>
              </div>
              <div>
                <p className="text-gray-500">License Plate</p>
                <p className="font-medium">{asset.license_plate}</p>
              </div>
              <div>
                <p className="text-gray-500">Color</p>
                <p className="font-medium">{asset.color}</p>
              </div>
              <div>
                <p className="text-gray-500">Fuel Type</p>
                <p className="font-medium">{asset.fuel_type}</p>
              </div>
              <div>
                <p className="text-gray-500">Department</p>
                <p className="font-medium">{asset.assigned_department}</p>
              </div>
              <div>
                <p className="text-gray-500">Home Location</p>
                <p className="font-medium">{asset.home_location}</p>
              </div>
              <div>
                <p className="text-gray-500">Acquisition Date</p>
                <p className="font-medium">{asset.acquisition_date}</p>
              </div>
              <div>
                <p className="text-gray-500">Acquisition Cost</p>
                <p className="font-medium">${asset.acquisition_cost.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Registration Expiry</p>
                <p className="font-medium">{asset.registration_expiry}</p>
              </div>
              <div>
                <p className="text-gray-500">Insurance Expiry</p>
                <p className="font-medium">{asset.insurance_expiry}</p>
              </div>
            </div>
          </div>

          {/* Assigned Driver */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h3>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{asset.assigned_driver}</p>
                <p className="text-sm text-gray-500">{asset.assigned_department}</p>
              </div>
            </div>

            <h4 className="text-sm font-medium text-gray-700 mt-6 mb-3">Recent Activity</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-green-500 shrink-0" />
                <div>
                  <p className="text-gray-900">Pre-trip inspection passed</p>
                  <p className="text-gray-500">Today, 7:15 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <p className="text-gray-900">Fuel fill - 18.3 gal</p>
                  <p className="text-gray-500">Yesterday, 4:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-yellow-500 shrink-0" />
                <div>
                  <p className="text-gray-900">Oil change completed</p>
                  <p className="text-gray-500">Mar 28, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
