import React, { useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  MessageSquarePlus,
  ThumbsUp,
  Wrench,
} from 'lucide-react';
import { AppSettings, Influencer, NavSection } from '../types';
import { computeSentimentSummary } from '../utils/sentimentEngine';
import { SentimentBarChart, SentimentDonutChart } from './Charts';
import { InfluencerAvatar } from './InfluencerAvatar';

interface AnalysisResultsViewProps {
  influencers: Influencer[];
  selectedInfluencerId: string;
  settings: AppSettings;
  onSelectInfluencerId: (id: string) => void;
  onNavigate: (section: NavSection) => void;
}

export const AnalysisResultsView: React.FC<AnalysisResultsViewProps> = ({
  influencers,
  selectedInfluencerId,
  settings,
  onSelectInfluencerId,
  onNavigate,
}) => {
  const influencer =
    influencers.find((i) => i.id === selectedInfluencerId) || influencers[0];

  const summary = useMemo(() => {
    if (!influencer) {
      return computeSentimentSummary([], settings.positiveThreshold, settings.negativeAlertThreshold);
    }
    return computeSentimentSummary(
      influencer.comments,
      settings.positiveThreshold,
      settings.negativeAlertThreshold
    );
  }, [influencer, settings]);

  const barItems = useMemo(() => {
    return influencers.map((inf) => {
      const s = computeSentimentSummary(
        inf.comments,
        settings.positiveThreshold,
        settings.negativeAlertThreshold
      );
      return {
        id: inf.id,
        label: inf.name,
        positifPct: s.positifPct,
        netralPct: s.netralPct,
        negatifPct: s.negatifPct,
        totalComments: s.total,
      };
    });
  }, [influencers, settings]);

  if (!influencer) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
        <p className="text-sm text-slate-600">
          Tambahkan influencer dan data komentar terlebih dahulu untuk melihat hasil
          analisis.
        </p>
      </div>
    );
  }

  const positiveRecommendations = [
    {
      title: 'Perpanjang Kerja Sama Jangka Menengah / Panjang',
      detail:
        'Pertimbangkan perpanjangan kontrak ke skema seri konten berkelanjutan atau duta kampanye musiman untuk menjaga konsistensi persepsi positif.',
    },
    {
      title: 'Perkuat Pesan Edukasi yang Sudah Terbukti Efektif',
      detail:
        'Pertahankan format penyampaian yang informatif dan jujur karena terbukti meningkatkan kepercayaan audiens terhadap kualitas produk.',
    },
    {
      title: 'Manfaatkan Ulasan Audiens sebagai Aset Komunikasi PR',
      detail:
        'Kurasi respons positif audiens sebagai bukti sosial (social proof) pada kanal komunikasi resmi merek.',
    },
  ];

  const improvementRecommendations = [
    {
      title: 'Audit Keselarasan Pesan & Gaya Promosi',
      detail:
        'Kurangi gaya penyampaian hard-selling atau klaim berlebihan yang memicu skeptisisme audiens. Ganti dengan demonstrasi penggunaan yang lebih realistis.',
    },
    {
      title: 'Lakukan Briefing Ulang Materi Komunikasi',
      detail:
        'Berikan panduan poin informasi produk (keunggulan nyata, cara pakai, dan transparansi iklan) sebelum materi kampanye berikutnya ditayangkan.',
    },
    {
      title: 'Siapkan Strategi Mitigasi & Klarifikasi Audiens',
      detail:
        'Tindak lanjuti keluhan utama pada kolom komentar dengan konten Tanya-Jawab (Q&A) atau uji coba terbatas sebelum memutuskan kontrak lanjutan.',
    },
  ];

  const activeRecommendations = summary.isPositiveImpact
    ? positiveRecommendations
    : improvementRecommendations;

  return (
    <div className="space-y-6">
      {/* Influencer Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <InfluencerAvatar
            src={influencer.avatarUrl}
            name={influencer.name}
            size="lg"
          />
          <div>
            <p className="text-xs font-medium text-indigo-700">
              Langkah 5 & 6 · Analisis Pengaruh terhadap Citra Merek
            </p>
            <h2 className="text-xl font-bold text-slate-900">{influencer.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {influencer.handle} · {influencer.category} · Kampanye:{' '}
              {influencer.campaignTitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Pilih influencer untuk melihat hasil analisis"
            value={influencer.id}
            onChange={(e) => onSelectInfluencerId(e.target.value)}
            className="px-3.5 py-2 text-sm font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {influencers.map((inf) => (
              <option key={inf.id} value={inf.id}>
                {inf.name} ({inf.handle})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onNavigate('sentiment')}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Tambah Komentar</span>
          </button>
        </div>
      </div>

      {/* Brand Image Impact Verdict Card */}
      <div
        className={`rounded-xl p-6 border ${
          summary.total === 0
            ? 'bg-white border-slate-200'
            : summary.isPositiveImpact
              ? 'bg-emerald-50/50 border-emerald-200'
              : 'bg-amber-50/60 border-amber-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold">
              {summary.total === 0 ? (
                <span className="text-slate-600">Status Data Kosong</span>
              ) : summary.isPositiveImpact ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kesimpulan: Pengaruh Positif terhadap Citra Merek</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Kesimpulan: Pengaruh Tidak Positif / Perlu Perbaikan</span>
                </span>
              )}
            </div>

            <h3 className="text-2xl font-bold text-slate-900">{summary.impactLabel}</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {summary.impactDescription}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-white border border-slate-200 rounded-xl p-4 shrink-0 font-mono tabular-nums">
            <div className="text-center px-2">
              <p className="text-[11px] font-sans text-slate-500">Skor Bersih</p>
              <p
                className={`text-xl font-bold mt-1 ${
                  summary.netSentimentScore >= 0 ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {summary.netSentimentScore > 0
                  ? `+${summary.netSentimentScore}`
                  : summary.netSentimentScore}
              </p>
            </div>
            <div className="text-center px-2 border-x border-slate-100">
              <p className="text-[11px] font-sans text-slate-500">Ambang Target</p>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {settings.positiveThreshold}%
              </p>
            </div>
            <div className="text-center px-2">
              <p className="text-[11px] font-sans text-slate-500">Total Sampel</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{summary.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts: Donut + Bar Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-slate-900">
            Diagram Lingkaran Sentimen
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-5">
            Rincian respons audiens terhadap {influencer.name}
          </p>
          <SentimentDonutChart
            positifPct={summary.positifPct}
            netralPct={summary.netralPct}
            negatifPct={summary.negatifPct}
            positifCount={summary.positifCount}
            netralCount={summary.netralCount}
            negatifCount={summary.negatifCount}
            total={summary.total}
          />

          {/* Dominant Keywords */}
          <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1.5">
                Kata Kunci Positif Dominan
              </p>
              {summary.topPositiveKeywords.length > 0 ? (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {summary.topPositiveKeywords
                    .map((k) => `${k.word} (${k.count})`)
                    .join(' · ')}
                </p>
              ) : (
                <p className="text-xs text-slate-400">Belum terdeteksi</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1.5">
                Kata Kunci Keluhan / Negatif
              </p>
              {summary.topNegativeKeywords.length > 0 ? (
                <p className="text-xs text-red-700 leading-relaxed">
                  {summary.topNegativeKeywords
                    .map((k) => `${k.word} (${k.count})`)
                    .join(' · ')}
                </p>
              ) : (
                <p className="text-xs text-slate-400">Tidak ada keluhan menonjol</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-slate-900">
            Grafik Batang Perbandingan Antar Influencer
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-5">
            Klik salah satu baris untuk membandingkan hasil analisis influencer lain
          </p>
          <SentimentBarChart
            items={barItems}
            selectedId={influencer.id}
            onSelect={(id) => onSelectInfluencerId(id)}
          />
        </div>
      </div>

      {/* Recommendation Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                summary.isPositiveImpact
                  ? 'bg-indigo-50 text-[#6D28D9]'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {summary.isPositiveImpact ? (
                <ThumbsUp className="w-5 h-5" />
              ) : (
                <Wrench className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">
                Rekomendasi Keputusan Berdasarkan Hasil Analisis
              </p>
              <h3 className="text-lg font-bold text-slate-900">
                {summary.isPositiveImpact
                  ? 'Rekomendasi: Lanjutkan Kerja Sama'
                  : 'Rekomendasi: Perbaiki Strategi Komunikasi'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('evaluation')}
            className="px-4 py-2.5 text-sm font-medium text-white bg-[#0F1E3D] hover:bg-[#192E59] rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Lanjut ke Evaluasi Influencer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeRecommendations.map((rec, index) => (
            <div
              key={rec.title}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2"
            >
              <span className="text-xs font-mono font-semibold text-indigo-700">
                Saran 0{index + 1}
              </span>
              <h4 className="text-sm font-semibold text-slate-900">{rec.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{rec.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
