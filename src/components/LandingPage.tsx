import React, { ReactNode } from 'react';
import { ArrowRight, BarChart3, Map, Truck, ShieldAlert, Cpu, Activity, Upload, Settings, RefreshCw, Globe, Download } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const { t, language, setLanguage } = useLanguage();
  
  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="CargoPilot Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-brand-blue tracking-tight">CargoPilot</h1>
              <p className="text-xs text-brand-muted mt-0.5 leading-snug">{t('sidebar.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-brand-muted flex items-center border border-gray-200 shadow-sm text-xs font-bold uppercase"
            >
              <Globe className="w-4 h-4 mr-1.5" />
              {language}
            </button>
            <button 
              onClick={onStart}
              className="px-5 py-2 bg-brand-blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              {t('landing.cta')}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 mt-8">
            {t('landing.heroTitle')} <span className="text-brand-blue">{t('landing.heroHighlight')}</span> {t('landing.heroSub')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            {t('landing.heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button 
              onClick={onStart}
              className="px-8 py-3 bg-brand-blue text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center"
            >
              {t('landing.heroTry')} <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button 
              onClick={scrollToFeatures}
              className="px-8 py-3 bg-white text-gray-700 text-lg font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {t('landing.heroFeatures')}
            </button>
          </div>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            {t('landing.heroDataNote')}
          </p>
        </div>

        {/* Features Section */}
        <div id="features" className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-16">{t('landing.featuresTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
                title={t('landing.feat1Title')}
                desc={t('landing.feat1Desc')}
              />
              <FeatureCard 
                icon={<Map className="w-6 h-6 text-green-600" />}
                title={t('landing.feat2Title')}
                desc={t('landing.feat2Desc')}
              />
              <FeatureCard 
                icon={<Truck className="w-6 h-6 text-purple-600" />}
                title={t('landing.feat3Title')}
                desc={t('landing.feat3Desc')}
              />
              <FeatureCard 
                icon={<ShieldAlert className="w-6 h-6 text-red-600" />}
                title={t('landing.feat4Title')}
                desc={t('landing.feat4Desc')}
              />
              <FeatureCard 
                icon={<Activity className="w-6 h-6 text-orange-600" />}
                title={t('landing.feat5Title')}
                desc={t('landing.feat5Desc')}
              />
              <FeatureCard 
                icon={<Cpu className="w-6 h-6 text-indigo-600" />}
                title={t('landing.feat6Title')}
                desc={t('landing.feat6Desc')}
              />
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-16">{t('landing.howItWorks')}</h3>
            <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12 md:gap-8 relative">
              <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-gray-200 z-0"></div>
              
              <div className="flex flex-col items-center text-center relative z-10 flex-1 px-4">
                <StepCard 
                  number="1"
                  icon={<Upload className="w-5 h-5 text-gray-600" />}
                  title={t('landing.step1')}
                  desc={t('landing.step1Desc')}
                />
                <a 
                  href="/CargoPilot_template.csv" 
                  download="CargoPilot_template.csv"
                  className="mt-4 text-xs font-bold text-brand-blue hover:underline flex items-center"
                >
                  <Download className="w-3 h-3 mr-1" /> {t('common.downloadTemplate')}
                </a>
              </div>
              <StepCard 
                number="2"
                icon={<Settings className="w-5 h-5 text-gray-600" />}
                title={t('landing.step2')}
                desc={t('landing.step2Desc')}
              />
              <StepCard 
                number="3"
                icon={<RefreshCw className="w-5 h-5 text-gray-600" />}
                title={t('landing.step3')}
                desc={t('landing.step3Desc')}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-8 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} CargoPilot. {t('landing.footer')}</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ number, icon, title, desc }: { number: string, icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex flex-col items-center text-center relative z-10 flex-1 px-4">
    <div className="w-14 h-14 rounded-full bg-white border-4 border-gray-50 shadow-sm flex items-center justify-center mb-4 text-lg font-bold text-brand-blue">
      {number}
    </div>
    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
      {icon}
    </div>
    <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-gray-500 text-sm max-w-[280px]">{desc}</p>
  </div>
);
