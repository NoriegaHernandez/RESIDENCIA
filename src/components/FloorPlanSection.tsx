import React, { useState } from 'react';
import { FloorPlanSidebar } from './FloorPlanSidebar';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { PrinterList } from './PrinterList';
import { ComputerList } from './ComputerList';
import { TVList } from './TVList';
import { SearchBar } from './SearchBar';
import { useFloorPlans } from '../hooks/useFloorPlans';
import { usePrinters } from '../hooks/usePrinters';
import { useComputers } from '../hooks/useComputers';
import { useTVs } from '../hooks/useTVs';
import { FloorPlan, Printer } from '../lib/supabase';
import { Computer } from '../hooks/useComputers';
import { TV } from '../hooks/useTVs';
import { LayoutGrid, List, Printer as PrinterIcon, Monitor, Tv, Building } from 'lucide-react';

export function FloorPlanSection() {
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(null);
  const [viewMode, setViewMode] = useState<'canvas' | 'list'>('canvas');
  const [deviceMode, setDeviceMode] = useState<'printers' | 'computers' | 'tvs'>('printers');
  
  const {
    floorPlans,
    loading: floorPlansLoading,
    createFloorPlan,
    deleteFloorPlan
  } = useFloorPlans();

  const {
    printers,
    loading: printersLoading,
    createPrinter,
    updatePrinter,
    deletePrinter
  } = usePrinters(selectedFloorPlan?.id || null);

  const {
    computers,
    loading: computersLoading,
    createComputer,
    updateComputer,
    deleteComputer
  } = useComputers(selectedFloorPlan?.id || null);

  const {
    tvs,
    loading: tvsLoading,
    createTV,
    updateTV,
    deleteTV
  } = useTVs(selectedFloorPlan?.id || null);

  const handleAddPrinter = async (x: number, y: number) => {
    if (!selectedFloorPlan) return;
    await createPrinter(x, y);
  };

  const handleAddComputer = async (x: number, y: number) => {
    if (!selectedFloorPlan) return;
    await createComputer(x, y);
  };

  const handleAddTV = async (x: number, y: number) => {
    if (!selectedFloorPlan) return;
    await createTV(x, y);
  };

  const handleUpdatePrinter = async (printer: Printer) => {
    await updatePrinter(printer.id, printer);
  };

  const handleUpdateComputer = async (computer: Computer) => {
    await updateComputer(computer.id, computer);
  };

  const handleUpdateTV = async (tv: TV) => {
    await updateTV(tv.id, tv);
  };

  const handleDeletePrinter = async (id: string) => {
    await deletePrinter(id);
  };

  const handleDeleteComputer = async (id: string) => {
    await deleteComputer(id);
  };

  const handleDeleteTV = async (id: string) => {
    await deleteTV(id);
  };

  const handleUploadFloorPlan = async (name: string, file: File) => {
    const newPlan = await createFloorPlan(name, file);
    setSelectedFloorPlan(newPlan);
  };

  const handleDeleteFloorPlan = async (id: string) => {
    await deleteFloorPlan(id);
    if (selectedFloorPlan?.id === id) {
      setSelectedFloorPlan(null);
    }
  };

  const handleNavigateToDevice = (device: any) => {
    // Switch to canvas view if not already
    if (viewMode !== 'canvas') {
      setViewMode('canvas');
    }
    
    // Switch to the appropriate device mode
    if (device.type === 'printer') setDeviceMode('printers');
    else if (device.type === 'computer') setDeviceMode('computers');
    else if (device.type === 'tv') setDeviceMode('tvs');
    
    // The device will be highlighted automatically when the mode switches
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <FloorPlanSidebar
        floorPlans={floorPlans}
        selectedFloorPlan={selectedFloorPlan}
        onSelectFloorPlan={setSelectedFloorPlan}
        onUploadFloorPlan={handleUploadFloorPlan}
        onDeleteFloorPlan={handleDeleteFloorPlan}
        loading={floorPlansLoading}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedFloorPlan ? (
          <>
            {/* Sub-Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedFloorPlan.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {printers.length} printer{printers.length !== 1 ? 's' : ''} • {computers.length} computer{computers.length !== 1 ? 's' : ''} • {tvs.length} TV{tvs.length !== 1 ? 's' : ''} configured
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  {/* Device Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setDeviceMode('printers')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        deviceMode === 'printers'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <PrinterIcon className="h-4 w-4" />
                      Printers
                    </button>
                    <button
                      onClick={() => setDeviceMode('computers')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        deviceMode === 'computers'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Monitor className="h-4 w-4" />
                      Computers
                    </button>
                    <button
                      onClick={() => setDeviceMode('tvs')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        deviceMode === 'tvs'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Tv className="h-4 w-4" />
                      TVs
                    </button>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('canvas')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'canvas'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      Floor Plan
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List className="h-4 w-4" />
                      List View
                    </button>
                  </div>

                  {/* Search Bar */}
                  <SearchBar
                    printers={printers}
                    computers={computers}
                    tvs={tvs}
                    onNavigateToDevice={handleNavigateToDevice}
                  />

                  
                </div>
              </div>
            </div>

            {/* Content */}
            {viewMode === 'canvas' ? (
              <FloorPlanCanvas
                floorPlan={selectedFloorPlan}
                printers={printers}
                computers={computers}
                tvs={tvs}
                onAddPrinter={handleAddPrinter}
                onAddComputer={handleAddComputer}
                onAddTV={handleAddTV}
                onUpdatePrinter={handleUpdatePrinter}
                onUpdateComputer={handleUpdateComputer}
                onUpdateTV={handleUpdateTV}
                onDeletePrinter={handleDeletePrinter}
                onDeleteComputer={handleDeleteComputer}
                onDeleteTV={handleDeleteTV}
                deviceMode={deviceMode}
              />
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                {deviceMode === 'printers' ? (
                  <PrinterList
                    printers={printers}
                    onEditPrinter={(printer) => handleUpdatePrinter(printer)}
                    onDeletePrinter={handleDeletePrinter}
                  />
                ) : deviceMode === 'tvs' ? (
                  <TVList
                    tvs={tvs}
                    onEditTV={(tv) => handleUpdateTV(tv)}
                    onDeleteTV={handleDeleteTV}
                  />
                ) : (
                  <ComputerList
                    computers={computers}
                    onEditComputer={(computer) => handleUpdateComputer(computer)}
                    onDeleteComputer={handleDeleteComputer}
                  />
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <Building className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Floor Plan Selected</h2>
              <p className="text-gray-500 mb-4">Choose a floor plan from the sidebar to start managing devices</p>
              <p className="text-sm text-gray-400">
                Upload a new floor plan to get started with device location management
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}