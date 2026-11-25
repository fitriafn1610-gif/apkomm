import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  MessageSquarePlus,
  Plus,
  Search,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { AppSettings, Influencer, NavSection } from '../types';
import { computeSentimentSummary } from '../utils/sentimentEngine';
import { InfluencerAvatar } from './InfluencerAvatar';

interface InfluencersViewProps {
  influencers: Influencer[];
  selectedInfluencerId: string;
  settings: AppSettings;
  onSelectInfluencer: (id: string, targetSection?: NavSection) => void;
  onAddInfluencer: (
    data: Omit<
      Influencer,
      'id' | 'isSimulation' | 'lastAnalyzedAt' | 'comments' | 'trend' | 'evaluation'
    >
  ) => void;
  onDeleteInfluencer: (id: string) => void;
}

const CATEGORIES = [
  'Semua',
  'Kecantikan & Kosmetik',
  'Skincare & Lifestyle',
  'Beauty & Daily Vlog',
  'Teknologi & Gaya Hidup',
  'Kuliner & F&B',
  'Fashion',
];

export const InfluencersView: React.FC<InfluencersViewProps> = ({
  influencers,
  selectedInfluencerId,
  settings,
  onSelectInfluencer,
  onAddInfluencer,
  onDeleteInfluencer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState('Instagram & TikTok');
  const [category, setCategory] = useState('Kecantikan & Kosmetik');
  const [followers, setFollowers] = useState('');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const filteredInfluencers = useMemo(() => {
    return influencers.filter((inf) => {
      const matchesCategory =
        categoryFilter === 'Semua' || inf.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        inf.name.toLowerCase().includes(q) ||
        inf.handle.toLowerCase().includes(q) ||
        inf.campaignTitle.toLowerCase().includes(q) ||
        inf.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [influencers, searchQuery, categoryFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !handle.trim()) {
      setFormError('Nama influencer dan nama akun media sosial wajib diisi.');
      return;
    }

    const formattedHandle = handle.trim().startsWith('@')
      ? handle.trim()
      : `@${handle.trim()}`;

    onAddInfluencer({
      name: name.trim(),
      handle: formattedHandle,
      platform: platform.trim() || 'Instagram',
      category,
      followers: followers.trim() || 'Belum dicatat',
      campaignTitle: campaignTitle.trim() || `Kolaborasi ${settings.brandName}`,
      avatarUrl: '',
      notes: notes.trim(),
    });

    setName('');
    setHandle('');
    setFollowers('');
    setCampaignTitle('');
    setNotes('');
    setFormError('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Pemilihan & Manajemen Influencer
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Pilih influencer yang ingin dianalisis atau tambahkan profil influencer baru
              untuk kampanye {settings.brandName}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="px-4 py-2.5 text-sm font-medium text-white bg-[#0F1E3D] hover:bg-[#192E59] rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showForm ? 'Tutup Form' : 'Tambah Influencer'}</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-5 pt-5 border-t border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, akun @handle, atau kampanye..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Influencer Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-indigo-200 rounded-xl p-6 space-y-5"
        >
          <div className="flex items-center gap-2 text-slate-900">
            <UserPlus className="w-5 h-5 text-indigo-700" />
            <h3 className="text-base font-semibold">Tambah Profil Influencer Baru</h3>
          </div>

          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Nama Influencer *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Clarissa Putri"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Akun Media Sosial *
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Contoh: @clarissaputri_"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Platform Utama
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Instagram & TikTok">Instagram & TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="Instagram & YouTube">Instagram & YouTube</option>
                <option value="X (Twitter)">X (Twitter)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Kategori Konten
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {CATEGORIES.filter((c) => c !== 'Semua').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Perkiraan Pengikut
              </label>
              <input
                type="text"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                placeholder="Contoh: 850 Rb atau 1,5 Jt"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Judul Kampanye / Kolaborasi
              </label>
              <input
                type="text"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                placeholder="Contoh: Review Produk Edisi Ramadan"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Informasi Pendukung & Catatan Kerja Sama
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan fokus konten, target audiens, atau catatan khusus tim PR..."
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-lg transition-colors"
            >
              Simpan & Pilih Influencer
            </button>
          </div>
        </form>
      )}

      {/* Influencer Cards Grid */}
      {filteredInfluencers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <p className="text-sm font-medium text-slate-800">
            Tidak ada influencer yang cocok dengan filter pencarian.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Ubah kata kunci pencarian atau tambahkan influencer baru untuk mulai
            menganalisis.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInfluencers.map((inf) => {
            const summary = computeSentimentSummary(
              inf.comments,
              settings.positiveThreshold,
              settings.negativeAlertThreshold
            );
            const isSelected = inf.id === selectedInfluencerId;

            return (
              <div
                key={inf.id}
                className={`bg-white rounded-xl p-5 border transition-colors flex flex-col justify-between gap-4 ${
                  isSelected ? 'border-[#6D28D9] ring-1 ring-[#6D28D9]/20' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <InfluencerAvatar
                        src={inf.avatarUrl}
                        name={inf.name}
                        size="lg"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-900 truncate">
                            {inf.name}
                          </h3>
                          {isSelected && (
                            <span className="text-xs font-medium text-[#6D28D9] inline-flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Dipilih</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {inf.handle} · {inf.platform} · {inf.followers} pengikut
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {inf.category}
                          {inf.isSimulation ? ' · Data Simulasi' : ' · Input Pengguna'}
                        </p>
                      </div>
                    </div>

                    {confirmDeleteId === inf.id ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteInfluencer(inf.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2.5 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Hapus
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Hapus ${inf.name}`}
                        onClick={() => setConfirmDeleteId(inf.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-700">
                      Kampanye: {inf.campaignTitle}
                    </p>
                    {inf.notes && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {inf.notes}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center bg-slate-50 rounded-lg p-2.5 font-mono tabular-nums">
                    <div>
                      <p className="text-[11px] text-slate-500 font-sans">Positif</p>
                      <p className="text-sm font-semibold text-[#6D28D9]">
                        {summary.positifPct}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 font-sans">Netral</p>
                      <p className="text-sm font-semibold text-[#0284C7]">
                        {summary.netralPct}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 font-sans">Negatif</p>
                      <p className="text-sm font-semibold text-[#DC2626]">
                        {summary.negatifPct}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {summary.total} komentar audiens
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectInfluencer(inf.id, 'results')}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                    >
                      Lihat Hasil
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectInfluencer(inf.id, 'sentiment')}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-[#0F1E3D] hover:bg-[#192E59] rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                      <span>Input & Analisis</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
