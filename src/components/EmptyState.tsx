import React from 'react';
import { SearchX, FilterX } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: 'search' | 'filter';
}

export const EmptyState = ({ 
  title, 
  message,
  icon = 'filter'
}: EmptyStateProps) => {
  const { t } = useLanguage();
  
  const displayTitle = title || t('common.noData');
  const displayMessage = message || t('common.noDataMsg');

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-200">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        {icon === 'search' ? (
          <SearchX className="w-8 h-8 text-gray-400" />
        ) : (
          <FilterX className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{displayTitle}</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
        {displayMessage}
      </p>
    </div>
  );
};
