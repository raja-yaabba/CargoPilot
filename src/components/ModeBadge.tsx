import { Plane, Ship, Truck } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export const ModeBadge = ({ mode }: { mode: string }) => {
  const { t } = useLanguage();
  const Icon = mode === 'Air' ? Plane : mode === 'Sea' ? Ship : Truck;
  
  return (
    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
      <Icon className="w-3 h-3 mr-1" />
      {t(`data.modes.${mode}`)}
    </span>
  );
};
