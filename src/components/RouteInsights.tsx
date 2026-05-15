import React from 'react';
import { ChartCard } from "./ChartCard";
import { getCriticalRoutes, getDelayReasons } from "../utils/analytics";
import { Shipment } from "../data/shipments";
import { formatCurrency, formatPercent } from "../utils/formatters";
import { ModeBadge } from "./ModeBadge";
import { AlertCircle, ArrowRight, Lightbulb } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { EmptyState } from "./EmptyState";

export const RouteInsights = ({ shipments }: { shipments: Shipment[] }) => {
  const { t } = useLanguage();
  const routes = getCriticalRoutes(shipments);

  if (shipments.length === 0) {
    return <EmptyState />;
  }

  const getRecommendation = (route: ReturnType<typeof getCriticalRoutes>[0], shps: Shipment[]) => {
    const routeShipments = shps.filter(s => `${s.originCity} -> ${s.destinationCity}` === route.name);
    const topReason = getDelayReasons(routeShipments)[0]?.name || '';

    if (route.delayRate > 0.6) return t('routes.recommendations.highDelay');
    if (topReason === 'Port congestion' && route.dominantMode === 'Sea') return t('routes.recommendations.seaCongestion');
    if (route.dominantMode === 'Air' && route.totalCost > 10000 && topReason !== 'No delay') return t('routes.recommendations.airCost');
    if (topReason === 'Road traffic' && route.dominantMode === 'Road') return t('routes.recommendations.roadTraffic');
    if (topReason === 'Customs delay') return t('routes.recommendations.customs');
    if (topReason === 'Weather disruption') return t('routes.recommendations.weather');
    if (topReason === 'Carrier capacity issue') return t('routes.recommendations.carrierCapacity');
    if (topReason === 'Airport handling delay' && route.dominantMode === 'Air') return t('routes.recommendations.airportHandling');
    if (topReason === 'Warehouse bottleneck') return t('routes.recommendations.warehouseBottleneck');
    if (route.criticalCount > 0) return t('routes.recommendations.criticalConcentration');
    return t('routes.recommendations.stable');
  };

  const mainRoutes = routes.filter(r => r.total >= 3).slice(0, 10);
  const punctualRoutes = routes.filter(r => r.total < 3).slice(0, 4);

  const RouteCard: React.FC<{ route: any, idx?: number, isPunctual?: boolean }> = ({ route, idx, isPunctual = false }) => (
    <div className="bg-white rounded-xl card-shadow border border-gray-200 p-5 flex flex-col justify-between hover:border-gray-300 transition-colors">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            {!isPunctual && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold text-xs">
                {idx! + 1}
              </span>
            )}
            <h4 className="font-semibold text-gray-900 text-lg flex items-center flex-wrap gap-1">
              {route.name.split('->').map((part: string, i: number, arr: string[]) => (
                <span key={i} className="flex items-center">
                  {part.trim()}
                  {i < arr.length - 1 && <ArrowRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />}
                </span>
              ))}
            </h4>
          </div>
          <div className="flex space-x-2 items-center flex-shrink-0">
            {isPunctual && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium border border-gray-200">{t('routes.lowSample')}</span>}
            <div className="px-2 py-1 bg-brand-blue-light text-brand-blue rounded-md text-xs font-bold" title={t('routes.scoreTitle')}>
              Score: {Math.round(route.criticalityScore)}
            </div>
            <ModeBadge mode={route.dominantMode} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
          <div>
            <div className="text-[10px] sm:text-xs text-brand-muted mb-1">{t('routes.colShipments')}</div>
            <div className="text-sm sm:text-base font-semibold text-gray-900">{route.total}</div>
          </div>
          <div>
            <div className="text-[10px] sm:text-xs text-brand-muted mb-1">{t('routes.colDelayRate')}</div>
            <div className="text-sm sm:text-base font-semibold text-red-600">{formatPercent(route.delayRate)}</div>
          </div>
          <div>
            <div className="text-[10px] sm:text-xs text-brand-muted mb-1">{t('routes.colAvgDelay')}</div>
            <div className="text-sm sm:text-base font-semibold text-gray-900">{route.avgDelay.toFixed(1)} {t('common.dayUnit')}</div>
          </div>
          <div>
            <div className="text-[10px] sm:text-xs text-brand-muted mb-1">{t('routes.colTotalCost')}</div>
            <div className="text-sm sm:text-base font-semibold text-gray-900">{formatCurrency(route.totalCost)}</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-start mt-2">
        <Lightbulb className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900">{getRecommendation(route, shipments)}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900">{t('routes.mainTitle')}</h3>
        <p className="text-sm text-gray-500">{t('routes.mainDesc')}</p>
        
        {mainRoutes.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {mainRoutes.map((route, idx) => (
              <RouteCard key={route.name} route={route} idx={idx} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
            {t('routes.noMainRoutes')}
          </div>
        )}
      </div>

      {punctualRoutes.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">{t('routes.punctualTitle')}</h3>
          <p className="text-sm text-gray-500">{t('routes.punctualDesc')}</p>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {punctualRoutes.map((route) => (
              <RouteCard key={route.name} route={route} isPunctual={true} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
