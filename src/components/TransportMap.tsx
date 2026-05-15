import { useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Shipment } from "../data/shipments";
import { RiskBadge } from "./RiskBadge";
import { ModeBadge } from "./ModeBadge";
import { formatCurrency, formatDelay } from "../utils/formatters";
import { useLanguage } from "./LanguageContext";

export const TransportMap = ({ shipments }: { shipments: Shipment[] }) => {
  const { t } = useLanguage();
  const [showAllFlows, setShowAllFlows] = useState(false);
  
  const visibleShipments = showAllFlows 
    ? shipments 
    : shipments.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Critical');

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
      case 'Air': return '5, 10';
      case 'Sea': return '10, 10';
      default: return 'none'; // Road is solid
    }
  };

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden card-shadow border border-gray-200">
      <MapContainer 
        center={[48.8566, 2.3522]} 
        zoom={4} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {visibleShipments.map(s => {
          if (isNaN(s.originLat) || isNaN(s.originLng) || isNaN(s.destinationLat) || isNaN(s.destinationLng)) return null;

          const color = getRiskColor(s.riskLevel);
          const points: [number, number][] = [
            [s.originLat, s.originLng],
            [s.destinationLat, s.destinationLng]
          ];
          
          return (
            <div key={s.id}>
              <Polyline 
                positions={points} 
                color={color} 
                weight={3} 
                opacity={0.6}
                dashArray={getModeDash(s.mode)}
              >
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[220px]">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-gray-900">{s.id}</span>
                      <RiskBadge level={s.riskLevel} />
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-400">{t('map.popupRoute')}</span> 
                        <span className="text-right">{s.originCity} &rarr; {s.destinationCity}</span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-400">{t('map.popupMode')}</span> 
                        <ModeBadge mode={s.mode} />
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-400">{t('map.popupCarrier')}</span> 
                        <span>{s.carrier || t('map.unknown')}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-400">{t('map.popupDelay')}</span> 
                        <span className={s.delayDays > 0 ? 'text-red-500 font-medium' : 'text-green-500'}>
                          {formatDelay(s.delayDays, t)}
                        </span>
                      </p>
                      {s.delayDays > 0 && s.delayReason !== 'No delay' && (
                        <p className="flex justify-between text-xs bg-red-50 p-1.5 rounded text-red-700 mt-1">
                          <span className="font-medium">{t('map.popupReason')}</span> 
                          <span className="text-right ml-2">{t(`data.reasons.${s.delayReason}`)}</span>
                        </p>
                      )}
                      <p className="flex justify-between font-medium pt-2 border-t mt-2">
                        <span className="text-gray-400">{t('map.popupCost')}</span> 
                        <span className="text-gray-900">{formatCurrency(s.costEur)}</span>
                      </p>
                    </div>
                  </div>
                </Popup>
              </Polyline>
              <CircleMarker center={[s.originLat, s.originLng]} radius={4} color={color} fillColor="#fff" fillOpacity={1} weight={2} />
              <CircleMarker center={[s.destinationLat, s.destinationLng]} radius={4} color={color} fillColor="#fff" fillOpacity={1} weight={2} />
            </div>
          );
        })}
      </MapContainer>
      
      {/* Controls */}
      <div className="absolute top-6 right-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md border border-gray-200">
        <label className="flex items-center cursor-pointer mb-2">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={showAllFlows} onChange={() => setShowAllFlows(!showAllFlows)} />
            <div className={`block w-10 h-6 rounded-full transition-colors ${showAllFlows ? 'bg-brand-blue' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showAllFlows ? 'transform translate-x-4' : ''}`}></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700">{t('map.showAll')}</span>
        </label>
        <p className="text-xs text-gray-500 font-medium">
          {t('map.visibleCount').replace('{visible}', visibleShipments.length.toString()).replace('{total}', shipments.length.toString())}
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 right-6 glass-surface p-4 rounded-xl shadow-lg z-[1000] text-sm hidden md:block">
        <h4 className="font-semibold text-gray-800 mb-3">{t('map.riskTitle')}</h4>
        <div className="space-y-2">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#22C55E] mr-2"></span>{t('data.risks.Low')}</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#FACC15] mr-2"></span>{t('data.risks.Medium')}</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#FB923C] mr-2"></span>{t('data.risks.High')}</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#EF4444] mr-2"></span>{t('data.risks.Critical')}</div>
        </div>
        <h4 className="font-semibold text-gray-800 mt-4 mb-3">{t('map.modeTitle')}</h4>
        <div className="space-y-2">
          <div className="flex items-center"><div className="w-6 h-0.5 bg-gray-500 mr-2"></div>{t('data.modes.Road')}</div>
          <div className="flex items-center"><div className="w-6 h-0.5 bg-gray-500 mr-2 border-t-2 border-gray-500 border-dashed border-spacing-2" style={{borderTopStyle: 'dashed', borderWidth: '0 0 2px 0'}}></div>{t('data.modes.Sea')}</div>
          <div className="flex items-center"><div className="w-6 h-[2px] bg-gray-500 mr-2 border-t-2 border-gray-500 border-dotted" style={{borderTopStyle: 'dotted', borderWidth: '0 0 2px 0'}}></div>{t('data.modes.Air')}</div>
        </div>
      </div>
    </div>
  );
};
