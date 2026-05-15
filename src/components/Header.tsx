import { Filter } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface HeaderProps {
  title: string;
  filters: { mode: string, riskLevel: string, carrier: string };
  setFilters: (f: any) => void;
  carriersList: string[];
}

export const Header = ({ title, filters, setFilters, carriersList }: HeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-500 mr-2">
            <Filter className="w-4 h-4 mr-2" />
            {t('common.filters')}
          </div>
          <select 
            className="border-gray-300 rounded-md text-sm pl-3 pr-8 py-2 border shadow-sm outline-none focus:ring-1 focus:ring-brand-blue"
            value={filters.mode}
            onChange={(e) => setFilters({...filters, mode: e.target.value})}
          >
            <option value="All">{t('data.modes.All')}</option>
            <option value="Road">{t('data.modes.Road')}</option>
            <option value="Sea">{t('data.modes.Sea')}</option>
            <option value="Air">{t('data.modes.Air')}</option>
          </select>
          
          <select 
            className="border-gray-300 rounded-md text-sm pl-3 pr-8 py-2 border shadow-sm outline-none focus:ring-1 focus:ring-brand-blue"
            value={filters.riskLevel}
            onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
          >
            <option value="All">{t('data.risks.All')}</option>
            <option value="Low">{t('data.risks.Low')}</option>
            <option value="Medium">{t('data.risks.Medium')}</option>
            <option value="High">{t('data.risks.High')}</option>
            <option value="Critical">{t('data.risks.Critical')}</option>
          </select>

          <select 
            className="border-gray-300 rounded-md text-sm pl-3 pr-8 py-2 border shadow-sm outline-none focus:ring-1 focus:ring-brand-blue max-w-[200px]"
            value={filters.carrier}
            onChange={(e) => setFilters({...filters, carrier: e.target.value})}
          >
            <option value="All">{t('common.allCarriers')}</option>
            {carriersList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </header>
  );
};
