import { ReactNode } from "react";

export const ChartCard = ({ title, children, description }: { title: string, children: ReactNode, description?: string }) => {
  return (
    <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100 flex flex-col h-full">
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-xs text-gray-500 mb-6">{description}</p>}
      <div className="flex-1 w-full relative min-h-[250px]">
        {children}
      </div>
    </div>
  );
};
