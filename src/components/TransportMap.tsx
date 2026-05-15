import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Shipment } from "../data/shipments";
import { RiskBadge } from "./RiskBadge";
import { ModeBadge } from "./ModeBadge";
import { formatCurrency, formatDelay } from "../utils/formatters";
import { useLanguage } from "./LanguageContext";
import { Plane, Ship, Truck, Info } from "lucide-react";

export const TransportMap = ({ shipments }: { shipments: Shipment[] }) => {
  const { t } = useLanguage();
  const [showAllFlows, setShowAllFlows] = useState(false);
  
  const visibleShipments = useMemo(() => showAllFlows 
    ? shipments 
    : shipments.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Critical'), [shipments, showAllFlows]);

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'Low': return '#22C55E';
      case 'Medium': return '#FACC15';
      case 'High': return '#FB923C';
      case 'Critical': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getModeDash = (mode: string) => {
    switch (mode) {
      case 'Air': return '1, 6';
      case 'Sea': return '10, 6';
      default: return 'none';
    }
  };

  // Helper to generate a curved path (arc)
  const getCurvePoints = (start: [number, number], end: [number, number], segments = 20) => {
    const points: [number, number][] = [];
    const [lat1, lng1] = start;
    const [lat2, lng2] = end;

    // Calculate midpoint and offset for the curve
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;
    
    // Calculate distance to scale the curve offset
    const dist = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
    const offset = dist * 0.15; // Adjustment factor for curvature

    // Control point for quadratic bezier
    const cpLat = midLat + (lng2 - lng1) * offset / dist;
    const cpLng = midLng - (lat2 - lat1) * offset / dist;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Quadratic Bezier formula: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
      const lat = Math.pow(1 - t, 2) * lat1 + 2 * (1 - t) * t * cpLat + Math.pow(t, 2) * lat2;
      const lng = Math.pow(1 - t, 2) * lng1 + 2 * (1 - t) * t * cpLng + Math.pow(t, 2) * lng2;
      points.push([lat, lng]);
    }
    return points;
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden card-shadow border border-gray-200">
      <MapContainer 
        center={[30, 10]} 
        zoom={2.5} 
        style={{ height: '100%', width: '100%', background: '#f8fafc' }}
        scrollWheelZoom={true}
        minZoom={2}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {visibleShipments.map(s => {
          if (isNaN(s.originLat) || isNaN(s.originLng) || isNaN(s.destinationLat) || isNaN(s.destinationLng)) return null;

          const color = getRiskColor(s.riskLevel);
          const curvePoints = getCurvePoints([s.originLat, s.originLng], [s.destinationLat, s.destinationLng]);
          
          return (
            <div key={s.id}>
              <Polyline 
                positions={curvePoints} 
                color={color} 
                weight={2.5} 
                opacity={0.7}
                dashArray={getModeDash(s.mode)}
                lineJoin="round"
                lineCap="round"
              >
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[240px]">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                      <span className="font-bold text-gray-900 text-base">{s.id}</span>
                      <RiskBadge level={s.riskLevel} />
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-gray-400 font-medium">{t('map.popupRoute')}</span> 
                        <div className="text-right font-semibold text-gray-800">
                          {s.originCity} <span className="text-gray-300 mx-1">→</span> {s.destinationCity}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium">{t('map.popupMode')}</span> 
                        <ModeBadge mode={s.mode} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">{t('map.popupCarrier')}</span> 
                        <span className="text-gray-800 font-medium">{s.carrier || t('map.unknown')}</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-500 text-xs uppercase tracking-wider font-bold">{t('map.popupDelay')}</span> 
                        <span className={s.delayDays > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                          {formatDelay(s.delayDays, t)}
                        </span>
                      </div>
                      {s.delayDays > 0 && s.delayReason !== 'No delay' && (
                        <div className="bg-red-50 p-2 rounded-lg text-red-700 text-xs flex items-start">
                          <Info className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-bold block mb-0.5">{t('map.popupReason')}</span> 
                            <span>{t(`data.reasons.${s.delayReason}`)}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between font-bold pt-1 text-gray-900 border-t border-gray-100">
                        <span className="text-gray-400 font-medium">{t('map.popupCost')}</span> 
                        <span>{formatCurrency(s.costEur)}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polyline>
              <CircleMarker 
                center={[s.originLat, s.originLng]} 
                radius={3} 
                color={color} 
                fillColor="#fff" 
                fillOpacity={1} 
                weight={2} 
              />
              <CircleMarker 
                center={[s.destinationLat, s.destinationLng]} 
                radius={3} 
                color={color} 
                fillColor="#fff" 
                fillOpacity={1} 
                weight={2} 
              />
            </div>
          );
        })}
      </MapContainer>
      
      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-white/20 min-w-[140px]">
        <label className="flex items-center justify-between cursor-pointer mb-1.5">
          <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight">{t('map.showAll')}</span>
          <div className="relative scale-75 origin-right">
            <input type="checkbox" className="sr-only" checked={showAllFlows} onChange={() => setShowAllFlows(!showAllFlows)} />
            <div className={`block w-10 h-5 rounded-full transition-colors ${showAllFlows ? 'bg-brand-blue' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${showAllFlows ? 'transform translate-x-5' : ''}`}></div>
          </div>
        </label>
        <div className="flex items-center text-[9px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50/50 px-1.5 py-0.5 rounded">
          <Info className="w-2.5 h-2.5 mr-1" />
          {t('map.visibleCount').replace('{visible}', visibleShipments.length.toString()).replace('{total}', shipments.length.toString())}
        </div>
      </div>

      {/* Modern Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-2xl z-[1000] border border-white/20 min-w-[180px]">
        <div className="mb-3">
          <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{t('map.riskTitle')}</h4>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="flex items-center px-1.5 py-1 rounded bg-green-50 text-[10px] font-bold text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              {t('data.risks.Low')}
            </div>
            <div className="flex items-center px-1.5 py-1 rounded bg-yellow-50 text-[10px] font-bold text-yellow-700">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1.5 shadow-[0_0_8px_rgba(250,204,21,0.5)]"></span>
              {t('data.risks.Medium')}
            </div>
            <div className="flex items-center px-1.5 py-1 rounded bg-orange-50 text-[10px] font-bold text-orange-700">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1.5 shadow-[0_0_8px_rgba(251,146,60,0.5)]"></span>
              {t('data.risks.High')}
            </div>
            <div className="flex items-center px-1.5 py-1 rounded bg-red-50 text-[10px] font-bold text-red-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
              {t('data.risks.Critical')}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{t('map.modeTitle')}</h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-1.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center mr-2">
                  <Truck className="w-3 h-3 text-gray-600" />
                </div>
                <span className="text-[10px] font-bold text-gray-700">{t('data.modes.Road')}</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center mr-2">
                  <Ship className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-gray-700">{t('data.modes.Sea')}</span>
              </div>
              <div className="w-8 flex space-x-0.5">
                {[1, 2, 3].map(i => <div key={i} className="flex-1 h-0.5 bg-blue-300 rounded-full"></div>)}
              </div>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center mr-2">
                  <Plane className="w-3 h-3 text-purple-600" />
                </div>
                <span className="text-[10px] font-bold text-gray-700">{t('data.modes.Air')}</span>
              </div>
              <div className="w-8 flex space-x-0.5">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="flex-1 h-0.5 bg-purple-300 rounded-full"></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
