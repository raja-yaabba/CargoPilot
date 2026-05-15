import { ChartCard } from "./ChartCard";
import { getCarrierPerformance } from "../utils/analytics";
import { Shipment } from "../data/shipments";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCurrency, formatPercent } from "../utils/formatters";
import { useLanguage } from "./LanguageContext";
import { Info } from "lucide-react";
import { clsx } from "clsx";
import { EmptyState } from "./EmptyState";

export const CarrierPerformance = ({ shipments }: { shipments: Shipment[] }) => {
  const { t } = useLanguage();
  const performance = getCarrierPerformance(shipments);

  if (shipments.length === 0) {
    return <EmptyState />;
  }

  const getRatingBadge = (rating: string) => {
    const styles = {
      Good: "bg-green-100 text-green-800",
      Watch: "bg-yellow-100 text-yellow-800",
      Risky: "bg-red-100 text-red-800",
      Insufficient: "bg-gray-100 text-gray-600",
    }[rating];
    return <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap", styles)}>{t(`data.ratings.${rating}`)}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-start text-sm text-blue-900">
        <Info className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
        <p>{t('carriers.info')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title={t('carriers.chartScore')} description={t('carriers.chartScoreDesc')}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performance.filter(p => p.rating !== 'Insufficient')} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {performance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score < 50 ? '#EF4444' : entry.score < 80 ? '#FACC15' : '#22C55E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('carriers.chartDelay').replace('{unit}', t('common.dayUnit'))} description={t('carriers.chartDelayDesc')}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performance.filter(p => p.rating !== 'Insufficient')} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="avgDelay" fill="#FB923C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-white rounded-xl card-shadow border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-base font-semibold text-gray-900">{t('carriers.tableTitle')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-brand-muted uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">{t('carriers.colName')}</th>
                <th className="px-6 py-3 text-right hidden sm:table-cell">{t('carriers.colTotal')}</th>
                <th className="px-6 py-3 text-right">{t('carriers.colDelayRate')}</th>
                <th className="px-6 py-3 text-right hidden md:table-cell">{t('carriers.colAvgDelay')}</th>
                <th className="px-6 py-3 text-right hidden lg:table-cell">{t('carriers.colAvgCost')}</th>
                <th className="px-6 py-3 text-center">{t('carriers.colScore')}</th>
                <th className="px-6 py-3 hidden xs:table-cell">{t('carriers.colStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {performance.length > 0 ? performance.map(c => (
                <tr key={c.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {c.name}
                    <div className="xs:hidden mt-1">{getRatingBadge(c.rating)}</div>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600 hidden sm:table-cell">{c.total}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{formatPercent(c.delayRate)}</td>
                  <td className="px-6 py-4 text-right text-gray-600 hidden md:table-cell">{c.avgDelay.toFixed(1)} j</td>
                  <td className="px-6 py-4 text-right text-gray-600 hidden lg:table-cell">{formatCurrency(c.avgCost)}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-900">{c.rating === 'Insufficient' ? '-' : c.score}</td>
                  <td className="px-6 py-4 hidden xs:table-cell">{getRatingBadge(c.rating)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {t('carriers.noData')}
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
