import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Save } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (next: AppSettings) => void;
  onResetSimulationData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetSimulationData,
}) => {
  const [brandName, setBrandName] = useState(settings.brandName);
  const [prLeadName, setPrLeadName] = useState(settings.prLeadName);
  const [positiveThreshold, setPositiveThreshold] = useState(
    settings.positiveThreshold
  );
  const [negativeAlertThreshold, setNegativeAlertThreshold] = useState(
    settings.negativeAlertThreshold
  );
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      brandName: brandName.trim() || 'Merek Anda',
      prLeadName: prLeadName.trim() || 'Tim Public Relations',
      positiveThreshold,
      negativeAlertThreshold,
    });
    setSavedNotice('Pengaturan analisis dan profil merek berhasil disimpan.');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pengaturan BrandScope</h2>
          <p className="text-sm text-slate-600 mt-1">
            Sesuaikan identitas merek dan ambang batas persentase sentimen untuk
            penentuan rekomendasi kerja sama.
          </p>
        </div>

        {savedNotice && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Nama Merek / Perusahaan
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Nama Evaluator / Tim PR
            </label>
            <input
              type="text"
              value={prLeadName}
              onChange={(e) => setPrLeadName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span>Ambang Minimal Sentimen Positif</span>
              <span className="font-mono tabular-nums font-bold text-[#6D28D9]">
                {positiveThreshold}%
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={85}
              step={5}
              value={positiveThreshold}
              onChange={(e) => setPositiveThreshold(Number(e.target.value))}
              className="w-full accent-[#6D28D9]"
            />
            <p className="text-[11px] text-slate-500">
              Jika persentase sentimen positif mencapai nilai ini atau lebih, sistem
              merekomendasikan untuk melanjutkan kerja sama.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span>Batas Peringatan Sentimen Negatif</span>
              <span className="font-mono tabular-nums font-bold text-[#DC2626]">
                {negativeAlertThreshold}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={negativeAlertThreshold}
              onChange={(e) => setNegativeAlertThreshold(Number(e.target.value))}
              className="w-full accent-[#DC2626]"
            />
            <p className="text-[11px] text-slate-500">
              Jika sentimen negatif mencapai atau melampaui batas ini, sistem memicu
              rekomendasi perbaikan strategi komunikasi.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#0F1E3D] hover:bg-[#192E59] rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Simulation Reset Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Pengelolaan Data Simulasi
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Aplikasi menyimpan perubahan data influencer dan komentar di browser lokal
            Anda. Anda dapat mengembalikan seluruh data ke contoh simulasi awal kapan
            saja.
          </p>
        </div>

        {confirmReset ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onResetSimulationData();
                setConfirmReset(false);
                setSavedNotice('Seluruh data berhasil dikembalikan ke data simulasi awal.');
              }}
              className="px-3.5 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg whitespace-nowrap"
            >
              Ya, Reset Sekarang
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 inline-flex items-center gap-2 whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Simulasi</span>
          </button>
        )}
      </div>
    </div>
  );
};
