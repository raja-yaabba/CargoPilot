import { useState } from "react";
import { runOptimizationScenario } from "../utils/analytics";
import { Shipment } from "../data/shipments";
import { Play, TrendingUp, Save, Clock } from "lucide-react";
import { formatCurrency, formatPercent } from "../utils/formatters";
import { useLanguage } from "./LanguageContext";

export const SimulationPanel = ({ shipments }: { shipments: Shipment[] }) => {
  const { t } = useLanguage();
  const [hasRun, setHasRun] = useState(false);
  const result = runOptimizationScenario(shipments);

  if (!result) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100 card-shadow">
        {t('simulation.noData')}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <div className="bg-white rounded-xl p-8 card-shadow border border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('simulation.title')}</h2>
        <p className="text-gray-600 mb-2 max-w-2xl mx-auto">
          "{t('simulation.scenario').replace('{worst}', result.worstCarrier).replace('{best}', result.bestCarrier)}"
        </p>
        <p className="text-sm text-gray-500 mb-8 max-w-2xl mx-auto">
          {t('simulation.desc')}
        </p>
        
        <button
          onClick={() => setHasRun(true)}
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-brand-blue rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
        >
          <Play className="w-5 h-5 mr-2" />
          {t('simulation.runBtn')}
        </button>
      </div>

      {hasRun && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              {t('simulation.resultsTitle')}
            </h3>
            <p className="text-green-700">
              {t('simulation.resultsDesc').replace('{count}', result.affectedCount.toString())}
            </p>
          </div>

          <div className="bg-white rounded-xl card-shadow border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
               <h3 className="text-base font-semibold text-gray-900">{t('simulation.compareTitle').replace('{name}', result.worstCarrier)}</h3>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-brand-muted uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">{t('simulation.colMetric')}</th>
                  <th className="px-6 py-3 text-center">{t('simulation.colBefore')}</th>
                  <th className="px-6 py-3 text-center">{t('simulation.colAfter')}</th>
                  <th className="px-6 py-3 text-center">{t('simulation.colImpact')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50">
                  <td className="px-6 py-4 font-medium">{t('simulation.metricDelayRate')}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{formatPercent(result.worstCurrentDelayRate)}</td>
                  <td className="px-6 py-4 text-center text-green-600 font-medium">{formatPercent(result.worstSimulatedDelayRate)}</td>
                  <td className="px-6 py-4 text-center text-green-600 font-medium">-25%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">{t('simulation.metricAffected')}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{result.affectedCount}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{result.affectedCount}</td>
                  <td className="px-6 py-4 text-center text-gray-500">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">{t('simulation.cardDelayTitle')}</h4>
                <div className="text-3xl font-bold text-green-600 mt-1">{t('simulation.cardDelayVal').replace('{days}', result.savedDays.toString())}</div>
                <p className="text-sm text-gray-500 mt-1">{t('simulation.cardDelayDesc')}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100 flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg text-green-600">
                <Save className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">{t('simulation.cardCostTitle')}</h4>
                <div className="text-3xl font-bold text-green-600 mt-1">environ {formatCurrency(result.savedCost)}</div>
                <p className="text-sm text-gray-500 mt-1">{t('simulation.cardCostDesc')}</p>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 text-center mt-8">
            {t('simulation.footerNote')}
          </div>
        </div>
      )}
      
    </div>
  );
};
