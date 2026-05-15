import React from 'react';
import { LayoutDashboard, Map as MapIcon, Truck, AlertTriangle, Database, Wand2, Globe } from 'lucide-react';
import { clsx } from "clsx";
import { useLanguage } from './LanguageContext';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ activePage, setActivePage, isOpen, onClose }: SidebarProps) => {
  const { t, language, setLanguage } = useLanguage();
  
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: t('pages.overview') },
    { id: 'map', icon: MapIcon, label: t('pages.map') },
    { id: 'carriers', icon: Truck, label: t('pages.carriers') },
    { id: 'routes', icon: AlertTriangle, label: t('pages.routes') },
    { id: 'quality', icon: Database, label: t('pages.quality') },
    { id: 'simulation', icon: Wand2, label: t('pages.simulation') },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={clsx(
        "w-64 bg-white border-r border-[#E5E7EB] h-screen flex flex-col fixed left-0 top-0 z-[70] transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-brand-blue tracking-tight">CargoPilot</h1>
            <p className="text-xs text-brand-muted mt-1 leading-snug">
              {t('sidebar.subtitle').split('&').map((part, i, arr) => (
                <React.Fragment key={part}>
                  {part}
                  {i < arr.length - 1 && <>&<br/></>}
                </React.Fragment>
              ))}
            </p>
          </div>
          <button 
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-brand-muted flex items-center justify-center border border-gray-100 shadow-sm"
            title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
          >
            <Globe className="w-4 h-4 mr-1.5" />
            <span className="text-[10px] font-bold uppercase">{language}</span>
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={clsx(
                  "w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-brand-blue-light text-brand-blue" 
                    : "text-brand-muted hover:bg-gray-50 hover:text-brand-text"
                )}
              >
                <Icon className={clsx("w-5 h-5 mr-3", isActive ? "text-brand-blue" : "text-brand-muted")} />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[#E5E7EB]">
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700 block mb-2">{t('sidebar.about')}</span>
            {t('sidebar.aboutDesc')}
          </div>
        </div>
      </div>
    </>
  );
};
