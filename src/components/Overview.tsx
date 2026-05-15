import { KpiCard } from "./KpiCard";
import { ChartCard } from "./ChartCard";
import { Package, AlertCircle, Clock, DollarSign, CloudRain, Activity, Stethoscope } from "lucide-react";
import { formatCurrency, formatPercent, formatNumber, formatCo2, formatDelay } from "../utils/formatters";
import { calculateKpis, getShipmentsByMode, getDelayReasons, getDiagnostic } from "../utils/analytics";
import { Shipment } from "../data/shipments";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { RiskBadge } from "./RiskBadge";
import { ModeBadge } from "./ModeBadge";
import { useLanguage } from "./LanguageContext";
import { EmptyState } from "./EmptyState";

export const Overview = ({ shipments }: { shipments: Shipment[] }) => {
  const { t } = useLanguage();
  const kpis = calculateKpis(shipments);
  const byMode = getShipmentsByMode(shipments).map(m => ({...m, name: t(`data.modes.${m.name}`)}));
  const delayReasons = getDelayReasons(shipments).map(d => ({...d, name: t(`data.reasons.${d.name}`)}));
  const diagnosticData = getDiagnostic(shipments);
  
  const diagnosticText = [
    diagnosticData.isDelayHigh 
      ? t('overview.diagDelayHigh').replace('{rate}', diagnosticData.delayRate.toString())
      : t('overview.diagDelayLow').replace('{rate}', diagnosticData.delayRate.toString()),
    diagnosticData.delayMode !== 'Unknown' && (
      diagnosticData.delayMode === 'Weather disruption'
        ? t('overview.diagReasonWeather')
        : t('overview.diagReasonOther').replace('{reason}', t(`data.reasons.${diagnosticData.delayMode}`).toLowerCase())
    ),
    diagnosticData.bestCarrier && t('overview.diagBestCarrier').replace('{name}', diagnosticData.bestCarrier)
  ].filter(Boolean).join('');

  const colors = ['#2563EB', '#06B6D4', '#A855F7'];
  const barColors = ['#F87171', '#FB923C', '#FACC15', '#22C55E', '#94A3B8'];

  const criticalAlerts = shipments.filter(s => s.riskLevel === 'Critical').slice(0, 5);

  if (shipments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gray-50 border border-[#E5E7EB] rounded-xl p-5 flex items-start space-x-4 card-shadow h-full">
          <div className="bg-brand-blue-light p-3 rounded-lg text-brand-blue shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{t('overview.diagnosticTitle')}</h3>
            <p className="text-gray-700 mt-1 leading-relaxed">{diagnosticText}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 card-shadow h-full flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">{t('overview.indicatorsTitle')}</h3>
          <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
            <li dangerouslySetInnerHTML={{ __html: t('overview.indicator1') }}></li>
            <li dangerouslySetInnerHTML={{ __html: t('overview.indicator2') }}></li>
            <li dangerouslySetInnerHTML={{ __html: t('overview.indicator3') }}></li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard title={t('overview.kpiTotal')} value={formatNumber(kpis.total)} icon={<Package className="w-5 h-5" />} />
        <KpiCard title={t('overview.kpiDelayRate')} value={formatPercent(kpis.delayRate)} icon={<AlertCircle className="w-5 h-5 text-red-500" />} />
        <KpiCard title={t('overview.kpiAvgDelay')} value={`${kpis.avgDelay.toFixed(1)} j`} icon={<Clock className="w-5 h-5 text-orange-500" />} />
        <KpiCard title={t('overview.kpiTotalCost')} value={formatCurrency(kpis.totalCost)} icon={<DollarSign className="w-5 h-5 text-green-500" />} />
        <KpiCard title={t('overview.kpiCritical')} value={kpis.criticalCount} icon={<Activity className="w-5 h-5 text-red-600" />} />
        <KpiCard title={t('overview.kpiCo2')} value={formatCo2(kpis.avgCo2)} icon={<CloudRain className="w-5 h-5 text-teal-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title={t('overview.chartMode')}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={byMode}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {byMode.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {byMode.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></span>
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title={t('overview.chartReason')}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={delayReasons} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
              <RechartsTooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {delayReasons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-white rounded-xl card-shadow border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-base font-semibold text-gray-900">{t('overview.tableTitle')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-brand-muted uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">{t('overview.colShipment')}</th>
                <th className="px-6 py-3">{t('overview.colRoute')}</th>
                <th className="px-6 py-3">{t('overview.colMode')}</th>
                <th className="px-6 py-3">{t('overview.colCarrier')}</th>
                <th className="px-6 py-3">{t('overview.colStatus')}</th>
                <th className="px-6 py-3">{t('overview.colRisk')}</th>
              </tr>
            </thead>
            <tbody>
              {criticalAlerts.length > 0 ? criticalAlerts.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{s.id}</td>
                  <td className="px-6 py-4 text-gray-600">{s.originCity} &rarr; {s.destinationCity}</td>
                  <td className="px-6 py-4"><ModeBadge mode={s.mode} /></td>
                  <td className="px-6 py-4 text-gray-600">{s.carrier || t('overview.unknown')}</td>
                  <td className="px-6 py-4">
                    <span className={s.delayDays > 0 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {s.delayDays > 0 ? formatDelay(s.delayDays, t) : t(`data.status.${s.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4"><RiskBadge level={s.riskLevel} /></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {t('overview.noAlerts')}
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
