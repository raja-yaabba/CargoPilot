/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import Papa from 'papaparse';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { TransportMap } from './components/TransportMap';
import { CarrierPerformance } from './components/CarrierPerformance';
import { RouteInsights } from './components/RouteInsights';
import { DataQualityPanel } from './components/DataQualityPanel';
import { SimulationPanel } from './components/SimulationPanel';
import { LandingPage } from './components/LandingPage';

import { shipments as initialShipments, Shipment } from './data/shipments';
import { getFilteredShipments } from './utils/analytics';
import { Upload, RefreshCw, ChevronLeft, Menu, Download, ChevronDown, Database } from 'lucide-react';
import { useToast } from './components/Toast';
import { useLanguage } from './components/LanguageContext';
import { clsx } from 'clsx';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activePage, setActivePage] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);
  const [shipmentsData, setShipmentsData] = useState<Shipment[]>(initialShipments);
  const [filters, setFilters] = useState({
    mode: 'All',
    riskLevel: 'All',
    carrier: 'All'
  });
  
  const { showToast } = useToast();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const carriersList = useMemo(() => {
    const list = Array.from(new Set(shipmentsData.map(s => s.carrier))).filter((c): c is string => typeof c === 'string' && c.trim() !== '' && c !== 'Unknown Carrier');
    return list.sort((a,b) => a.localeCompare(b));
  }, [shipmentsData]);

  const filteredShipments = useMemo(() => {
    return getFilteredShipments(shipmentsData, filters);
  }, [shipmentsData, filters]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const processParsedData = (data: any[]) => {
      if (data.length === 0) return;
      
      const firstRow = data[0];
      const requiredCols = ['id', 'orderId', 'mode', 'originCity', 'originCountry', 'destinationCity', 'destinationCountry', 'originLat', 'originLng', 'destinationLat', 'destinationLng', 'hub', 'carrier', 'plannedDeparture', 'plannedArrival', 'actualArrival', 'delayDays', 'costEur', 'weightKg', 'volumeM3', 'priority', 'status', 'delayReason', 'co2Kg', 'riskScore', 'riskLevel', 'costPerKg'];
      
      // Case-insensitive check
      const rowCols = Object.keys(firstRow).map(c => c.toLowerCase());
      const missingCols = requiredCols.filter(col => !rowCols.includes(col.toLowerCase()));
      
      if (missingCols.length > 0) {
        showToast(`${t('common.importMissingCols')} ${missingCols.join(', ')}`, 'error');
        return;
      }

      // Map data to handle potential casing differences in CSV
      const normalizedData = data.map(row => {
        const newRow: any = {};
        Object.keys(row).forEach(key => {
          const matchedKey = requiredCols.find(rc => rc.toLowerCase() === key.toLowerCase()) || key;
          newRow[matchedKey] = row[key];
        });
        return newRow;
      });

      // Transform string values to correct types
      const newShipments: Shipment[] = normalizedData.map((row: any) => ({
        ...row,
        originLat: parseFloat(row.originLat) || 0,
        originLng: parseFloat(row.originLng) || 0,
        destinationLat: parseFloat(row.destinationLat) || 0,
        destinationLng: parseFloat(row.destinationLng) || 0,
        delayDays: parseInt(row.delayDays) || 0,
        costEur: parseFloat(row.costEur) || 0,
        weightKg: parseFloat(row.weightKg) || 0,
        volumeM3: parseFloat(row.volumeM3) || 0,
        co2Kg: parseFloat(row.co2Kg) || 0,
        riskScore: parseInt(row.riskScore) || 0,
        costPerKg: parseFloat(row.costPerKg) || 0,
        dataQualityFlag: row.dataQualityFlag === 'null' || row.dataQualityFlag === '' ? null : row.dataQualityFlag,
      }));
      
      setShipmentsData(newShipments);
      showToast(t('common.importSuccess'), 'success');
    };

    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header: string) => header.trim(),
      complete: (results: any) => {
        let data = results.data;
        
        // Handle case where delimiter might have been wrong (e.g. semicolon in French Excel)
        if (data.length > 0) {
          const firstRow = data[0];
          const foundCols = Object.keys(firstRow);
          
          if (foundCols.length === 1 && foundCols[0].includes(';')) {
            Papa.parse(file, {
              header: true,
              skipEmptyLines: 'greedy',
              delimiter: ';',
              transformHeader: (header: string) => header.trim(),
              complete: (reparsedResults: any) => {
                processParsedData(reparsedResults.data);
              },
              error: () => showToast(t('common.importError'), "error")
            });
            return;
          }
        }
        processParsedData(data);
      },
      error: () => {
        showToast(t('common.importError'), "error");
      }
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetData = () => {
    setShipmentsData(initialShipments);
    showToast(t('common.resetSuccess'), 'info');
  };

  const handleExport = () => {
    const csv = Papa.unparse(shipmentsData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CargoPilot_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(t('common.success'), t('common.exportCsv'), 'success');
  };

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'overview':
        return <Overview shipments={filteredShipments} />;
      case 'map':
        return (
          <div className="h-[calc(100vh-140px)] min-h-[500px]">
            <TransportMap shipments={filteredShipments} />
          </div>
        );
      case 'carriers':
        return <CarrierPerformance shipments={filteredShipments} />;
      case 'routes':
        return <RouteInsights shipments={filteredShipments} />;
      case 'quality':
        return <DataQualityPanel shipments={filteredShipments} />;
      case 'simulation':
        return <SimulationPanel shipments={filteredShipments} />;
      default:
        return <Overview shipments={filteredShipments} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className={clsx(
        "flex-1 flex flex-col min-h-screen relative transition-all duration-300",
        "lg:ml-64"
      )}>
        {/* Top bar with back to home and CSV actions */}
        <div className="sticky top-0 right-0 left-0 h-14 lg:h-12 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-[1500] flex items-center justify-between px-4 lg:px-6 text-[10px] sm:text-sm">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 mr-2 text-gray-500 hover:text-brand-blue"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowLanding(true)}
              className="flex items-center text-gray-500 hover:text-brand-blue font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-0.5 sm:mr-1" /> 
              <span className="hidden xs:inline">{t('common.backToHome')}</span>
              <span className="xs:hidden">{t('common.home')}</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload} 
              className="hidden" 
              ref={fileInputRef}
            />
            
            <div className="relative">
              <button 
                onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-medium"
              >
                <Database className="w-4 h-4" />
                <span>{t('common.dataActions') || 'Actions Données'}</span>
                <ChevronDown className={clsx("w-4 h-4 transition-transform", isDataMenuOpen && "rotate-180")} />
              </button>

              {isDataMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDataMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <button 
                      onClick={() => {
                        fileInputRef.current?.click();
                        setIsDataMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-3 text-brand-blue" />
                      {t('common.importCsv')}
                    </button>
                    
                    <button 
                      onClick={() => {
                        handleExport();
                        setIsDataMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-3 text-brand-blue" />
                      {t('common.exportCsv')}
                    </button>

                    <div className="h-px bg-gray-100 my-1 mx-2" />

                    <a 
                      href="/CargoPilot_template.csv" 
                      download="CargoPilot_template.csv"
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDataMenuOpen(false)}
                    >
                      <Download className="w-4 h-4 mr-3 text-gray-500" />
                      {t('common.downloadTemplate')}
                    </a>

                    <button 
                      onClick={() => {
                        resetData();
                        setIsDataMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 mr-3" />
                      {t('common.reset')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <Header 
            title={t(`pages.${activePage}`)} 
            filters={filters} 
            setFilters={setFilters} 
            carriersList={carriersList}
          />
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

