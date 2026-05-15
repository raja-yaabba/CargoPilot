export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercent = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('fr-FR').format(value);
};

export const formatDelay = (days: number, t?: (key: string) => string) => {
  if (days === 0) return t ? t('data.delays.ontime') : 'À l\'heure';
  if (days < 0) return t ? t('data.delays.advance').replace('{days}', Math.abs(days).toString()) : `${Math.abs(days)} jours d'avance`;
  return t ? t('data.delays.delay').replace('{days}', days.toString()) : `${days} jours de retard`;
};

export const formatCo2 = (kg: number, t?: (key: string) => string) => {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} ${t ? t('common.tonUnit') : 't'}`;
  return `${Math.round(kg)} ${t ? t('common.kgUnit') : 'kg'}`;
};

