import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Printer,
  Save,
  XCircle,
} from 'lucide-react';
import { AppSettings, EvaluationRecord, Influencer, PartnershipDecision } from '../types';
import { computeSentimentSummary } from '../utils/sentimentEngine';
import { InfluencerAvatar } from './InfluencerAvatar';

interface EvaluationViewProps {
  influencers: Influencer[];
  selectedInfluencerId: string;
  settings: AppSettings;
  onSelectInfluencerId: (id: string) => void;
  onSaveEvaluation: (influencerId: string, record: EvaluationRecord) => void;
}

const DECISION_LABELS: Record<PartnershipDecision, string> = {
  belum_dievaluasi: 'Belum Dievaluasi',
  lanjutkan: 'Lanjutkan Kerja Sama',
  perbaiki_strategi: 'Perbaiki Strategi Komunikasi',
  hentikan: 'Hentikan / Ganti Influencer',
};

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  influencers,
  selectedInfluencerId,
  settings,
  onSelectInfluencerId,
  onSaveEvaluation,
}) => {
  const influencer =
    influencers.find((i) => i.id === selectedInfluencerId) || influencers[0];

  const [decision, setDecision] = useState<PartnershipDecision>(
    influencer?.evaluation.decision || 'belum_dievaluasi'
  );
  const [brandFitScore, setBrandFitScore] = useState<number>(
    influencer?.evaluation.brandFitScore ?? 7
  );
  const [messageClarityScore, setMessageClarityScore] = useState<number>(
    influencer?.evaluation.messageClarityScore ?? 7
  );
  const [audienceTrustScore, setAudienceTrustScore] = useState<number>(
    influencer?.evaluation.audienceTrustScore ?? 7
  );
  const [notes, setNotes] = useState<string>(influencer?.evaluation.notes ?? '');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!influencer) return;
    setDecision(influencer.evaluation.decision);
    setBrandFitScore(influencer.evaluation.brandFitScore);
    setMessageClarityScore(influencer.evaluation.messageClarityScore);
    setAudienceTrustScore(influencer.evaluation.audienceTrustScore);
    setNotes(influencer.evaluation.notes);
    setSavedNotice(null);
  }, [influencer]);

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

  if (!influencer) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-600">
        Belum ada influencer untuk dievaluasi.
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    onSaveEvaluation(influencer.id, {
      decision,
      brandFitScore,
      messageClarityScore,
      audienceTrustScore,
      notes: notes.trim(),
      evaluatedAt: today,
      evaluatorName: settings.prLeadName,
    });
    setSavedNotice(
      `Keputusan evaluasi untuk ${influencer.name} berhasil disimpan (${DECISION_LABELS[decision]}).`
    );
  };

  const handleDownloadReport = () => {
    const lines = [
      `LAPORAN EVALUASI INFLUENCER — BRANDSCOPE`,
      `Merek: ${settings.brandName}`,
      `Evaluator PR: ${settings.prLeadName}`,
      `Tanggal Cetak: ${new Date().toISOString().slice(0, 10)}`,
      `--------------------------------------------------`,
      `Nama Influencer : ${influencer.name} (${influencer.handle})`,
      `Platform        : ${influencer.platform}`,
      `Kategori        : ${influencer.category}`,
      `Kampanye        : ${influencer.campaignTitle}`,
      `Sumber Data     : ${influencer.isSimulation ? 'Data Simulasi & Manual' : 'Input Manual'}`,
      ``,
      `HASIL ANALISIS SENTIMEN AUDIENS (${summary.total} komentar):`,
      `- Positif : ${summary.positifPct}% (${summary.positifCount} komentar)`,
      `- Netral  : ${summary.netralPct}% (${summary.netralCount} komentar)`,
      `- Negatif : ${summary.negatifPct}% (${summary.negatifCount} komentar)`,
      `- Kesimpulan Pengaruh: ${summary.impactLabel}`,
      `- Rekomendasi Sistem : ${
        summary.isPositiveImpact
          ? 'Lanjutkan Kerja Sama'
          : 'Perbaiki Strategi Komunikasi'
      }`,
      ``,
      `PENILAIAN & KEPUTUSAN TIM PR:`,
      `- Kesesuaian Citra Merek : ${brandFitScore}/10`,
      `- Kejelasan Pesan        : ${messageClarityScore}/10`,
      `- Kepercayaan Audiens    : ${audienceTrustScore}/10`,
      `- Keputusan Akhir        : ${DECISION_LABELS[decision]}`,
      `- Catatan Evaluasi       : ${notes || '-'}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `evaluasi-${influencer.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Matrix Overview Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-indigo-700">
              Langkah 8 & 9 · Evaluasi Keseluruhan & Keputusan Akhir
            </p>
            <h2 className="text-lg font-bold text-slate-900">
              Matriks Evaluasi Influencer
            </h2>
          </div>
          <div className="flex items-center gap-2 no-print">
            <button
              type="button"
              onClick={handleDownloadReport}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Laporan (.txt)</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="py-3 px-6">Influencer</th>
                <th className="py-3 px-4 text-right">Positif</th>
                <th className="py-3 px-4 text-right">Negatif</th>
                <th className="py-3 px-4">Rekomendasi Sistem</th>
                <th className="py-3 px-4">Keputusan Tim PR</th>
                <th className="py-3 px-6 text-right">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {influencers.map((inf) => {
                const s = computeSentimentSummary(
                  inf.comments,
                  settings.positiveThreshold,
                  settings.negativeAlertThreshold
                );
                const isSelected = inf.id === influencer.id;

                return (
                  <tr
                    key={inf.id}
                    onClick={() => onSelectInfluencerId(inf.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <InfluencerAvatar
                          src={inf.avatarUrl}
                          name={inf.name}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-slate-900">{inf.name}</p>
                          <p className="text-xs text-slate-500">{inf.campaignTitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-medium text-[#6D28D9]">
                      {s.positifPct}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#DC2626]">
                      {s.negatifPct}%
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium">
                      {s.total === 0
                        ? 'Menunggu Data'
                        : s.isPositiveImpact
                          ? 'Lanjutkan Kerja Sama'
                          : 'Perbaiki Strategi'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          inf.evaluation.decision === 'lanjutkan'
                            ? 'text-emerald-700'
                            : inf.evaluation.decision === 'perbaiki_strategi'
                              ? 'text-amber-700'
                              : inf.evaluation.decision === 'hentikan'
                                ? 'text-red-700'
                                : 'text-slate-500'
                        }`}
                      >
                        {inf.evaluation.decision === 'lanjutkan' && (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        )}
                        {inf.evaluation.decision === 'perbaiki_strategi' && (
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        )}
                        {inf.evaluation.decision === 'hentikan' && (
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{DECISION_LABELS[inf.evaluation.decision]}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right text-xs text-slate-500 font-mono tabular-nums">
                      {inf.evaluation.evaluatedAt || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Influencer Final Decision Form */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <InfluencerAvatar
              src={influencer.avatarUrl}
              name={influencer.name}
              size="lg"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Keputusan Evaluasi: {influencer.name}
              </h3>
              <p className="text-xs text-slate-500">
                {influencer.handle} · Sentimen Positif {summary.positifPct}% · Sentimen
                Negatif {summary.negatifPct}% · Rekomendasi Sistem:{' '}
                <span className="font-semibold text-slate-800">
                  {summary.isPositiveImpact
                    ? 'Lanjutkan Kerja Sama'
                    : 'Perbaiki Strategi Komunikasi'}
                </span>
              </p>
            </div>
          </div>

          <div className="text-right font-mono tabular-nums">
            <p className="text-xs font-sans text-slate-500">Rata-rata Skor Rubrik</p>
            <p className="text-2xl font-bold text-[#0F1E3D]">
              {((brandFitScore + messageClarityScore + audienceTrustScore) / 3).toFixed(
                1
              )}
              <span className="text-sm font-normal text-slate-400"> / 10</span>
            </p>
          </div>
        </div>

        {savedNotice && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* Qualitative PR Rubric Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span>Kesesuaian Citra Merek</span>
              <span className="font-mono tabular-nums font-bold text-slate-900">
                {brandFitScore}/10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={brandFitScore}
              onChange={(e) => setBrandFitScore(Number(e.target.value))}
              className="w-full accent-[#6D28D9]"
            />
            <p className="text-[11px] text-slate-500">
              Seberapa selaras persona influencer dengan nilai merek {settings.brandName}.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span>Kejelasan Penyampaian Pesan</span>
              <span className="font-mono tabular-nums font-bold text-slate-900">
                {messageClarityScore}/10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={messageClarityScore}
              onChange={(e) => setMessageClarityScore(Number(e.target.value))}
              className="w-full accent-[#6D28D9]"
            />
            <p className="text-[11px] text-slate-500">
              Kejelasan informasi manfaat produk tanpa terkesan berlebihan.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span>Kepercayaan Audiens</span>
              <span className="font-mono tabular-nums font-bold text-slate-900">
                {audienceTrustScore}/10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={audienceTrustScore}
              onChange={(e) => setAudienceTrustScore(Number(e.target.value))}
              className="w-full accent-[#6D28D9]"
            />
            <p className="text-[11px] text-slate-500">
              Tingkat penerimaan organik dan respons komentar audiens.
            </p>
          </div>
        </div>

        {/* Partnership Decision Choice */}
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold text-slate-800">
            Keputusan Kerja Sama Selanjutnya
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              [
                {
                  value: 'lanjutkan',
                  label: 'Lanjutkan Kerja Sama',
                  desc: 'Pengaruh positif, siap untuk kampanye periode berikutnya.',
                },
                {
                  value: 'perbaiki_strategi',
                  label: 'Perbaiki Strategi Komunikasi',
                  desc: 'Lanjutkan dengan revisi brief, pesan, dan format konten.',
                },
                {
                  value: 'hentikan',
                  label: 'Hentikan / Ganti Influencer',
                  desc: 'Risiko citra merek terlalu tinggi, cari kreator alternatif.',
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDecision(opt.value)}
                className={`text-left p-4 rounded-lg border transition-colors ${
                  decision === opt.value
                    ? 'border-[#6D28D9] bg-indigo-50/60'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Catatan & Tindak Lanjut Tim Public Relations
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tuliskan alasan keputusan, poin revisi brief, atau rencana kampanye selanjutnya..."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 no-print">
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#0F1E3D] hover:bg-[#192E59] rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Keputusan Evaluasi</span>
          </button>
        </div>
      </form>
    </div>
  );
};
