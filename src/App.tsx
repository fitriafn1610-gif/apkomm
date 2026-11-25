import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  ClipboardCheck,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  PieChart,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { AnalysisResultsView } from './components/AnalysisResultsView';
import { DashboardView } from './components/DashboardView';
import { EvaluationView } from './components/EvaluationView';
import { InfluencersView } from './components/InfluencersView';
import { SentimentAnalysisView } from './components/SentimentAnalysisView';
import { SettingsView } from './components/SettingsView';
import { INITIAL_INFLUENCERS, INITIAL_SETTINGS } from './data/mockData';
import {
  AppSettings,
  AudienceComment,
  EvaluationRecord,
  Influencer,
  NavSection,
} from './types';
import {
  analyzeCommentSentiment,
  computeSentimentSummary,
} from './utils/sentimentEngine';

const STORAGE_KEY_INFLUENCERS = 'brandscope_influencers_v1';
const STORAGE_KEY_SETTINGS = 'brandscope_settings_v1';

const NAV_ITEMS: {
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'influencers', label: 'Influencer', icon: Users },
  { id: 'sentiment', label: 'Analisis Sentimen', icon: MessageSquareText },
  { id: 'results', label: 'Hasil Analisis', icon: PieChart },
  { id: 'evaluation', label: 'Evaluasi', icon: ClipboardCheck },
  { id: 'settings', label: 'Pengaturan', icon: Settings },
];

function BrandScopeMark() {
  return (
    <svg
      viewBox="0 0 36 36"
      className="w-8 h-8 shrink-0"
      fill="none"
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="9" fill="#6D28D9" fillOpacity="0.22" />
      <path
        d="M18 7C15.5 11.2 14.5 14.8 18 20.5C21.5 14.8 20.5 11.2 18 7Z"
        stroke="#A5B4FC"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M18 20.5C13.2 18.8 10.2 15.6 9 11.8C13.1 12.2 16 14.9 18 20.5Z"
        stroke="#38BDF8"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path
        d="M18 20.5C22.8 18.8 25.8 15.6 27 11.8C22.9 12.2 20 14.9 18 20.5Z"
        stroke="#38BDF8"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 24.5C13.4 22.8 16.1 22.2 18 22.2C19.9 22.2 22.6 22.8 25.5 24.5"
        stroke="#E2E8F0"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="18" cy="27.5" r="1.5" fill="#38BDF8" />
    </svg>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [influencers, setInfluencers] = useState<Influencer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INFLUENCERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fall back to simulation data
    }
    return INITIAL_INFLUENCERS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fall back to default settings
    }
    return INITIAL_SETTINGS;
  });

  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string>(
    () => influencers[0]?.id || ''
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INFLUENCERS, JSON.stringify(influencers));
    } catch {
      // Ignore storage quota errors
    }
  }, [influencers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore storage quota errors
    }
  }, [settings]);

  const handleNavigate = (section: NavSection) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const handleSelectInfluencer = (id: string, targetSection?: NavSection) => {
    setSelectedInfluencerId(id);
    if (targetSection) {
      setActiveSection(targetSection);
      setMobileMenuOpen(false);
    }
  };

  const handleAddInfluencer = (
    data: Omit<
      Influencer,
      'id' | 'isSimulation' | 'lastAnalyzedAt' | 'comments' | 'trend' | 'evaluation'
    >
  ) => {
    const newId = `inf-${Date.now()}`;
    const newInfluencer: Influencer = {
      ...data,
      id: newId,
      isSimulation: false,
      lastAnalyzedAt: null,
      comments: [],
      trend: [
        { label: 'Mei', positif: 0, netral: 0, negatif: 0 },
        { label: 'Jun', positif: 0, netral: 0, negatif: 0 },
        { label: 'Jul', positif: 0, netral: 0, negatif: 0 },
        { label: 'Agu', positif: 0, netral: 0, negatif: 0 },
        { label: 'Sep', positif: 0, netral: 0, negatif: 0 },
        { label: 'Okt', positif: 0, netral: 0, negatif: 0 },
      ],
      evaluation: {
        decision: 'belum_dievaluasi',
        brandFitScore: 7,
        messageClarityScore: 7,
        audienceTrustScore: 7,
        notes: '',
        evaluatedAt: null,
        evaluatorName: settings.prLeadName,
      },
    };

    setInfluencers((prev) => [newInfluencer, ...prev]);
    setSelectedInfluencerId(newId);
    setActiveSection('sentiment');
  };

  const handleDeleteInfluencer = (id: string) => {
    setInfluencers((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (selectedInfluencerId === id) {
        setSelectedInfluencerId(next[0]?.id || '');
      }
      return next;
    });
  };

  const handleAddComments = (
    influencerId: string,
    entries: { author: string; platform: string; text: string }[]
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    const newComments: AudienceComment[] = entries.map((entry, idx) => {
      const analyzed = analyzeCommentSentiment(entry.text);
      return {
        id: `c-${Date.now()}-${idx}`,
        author: entry.author,
        platform: entry.platform,
        text: entry.text,
        createdAt: today,
        sentiment: analyzed.sentiment,
        score: analyzed.score,
        matchedKeywords: analyzed.matchedKeywords,
        isSimulation: false,
      };
    });

    setInfluencers((prev) =>
      prev.map((inf) => {
        if (inf.id !== influencerId) return inf;
        const updatedComments = [...newComments, ...inf.comments];
        const summary = computeSentimentSummary(
          updatedComments,
          settings.positiveThreshold,
          settings.negativeAlertThreshold
        );
        const updatedTrend = [...inf.trend];
        if (updatedTrend.length > 0) {
          updatedTrend[updatedTrend.length - 1] = {
            ...updatedTrend[updatedTrend.length - 1],
            positif: summary.positifPct,
            netral: summary.netralPct,
            negatif: summary.negatifPct,
          };
        }
        return {
          ...inf,
          comments: updatedComments,
          trend: updatedTrend,
        };
      })
    );
  };

  const handleDeleteComment = (influencerId: string, commentId: string) => {
    setInfluencers((prev) =>
      prev.map((inf) => {
        if (inf.id !== influencerId) return inf;
        const updatedComments = inf.comments.filter((c) => c.id !== commentId);
        const summary = computeSentimentSummary(
          updatedComments,
          settings.positiveThreshold,
          settings.negativeAlertThreshold
        );
        const updatedTrend = [...inf.trend];
        if (updatedTrend.length > 0) {
          updatedTrend[updatedTrend.length - 1] = {
            ...updatedTrend[updatedTrend.length - 1],
            positif: summary.positifPct,
            netral: summary.netralPct,
            negatif: summary.negatifPct,
          };
        }
        return {
          ...inf,
          comments: updatedComments,
          trend: updatedTrend,
        };
      })
    );
  };

  const handleRunAnalysis = (influencerId: string) => {
    const nowLabel = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setInfluencers((prev) =>
      prev.map((inf) => {
        if (inf.id !== influencerId) return inf;
        const reanalyzedComments = inf.comments.map((comment) => {
          const result = analyzeCommentSentiment(comment.text);
          return {
            ...comment,
            sentiment: result.sentiment,
            score: result.score,
            matchedKeywords: result.matchedKeywords,
          };
        });
        const summary = computeSentimentSummary(
          reanalyzedComments,
          settings.positiveThreshold,
          settings.negativeAlertThreshold
        );
        const updatedTrend = [...inf.trend];
        if (updatedTrend.length > 0) {
          updatedTrend[updatedTrend.length - 1] = {
            ...updatedTrend[updatedTrend.length - 1],
            positif: summary.positifPct,
            netral: summary.netralPct,
            negatif: summary.negatifPct,
          };
        }
        return {
          ...inf,
          lastAnalyzedAt: nowLabel,
          comments: reanalyzedComments,
          trend: updatedTrend,
        };
      })
    );
  };

  const handleSaveEvaluation = (
    influencerId: string,
    record: EvaluationRecord
  ) => {
    setInfluencers((prev) =>
      prev.map((inf) =>
        inf.id === influencerId ? { ...inf, evaluation: record } : inf
      )
    );
  };

  const handleResetSimulationData = () => {
    setInfluencers(INITIAL_INFLUENCERS);
    setSettings(INITIAL_SETTINGS);
    setSelectedInfluencerId(INITIAL_INFLUENCERS[0]?.id || '');
  };

  const activeNavLabel =
    NAV_ITEMS.find((item) => item.id === activeSection)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Desktop Navy Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-[#0F1E3D] text-slate-100 min-h-screen sticky top-0 h-screen justify-between border-r border-[#1E335C]">
        <div>
          <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <BrandScopeMark />
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              BrandScope
            </span>
          </div>

          <nav className="px-3 py-5 space-y-1" aria-label="Navigasi Utama">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#6D28D9] text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs font-medium text-white truncate">{settings.prLeadName}</p>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            Public Relations · {settings.brandName}
          </p>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 w-64 max-w-[80vw] bg-[#0F1E3D] text-white h-full flex flex-col justify-between">
            <div>
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <BrandScopeMark />
                  <span className="text-base font-bold">BrandScope</span>
                </div>
                <button
                  type="button"
                  aria-label="Tutup menu navigasi"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="px-3 py-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-[#6D28D9] text-white'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="px-5 py-4 border-t border-white/10 text-xs text-slate-300">
              {settings.prLeadName} · {settings.brandName}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Buka menu navigasi"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-slate-400 hidden sm:inline">BrandScope</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <h1 className="font-semibold text-slate-900 truncate">
                {activeNavLabel}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="hidden md:inline text-xs text-slate-500 whitespace-nowrap">
              Data Simulasi & Input Manual
            </span>
            <button
              type="button"
              onClick={() =>
                handleNavigate(
                  activeSection === 'sentiment' ? 'results' : 'sentiment'
                )
              }
              className="px-3.5 py-2 text-xs font-medium text-white bg-[#0F1E3D] hover:bg-[#192E59] rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>
                {activeSection === 'sentiment' ? 'Lihat Hasil' : 'Input Komentar'}
              </span>
            </button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1280px] w-full mx-auto">
          {activeSection === 'dashboard' && (
            <DashboardView
              influencers={influencers}
              settings={settings}
              onNavigate={handleNavigate}
              onSelectInfluencer={handleSelectInfluencer}
            />
          )}

          {activeSection === 'influencers' && (
            <InfluencersView
              influencers={influencers}
              selectedInfluencerId={selectedInfluencerId}
              settings={settings}
              onSelectInfluencer={handleSelectInfluencer}
              onAddInfluencer={handleAddInfluencer}
              onDeleteInfluencer={handleDeleteInfluencer}
            />
          )}

          {activeSection === 'sentiment' && (
            <SentimentAnalysisView
              influencers={influencers}
              selectedInfluencerId={selectedInfluencerId}
              settings={settings}
              onSelectInfluencerId={setSelectedInfluencerId}
              onAddComments={handleAddComments}
              onDeleteComment={handleDeleteComment}
              onRunAnalysis={handleRunAnalysis}
              onNavigate={handleNavigate}
            />
          )}

          {activeSection === 'results' && (
            <AnalysisResultsView
              influencers={influencers}
              selectedInfluencerId={selectedInfluencerId}
              settings={settings}
              onSelectInfluencerId={setSelectedInfluencerId}
              onNavigate={handleNavigate}
            />
          )}

          {activeSection === 'evaluation' && (
            <EvaluationView
              influencers={influencers}
              selectedInfluencerId={selectedInfluencerId}
              settings={settings}
              onSelectInfluencerId={setSelectedInfluencerId}
              onSaveEvaluation={handleSaveEvaluation}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={setSettings}
              onResetSimulationData={handleResetSimulationData}
            />
          )}
        </main>

        <footer className="px-6 py-4 border-t border-slate-200 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 no-print">
          <span>
            BrandScope · Evaluasi Pengaruh Influencer & Sentimen Audiens
          </span>
          <span>
            Catatan: Contoh awal menggunakan data simulasi, analisis berjalan secara
            lokal dari input manual.
          </span>
        </footer>
      </div>
    </div>
  );
}
