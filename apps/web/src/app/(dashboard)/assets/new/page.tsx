'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ArrowLeft } from 'lucide-react';
import { AssetTypes, AssetCategories, FuelTypes } from '@fleetpulse/shared';

export default function NewAssetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // TODO: API call to create asset
    console.log('Creating asset:', data);

    setLoading(false);
    router.push('/assets');
  }

  return (
    <div>
      <Header
        title="Add New Asset"
        actions={
          <Link href="/assets" className="btn-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Link>
        }
      />

      <div className="p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Asset Number *</label>
                <input name="assetNumber" className="input" required placeholder="e.g., V-0001" />
              </div>
              <div>
                <label className="label">Category *</label>
                <select name="category" className="input" required>
                  {AssetCategories.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Asset Type *</label>
                <select name="assetType" className="input" required>
                  {AssetTypes.map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Fuel Type</label>
                <select name="fuelType" className="input">
                  <option value="">Select...</option>
                  {FuelTypes.map((f) => (
                    <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="label">Year</label>
                <input name="year" type="number" className="input" min="1900" max="2100" />
              </div>
              <div>
                <label className="label">Make</label>
                <input name="make" className="input" placeholder="e.g., Ford" />
              </div>
              <div>
                <label className="label">Model</label>
                <input name="model" className="input" placeholder="e.g., F-150" />
              </div>
              <div>
                <label className="label">VIN</label>
                <input name="vin" className="input" maxLength={17} placeholder="17-character VIN" />
              </div>
              <div>
                <label className="label">License Plate</label>
                <input name="licensePlate" className="input" />
              </div>
              <div>
                <label className="label">Color</label>
                <input name="color" className="input" />
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Department</label>
                <input name="assignedDepartment" className="input" placeholder="e.g., Facilities" />
              </div>
              <div>
                <label className="label">Home Location</label>
                <input name="homeLocation" className="input" placeholder="e.g., Building 134 Lot" />
              </div>
              <div>
                <label className="label">Current Odometer</label>
                <input name="currentOdometer" type="number" className="input" min="0" defaultValue="0" />
              </div>
              <div>
                <label className="label">Current Hours</label>
                <input name="currentHours" type="number" className="input" min="0" step="0.1" defaultValue="0" />
              </div>
            </div>
          </div>

          {/* Acquisition */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acquisition & Insurance</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Acquisition Date</label>
                <input name="acquisitionDate" type="date" className="input" />
              </div>
              <div>
                <label className="label">Acquisition Cost ($)</label>
                <input name="acquisitionCost" type="number" className="input" min="0" step="0.01" />
              </div>
              <div>
                <label className="label">Registration Expiry</label>
                <input name="registrationExpiry" type="date" className="input" />
              </div>
              <div>
                <label className="label">Insurance Expiry</label>
                <input name="insuranceExpiry" type="date" className="input" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div>
              <label className="label">Notes</label>
              <textarea name="notes" className="input" rows={3} placeholder="Any additional notes..." />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/assets" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
