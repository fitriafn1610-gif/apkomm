import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Info,
  MinusCircle,
  Play,
  Plus,
  Trash2,
} from 'lucide-react';
import { SAMPLE_COMMENT_PRESETS } from '../data/mockData';
import { AppSettings, Influencer, NavSection, SentimentCategory } from '../types';
import { computeSentimentSummary } from '../utils/sentimentEngine';
import { SentimentDonutChart } from './Charts';
import { InfluencerAvatar } from './InfluencerAvatar';

interface SentimentAnalysisViewProps {
  influencers: Influencer[];
  selectedInfluencerId: string;
  settings: AppSettings;
  onSelectInfluencerId: (id: string) => void;
  onAddComments: (
    influencerId: string,
    entries: { author: string; platform: string; text: string }[]
  ) => void;
  onDeleteComment: (influencerId: string, commentId: string) => void;
  onRunAnalysis: (influencerId: string) => void;
  onNavigate: (section: NavSection) => void;
}

export const SentimentAnalysisView: React.FC<SentimentAnalysisViewProps> = ({
  influencers,
  selectedInfluencerId,
  settings,
  onSelectInfluencerId,
  onAddComments,
  onDeleteComment,
  onRunAnalysis,
  onNavigate,
}) => {
  const influencer =
    influencers.find((i) => i.id === selectedInfluencerId) || influencers[0];

  const [inputMode, setInputMode] = useState<'single' | 'batch'>('single');
  const [author, setAuthor] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [singleText, setSingleText] = useState('');
  const [batchText, setBatchText] = useState('');
  const [filterSentiment, setFilterSentiment] = useState<'all' | SentimentCategory>(
    'all'
  );
  const [analysisFeedback, setAnalysisFeedback] = useState<string | null>(null);

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

  const filteredComments = useMemo(() => {
    if (!influencer) return [];
    if (filterSentiment === 'all') return influencer.comments;
    return influencer.comments.filter((c) => c.sentiment === filterSentiment);
  }, [influencer, filterSentiment]);

  if (!influencer) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
        <p className="text-base font-semibold text-slate-900">
          Belum Ada Influencer Terdaftar
        </p>
        <p className="text-sm text-slate-600">
          Tambahkan profil influencer terlebih dahulu sebelum memasukkan komentar audiens.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('influencers')}
          className="px-4 py-2 text-sm font-medium text-white bg-[#0F1E3D] rounded-lg"
        >
          Ke Menu Influencer
        </button>
      </div>
    );
  }

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleText.trim()) return;
    onAddComments(influencer.id, [
      {
        author: author.trim() || '@audiens_manual',
        platform,
        text: singleText.trim(),
      },
    ]);
    setSingleText('');
    setAuthor('');
    setAnalysisFeedback(
      'Komentar ditambahkan. Klik "Jalankan Analisis Sentimen" untuk memperbarui kesimpulan akhir.'
    );
  };

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = batchText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    onAddComments(
      influencer.id,
      lines.map((line, index) => ({
        author: `@audiens_${index + 1}`,
        platform,
        text: line,
      }))
    );
    setBatchText('');
    setAnalysisFeedback(
      `${lines.length} komentar ditambahkan. Klik "Jalankan Analisis Sentimen" untuk memperbarui grafik & rekomendasi.`
    );
  };

  const handleTriggerAnalysis = () => {
    onRunAnalysis(influencer.id);
    setAnalysisFeedback(
      `Analisis selesai untuk ${influencer.name}: ${summary.positifPct}% Positif, ${summary.netralPct}% Netral, ${summary.negatifPct}% Negatif.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Select Influencer */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <InfluencerAvatar
              src={influencer.avatarUrl}
              name={influencer.name}
              size="lg"
            />
            <div>
              <p className="text-xs font-medium text-indigo-700">
                Langkah 1 & 2 · Pemilihan Influencer & Input Data Audiens
              </p>
              <h2 className="text-xl font-bold text-slate-900">{influencer.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {influencer.handle} · {influencer.category} · Kampanye:{' '}
                {influencer.campaignTitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              aria-label="Pilih influencer untuk dianalisis"
              value={influencer.id}
              onChange={(e) => {
                onSelectInfluencerId(e.target.value);
                setAnalysisFeedback(null);
              }}
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
              onClick={handleTriggerAnalysis}
              disabled={influencer.comments.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-50 rounded-lg transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <Play className="w-4 h-4" />
              <span>Jalankan Analisis Sentimen</span>
            </button>
          </div>
        </div>

        {/* Manual Data Transparency Notice */}
        <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-slate-800">Catatan Sumber Data:</span>{' '}
            BrandScope tidak menarik data langsung dari API media sosial. Masukkan
            komentar atau respons audiens secara manual di bawah ini (atau gunakan data
            simulasi yang tersedia) untuk menjalankan klasifikasi sentimen berbasis
            leksikon Bahasa Indonesia & Inggris secara lokal.
          </p>
        </div>

        {analysisFeedback && (
          <div className="mt-3 p-3.5 rounded-lg bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-900">
            <span className="font-medium">{analysisFeedback}</span>
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="font-semibold text-[#6D28D9] hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>Lihat Hasil Analisis Citra Merek</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main 2-column Input & Live Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Manual Audience Comment Input */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900">
              Input Komentar Audiens Manual
            </h3>
            <div className="inline-flex p-1 bg-slate-100 rounded-lg self-start">
              <button
                type="button"
                onClick={() => setInputMode('single')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  inputMode === 'single'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Input Satuan
              </button>
              <button
                type="button"
                onClick={() => setInputMode('batch')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  inputMode === 'batch'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Input Massal (Banyak Baris)
              </button>
            </div>
          </div>

          {inputMode === 'single' ? (
            <form onSubmit={handleAddSingle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama / Akun Audiens (Opsional)
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Contoh: @dinda_pratama"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Platform Komentar
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="X">X (Twitter)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Isi Komentar Audiens *
                </label>
                <textarea
                  rows={3}
                  value={singleText}
                  onChange={(e) => setSingleText(e.target.value)}
                  placeholder="Contoh: Penjelasannya jujur dan sangat membantu, jadi makin percaya sama produknya!"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0F1E3D] hover:bg-[#192E59] rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Komentar</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddBatch} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-medium text-slate-700">
                  Tempel beberapa komentar (1 baris = 1 komentar audiens)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {SAMPLE_COMMENT_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setBatchText(preset.lines)}
                      className="text-xs font-medium text-indigo-700 hover:text-indigo-900 underline"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={5}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder={
                  'Tulis atau tempel daftar komentar di sini...\nBaris 1: Review-nya bagus dan jujur banget\nBaris 2: Harganya terlalu mahal buat pelajar'
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <select
                  aria-label="Platform untuk komentar massal"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Instagram">Sumber: Instagram</option>
                  <option value="TikTok">Sumber: TikTok</option>
                  <option value="YouTube">Sumber: YouTube</option>
                  <option value="X">Sumber: X (Twitter)</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0F1E3D] hover:bg-[#192E59] rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Tambahkan Semua Baris</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Live Sentiment Chart Preview */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Persentase Kategori Sentimen
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              {influencer.name} · {summary.total} komentar terklasifikasi
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
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              Status awal:{' '}
              <span className="font-semibold text-slate-900">{summary.impactLabel}</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="px-3.5 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Hasil & Rekomendasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Classified Comments List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Daftar Komentar Audiens ({filteredComments.length})
            </h3>
            <p className="text-xs text-slate-500">
              Setiap komentar dikelompokkan otomatis menjadi Positif, Netral, atau Negatif
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
            {(
              [
                { id: 'all', label: `Semua (${summary.total})` },
                { id: 'positif', label: `Positif (${summary.positifCount})` },
                { id: 'netral', label: `Netral (${summary.netralCount})` },
                { id: 'negatif', label: `Negatif (${summary.negatifCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterSentiment(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  filterSentiment === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredComments.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Belum ada komentar pada kategori ini. Tambahkan komentar melalui formulir di
            atas.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{comment.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{comment.platform}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{comment.createdAt}</span>
                    <span aria-hidden="true">·</span>
                    <span>{comment.isSimulation ? 'Simulasi' : 'Manual'}</span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">{comment.text}</p>
                  {comment.matchedKeywords.length > 0 && (
                    <p className="text-xs text-slate-500">
                      Kata kunci terdeteksi:{' '}
                      <span className="font-mono text-slate-700">
                        {comment.matchedKeywords.join(', ')}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      comment.sentiment === 'positif'
                        ? 'text-emerald-700'
                        : comment.sentiment === 'negatif'
                          ? 'text-red-700'
                          : 'text-sky-700'
                    }`}
                  >
                    {comment.sentiment === 'positif' && (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    )}
                    {comment.sentiment === 'netral' && (
                      <MinusCircle className="w-4 h-4 shrink-0" />
                    )}
                    {comment.sentiment === 'negatif' && (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span className="capitalize">{comment.sentiment}</span>
                  </span>

                  <button
                    type="button"
                    aria-label="Hapus komentar"
                    onClick={() => onDeleteComment(influencer.id, comment.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
