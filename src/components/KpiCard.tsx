import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
}

export const KpiCard = ({ title, value, icon, subtitle }: KpiCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="text-brand-muted bg-gray-50 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="mt-auto">
        <div className="text-3xl font-semibold text-gray-900">{value}</div>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
