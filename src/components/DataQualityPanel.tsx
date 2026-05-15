import { calculateDataQuality } from "../utils/analytics";
import { Shipment } from "../data/shipments";
import { ShieldCheck, ShieldAlert, AlertTriangle, Info } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { clsx } from "clsx";
import { EmptyState } from "./EmptyState";

export const DataQualityPanel = ({ shipments }: { shipments: Shipment[] }) => {
  const { t } = useLanguage();
  if (shipments.length === 0) {
    return <EmptyState />;
  }

  const { score, totalRows, anomalies } = calculateDataQuality(shipments);

  const isExcellent = score === 100;
  const isGood = score >= 80 && score < 100;
  
  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="mb-2">
            {isExcellent ? (
              <ShieldCheck className="w-12 h-12 text-green-500" />
            ) : isGood ? (
              <ShieldAlert className="w-12 h-12 text-yellow-500" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-red-500" />
            )}
          </div>
          <div className="text-3xl font-bold text-gray-900">{score}/100</div>
          <div className="text-sm text-gray-500 mt-1">{t('quality.scoreLabel')}</div>
        </div>
        
        <div className="md:col-span-2 bg-white rounded-xl p-6 card-shadow border border-gray-100 flex items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('quality.summaryTitle')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('quality.summaryDesc')}
            </p>
            <div className="flex space-x-8">
              <div>
                <span className="text-2xl font-semibold text-gray-900">{totalRows}</span>
                <span className="text-sm text-gray-500 ml-2">{t('quality.totalRows')}</span>
              </div>
              <div>
                <span className="text-2xl font-semibold text-red-600">{anomalies.length}</span>
                <span className="text-sm text-gray-500 ml-2">{t('quality.anomaliesCount')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl card-shadow border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-900">{t('quality.tableTitle')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-brand-muted uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">{t('quality.colId')}</th>
                <th className="px-6 py-3">{t('quality.colType')}</th>
                <th className="px-6 py-3">{t('quality.colSeverity')}</th>
                <th className="px-6 py-3">{t('quality.colRec')}</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.length > 0 ? anomalies.map((a, i) => {
                const sevKey = a.severity === 'Critique' ? 'Critical' : 
                             a.severity === 'Élevée' ? 'High' : 
                             a.severity === 'Moyenne' ? 'Medium' : 'Low';
                
                // Map recommendation strings to keys
                const recKey = a.recommendation.includes('manuelle') ? 'manual' :
                              a.recommendation.includes('TMS') ? 'tms' :
                              a.recommendation.includes('facture') ? 'cost' :
                              a.recommendation.includes('base de données') ? 'database' :
                              a.recommendation.includes('pesée') ? 'weight' :
                              a.recommendation.includes('dates') ? 'dates' :
                              a.recommendation.includes('points d\'origine') ? 'gps' :
                              a.recommendation.includes('dates de transport') ? 'transport' :
                              a.recommendation.includes('doublon') ? 'duplicate' : '';

                return (
                  <tr key={`${a.id}-${i}`} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{a.id}</td>
                    <td className="px-6 py-4 flex items-center text-gray-700">
                      <Info className="w-4 h-4 text-brand-blue mr-2" />
                      {t(`quality.types.${a.type}`)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-2 py-1 rounded text-xs font-medium",
                        sevKey === 'Critical' || sevKey === 'High' ? "bg-red-100 text-red-800" :
                        sevKey === 'Medium' ? "bg-orange-100 text-orange-800" :
                        "bg-yellow-100 text-yellow-800"
                      )}>
                        {t(`quality.severities.${sevKey}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{recKey ? t(`quality.recommendations.${recKey}`) : a.recommendation}</td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    {t('quality.noAnomalies')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};
