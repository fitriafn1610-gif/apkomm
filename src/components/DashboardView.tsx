import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  MessageSquarePlus,
  TrendingUp,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { AppSettings, Influencer, NavSection } from '../types';
import { computeSentimentSummary } from '../utils/sentimentEngine';
import { SentimentDonutChart, SentimentLineChart } from './Charts';
import { InfluencerAvatar } from './InfluencerAvatar';

interface DashboardViewProps {
  influencers: Influencer[];
  settings: AppSettings;
  onNavigate: (section: NavSection) => void;
  onSelectInfluencer: (id: string, targetSection?: NavSection) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  influencers,
  settings,
  onNavigate,
  onSelectInfluencer,
}) => {
  const [trendFilterId, setTrendFilterId] = useState<string>('all');

  const aggregate = useMemo(() => {
    const allComments = influencers.flatMap((inf) => inf.comments);
    return computeSentimentSummary(
      allComments,
      settings.positiveThreshold,
      settings.negativeAlertThreshold
    );
  }, [influencers, settings]);

  const influencerMetrics = useMemo(() => {
    return influencers.map((inf) => ({
      influencer: inf,
      summary: computeSentimentSummary(
        inf.comments,
        settings.positiveThreshold,
        settings.negativeAlertThreshold
      ),
    }));
  }, [influencers, settings]);

  const topInfluencer = useMemo(() => {
    if (influencerMetrics.length === 0) return null;
    return [...influencerMetrics].sort(
      (a, b) => b.summary.positifPct - a.summary.positifPct
    )[0];
  }, [influencerMetrics]);

  const trendData = useMemo(() => {
    if (trendFilterId !== 'all') {
      const found = influencers.find((inf) => inf.id === trendFilterId);
      return found?.trend ?? [];
    }

    const baseTrend = influencers[0]?.trend ?? [];
    if (baseTrend.length === 0 || influencers.length === 0) return [];

    return baseTrend.map((point, idx) => {
      let sumPos = 0;
      let sumNet = 0;
      let sumNeg = 0;
      let count = 0;

      for (const inf of influencers) {
        const p = inf.trend[idx];
        if (p) {
          sumPos += p.positif;
          sumNet += p.netral;
          sumNeg += p.negatif;
          count++;
        }
      }

      if (count === 0) return point;
      const pos = Math.round(sumPos / count);
      const neg = Math.round(sumNeg / count);
      const net = Math.max(0, 100 - pos - neg);
      return {
        label: point.label,
        positif: pos,
        netral: net,
        negatif: neg,
      };
    });
  }, [influencers, trendFilterId]);

  const workflowSteps = [
    {
      step: '01',
      title: 'Pilih Influencer',
      desc: 'Tentukan kreator atau tambahkan profil baru.',
      target: 'influencers' as NavSection,
    },
    {
      step: '02',
      title: 'Input Data Audiens',
      desc: 'Masukkan komentar audiens secara manual.',
      target: 'sentiment' as NavSection,
    },
    {
      step: '03',
      title: 'Analisis Citra Merek',
      desc: 'Tinjau dampak sentimen dan rekomendasi.',
      target: 'results' as NavSection,
    },
    {
      step: '04',
      title: 'Evaluasi Keputusan',
      desc: 'Tetapkan kelanjutan kerja sama tim PR.',
      target: 'evaluation' as NavSection,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner Intro */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-indigo-700 mb-1">
            Ringkasan Pemantauan · {settings.brandName}
          </p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Halo, {settings.prLeadName}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Pantau bagaimana respons audiens terhadap kolaborasi influencer memengaruhi
            citra merek. Data awal pada halaman ini adalah{' '}
            <span className="font-medium text-slate-800">data simulasi</span> untuk
            demonstrasi, dan Anda dapat menambahkan input komentar manual kapan saja.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('influencers')}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            Kelola Influencer
          </button>
          <button
            type="button"
            onClick={() => onNavigate('sentiment')}
            className="px-4 py-2.5 text-sm font-medium text-white bg-[#0F1E3D] hover:bg-[#192E59] rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Mulai Analisis Sentimen</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Influencer Dianalisis</span>
            <Users className="w-4 h-4 text-[#0F1E3D]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {influencers.length}
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {aggregate.total} komentar total
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Sentimen Positif</span>
            <CheckCircle2 className="w-4 h-4 text-[#6D28D9]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#6D28D9] font-mono tabular-nums">
              {aggregate.positifPct}%
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {aggregate.positifCount} komentar
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Sentimen Netral</span>
            <TrendingUp className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#0284C7] font-mono tabular-nums">
              {aggregate.netralPct}%
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {aggregate.netralCount} komentar
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Sentimen Negatif</span>
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#DC2626] font-mono tabular-nums">
              {aggregate.negatifPct}%
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {aggregate.negatifCount} komentar
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Grafik Perkembangan Sentimen Audiens
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pergerakan persentase respons positif, netral, dan negatif per periode
              </p>
            </div>
            <select
              aria-label="Filter grafik perkembangan sentimen berdasarkan influencer"
              value={trendFilterId}
              onChange={(e) => setTrendFilterId(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Rata-rata Semua Influencer</option>
              {influencers.map((inf) => (
                <option key={inf.id} value={inf.id}>
                  {inf.name}
                </option>
              ))}
            </select>
          </div>

          <SentimentLineChart data={trendData} />
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Distribusi Sentimen Gabungan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-5">
              Akumulasi seluruh komentar audiens yang telah dianalisis
            </p>
            <SentimentDonutChart
              positifPct={aggregate.positifPct}
              netralPct={aggregate.netralPct}
              negatifPct={aggregate.negatifPct}
              positifCount={aggregate.positifCount}
              netralCount={aggregate.netralCount}
              negatifCount={aggregate.negatifCount}
              total={aggregate.total}
            />
          </div>

          {topInfluencer && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <InfluencerAvatar
                  src={topInfluencer.influencer.avatarUrl}
                  name={topInfluencer.influencer.name}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Influencer Paling Positif</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {topInfluencer.influencer.name}
                  </p>
                  <p className="text-xs text-slate-500 font-mono tabular-nums">
                    {topInfluencer.summary.positifPct}% Positif ·{' '}
                    {topInfluencer.influencer.handle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onSelectInfluencer(topInfluencer.influencer.id, 'results')
                }
                className="text-xs font-medium text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <span>Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Workflow Steps */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Alur Kerja Evaluasi BrandScope
            </h3>
            <p className="text-xs text-slate-500">
              Ikuti tahapan berikut untuk menganalisis pengaruh influencer terhadap citra
              merek
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => onNavigate(item.target)}
              className="text-left p-4 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50/70 transition-colors group"
            >
              <span className="text-xs font-mono font-semibold text-indigo-700">
                Langkah {item.step}
              </span>
              <h4 className="text-sm font-semibold text-slate-900 mt-1 flex items-center justify-between">
                <span>{item.title}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-700 transition-colors" />
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Influencer Overview Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Ringkasan Pengaruh per Influencer
            </h3>
            <p className="text-xs text-slate-500">
              Klik salah satu baris untuk melihat analisis citra merek dan rekomendasi
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('evaluation')}
            className="text-xs font-medium text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Buka Halaman Evaluasi</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="py-3 px-6">Influencer</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Komentar</th>
                <th className="py-3 px-4 text-right">Positif</th>
                <th className="py-3 px-4 text-right">Netral</th>
                <th className="py-3 px-4 text-right">Negatif</th>
                <th className="py-3 px-4">Kecenderungan Citra Merek</th>
                <th className="py-3 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {influencerMetrics.map(({ influencer, summary }) => (
                <tr
                  key={influencer.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <InfluencerAvatar
                        src={influencer.avatarUrl}
                        name={influencer.name}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{influencer.name}</p>
                        <p className="text-xs text-slate-500">
                          {influencer.handle} · {influencer.platform}
                          {influencer.isSimulation ? ' · Simulasi' : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {influencer.category}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                    {summary.total}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-medium text-[#6D28D9]">
                    {summary.positifPct}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#0284C7]">
                    {summary.netralPct}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#DC2626]">
                    {summary.negatifPct}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-medium inline-flex items-center gap-1.5 ${
                        summary.total === 0
                          ? 'text-slate-500'
                          : summary.isPositiveImpact
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                      }`}
                    >
                      {summary.total === 0 ? (
                        'Menunggu Data'
                      ) : summary.isPositiveImpact ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{summary.impactLabel}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{summary.impactLabel}</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectInfluencer(influencer.id, 'results')}
                      className="text-xs font-medium text-indigo-700 hover:text-indigo-900 whitespace-nowrap"
                    >
                      Lihat Analisis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
