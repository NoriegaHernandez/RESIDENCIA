import React, { useState } from 'react';
import { FloorPlanSection } from './components/FloorPlanSection';
import { InventorySection } from './components/InventorySection';
import { Building, Package } from 'lucide-react';

type AppSection = 'floor-plans' | 'inventory';

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('floor-plans');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Main Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Device Management System</h1>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveSection('floor-plans')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'floor-plans'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building className="h-4 w-4" />
              Floor Plans
            </button>
            <button
              onClick={() => setActiveSection('inventory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'inventory'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="h-4 w-4" />
              Inventory
            </button>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-hidden">
        {activeSection === 'floor-plans' ? (
          <FloorPlanSection />
        ) : (
          <InventorySection />
        )}
      </div>
    </div>
  );
}

export default App;