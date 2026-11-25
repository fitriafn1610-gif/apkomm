import { AppSettings, AudienceComment, Influencer } from '../types';
import { analyzeCommentSentiment } from '../utils/sentimentEngine';

function buildComment(
  id: string,
  author: string,
  text: string,
  platform: string,
  createdAt: string,
  isSimulation = true
): AudienceComment {
  const analysis = analyzeCommentSentiment(text);
  return {
    id,
    author,
    text,
    platform,
    createdAt,
    sentiment: analysis.sentiment,
    score: analysis.score,
    matchedKeywords: analysis.matchedKeywords,
    isSimulation,
  };
}

export const INITIAL_SETTINGS: AppSettings = {
  brandName: 'AuraGlow Nusantara',
  prLeadName: 'Siti Rahmawati',
  positiveThreshold: 60,
  negativeAlertThreshold: 25,
};

export const INITIAL_INFLUENCERS: Influencer[] = [
  {
    id: 'inf-tasya',
    name: 'Tasya Farasya',
    handle: '@tasyafarasya',
    platform: 'Instagram & YouTube',
    category: 'Kecantikan & Kosmetik',
    followers: '6,8 Jt',
    campaignTitle: 'Peluncuran Serum Barrier Repair',
    avatarUrl: '/src/assets/images/avatar_influencer_three_1795591420237.jpg',
    notes: 'Kolaborasi ulasan mendalam (deep review) selama 14 hari pemakaian.',
    isSimulation: true,
    lastAnalyzedAt: '2026-11-20 14:30',
    trend: [
      { label: 'Mei', positif: 66, netral: 22, negatif: 12 },
      { label: 'Jun', positif: 70, netral: 18, negatif: 12 },
      { label: 'Jul', positif: 72, netral: 17, negatif: 11 },
      { label: 'Agu', positif: 75, netral: 15, negatif: 10 },
      { label: 'Sep', positif: 79, netral: 12, negatif: 9 },
      { label: 'Okt', positif: 80, netral: 10, negatif: 10 },
    ],
    comments: [
      buildComment(
        'c-t1',
        '@nadia.putri',
        'Review Tasya selalu jujur dan detail banget, jadi langsung percaya buat checkout serumnya!',
        'Instagram',
        '2026-11-18'
      ),
      buildComment(
        'c-t2',
        '@intan_makeup',
        'Penjelasan kandungan produknya mudah dipahami dan sangat membantu pemula skincare.',
        'YouTube',
        '2026-11-18'
      ),
      buildComment(
        'c-t3',
        '@dinda.k',
        'Cocok banget di kulit aku, hasilnya bikin glowing dan kemasan produknya juga elegan.',
        'Instagram',
        '2026-11-19'
      ),
      buildComment(
        'c-t4',
        '@fira_beauty',
        'Suka banget cara penyampaiannya yang profesional dan tidak lebay.',
        'Instagram',
        '2026-11-19'
      ),
      buildComment(
        'c-t5',
        '@rani.id',
        'Kualitas bagus dan worth it dibanding brand luar yang jauh lebih mahal.',
        'YouTube',
        '2026-11-19'
      ),
      buildComment(
        'c-t6',
        '@melisa.w',
        'Terbukti aman dipakai kulit sensitif, mantap rekomendasinya Kak Tasya!',
        'Instagram',
        '2026-11-20'
      ),
      buildComment(
        'c-t7',
        '@sari_ayu',
        'Packaging botolnya ukuran berapa ml ya? Mau cek katalognya dulu.',
        'Instagram',
        '2026-11-20'
      ),
      buildComment(
        'c-t8',
        '@lisa.pratiwi',
        'Harga regulernya lumayan mahal sih kalau tanpa diskon promo launch.',
        'YouTube',
        '2026-11-20'
      ),
      buildComment(
        'c-t9',
        '@anisa_nur',
        'Sudah langganan produk rekomendasi Kak Tasya karena selalu berkualitas dan terpercaya.',
        'Instagram',
        '2026-11-20'
      ),
      buildComment(
        'c-t10',
        '@maya.rina',
        'Ulasannya rapi, informatif, dan bikin citra brand lokal makin naik kelas.',
        'YouTube',
        '2026-11-20'
      ),
    ],
    evaluation: {
      decision: 'lanjutkan',
      brandFitScore: 9,
      messageClarityScore: 9,
      audienceTrustScore: 9,
      notes:
        'Tingkat kepercayaan audiens sangat tinggi. Direkomendasikan lanjut ke kontrak kuartal berikutnya sebagai Brand Ambassador utama.',
      evaluatedAt: '2026-11-21',
      evaluatorName: 'Siti Rahmawati',
    },
  },
  {
    id: 'inf-nanda',
    name: 'Nanda Arsyinta',
    handle: '@nandaarsynt',
    platform: 'TikTok & Instagram',
    category: 'Skincare & Lifestyle',
    followers: '4,2 Jt',
    campaignTitle: 'Kampanye Rutinitas Pagi Ringan',
    avatarUrl: '/src/assets/images/avatar_influencer_one_1795591419659.jpg',
    notes: 'Video pendek TikTok & Reels bertema rutinitas kulit sehat harian.',
    isSimulation: true,
    lastAnalyzedAt: '2026-11-19 10:15',
    trend: [
      { label: 'Mei', positif: 62, netral: 25, negatif: 13 },
      { label: 'Jun', positif: 64, netral: 24, negatif: 12 },
      { label: 'Jul', positif: 68, netral: 20, negatif: 12 },
      { label: 'Agu', positif: 70, netral: 19, negatif: 11 },
      { label: 'Sep', positif: 71, netral: 18, negatif: 11 },
      { label: 'Okt', positif: 75, netral: 13, negatif: 12 },
    ],
    comments: [
      buildComment(
        'c-n1',
        '@keisha.m',
        'Visual videonya rapi dan lembut banget, bikin produknya kelihatan natural dan nyaman dipakai.',
        'TikTok',
        '2026-11-17'
      ),
      buildComment(
        'c-n2',
        '@putri_salma',
        'Suka sama gaya Nanda yang ramah dan penjelasan langkah pakainya jelas.',
        'Instagram',
        '2026-11-17'
      ),
      buildComment(
        'c-n3',
        '@tania.rose',
        'Bagus banget dipakai sebelum makeup, gak bikin geser dan tetap cerah.',
        'TikTok',
        '2026-11-18'
      ),
      buildComment(
        'c-n4',
        '@citra.dew',
        'Keren, langsung cocok di kulit kombinasi saya dan teksturnya ringan.',
        'Instagram',
        '2026-11-18'
      ),
      buildComment(
        'c-n5',
        '@ayu.lestari',
        'Apakah varian ini sudah tersedia di gerai offline Bandung?',
        'TikTok',
        '2026-11-18'
      ),
      buildComment(
        'c-n6',
        '@mona_k',
        'Sangat membantu buat yang cari sunscreen tidak lengket, top banget!',
        'Instagram',
        '2026-11-19'
      ),
      buildComment(
        'c-n7',
        '@dewi.s',
        'Agak kecewa karena stok di marketplace cepat habis dan pengirimannya lambat.',
        'TikTok',
        '2026-11-19'
      ),
      buildComment(
        'c-n8',
        '@vina_art',
        'Kontennya menginspirasi dan sangat cocok dengan citra anak muda aktif.',
        'Instagram',
        '2026-11-19'
      ),
    ],
    evaluation: {
      decision: 'lanjutkan',
      brandFitScore: 8,
      messageClarityScore: 8,
      audienceTrustScore: 8,
      notes:
        'Cocok untuk audiens Gen-Z dan milenial muda. Perlu koordinasi stok produk sebelum jadwal tayang berikutnya.',
      evaluatedAt: '2026-11-19',
      evaluatorName: 'Siti Rahmawati',
    },
  },
  {
    id: 'inf-hanum',
    name: 'Hanum Mega',
    handle: '@real.hanummegaa',
    platform: 'Instagram & TikTok',
    category: 'Beauty & Daily Vlog',
    followers: '3,1 Jt',
    campaignTitle: 'Promo Bundling Flash Sale Akhir Bulan',
    avatarUrl: '/src/assets/images/avatar_influencer_two_1795591420294.jpg',
    notes: 'Kampanye hard-selling flash sale melalui Instagram Story & TikTok.',
    isSimulation: true,
    lastAnalyzedAt: '2026-11-21 16:45',
    trend: [
      { label: 'Mei', positif: 58, netral: 24, negatif: 18 },
      { label: 'Jun', positif: 53, netral: 25, negatif: 22 },
      { label: 'Jul', positif: 49, netral: 24, negatif: 27 },
      { label: 'Agu', positif: 45, netral: 23, negatif: 32 },
      { label: 'Sep', positif: 41, netral: 22, negatif: 37 },
      { label: 'Okt', positif: 38, netral: 25, negatif: 37 },
    ],
    comments: [
      buildComment(
        'c-h1',
        '@nita.widya',
        'Terlalu lebay promosinya, kelihatan banget iklan doang tanpa jelasin kandungan produk.',
        'Instagram',
        '2026-11-19'
      ),
      buildComment(
        'c-h2',
        '@ratna_p',
        'Kecewa banget pas dicoba di wajah malah bikin jerawat dan gak cocok.',
        'TikTok',
        '2026-11-19'
      ),
      buildComment(
        'c-h3',
        '@bella.sari',
        'Kurang jujur ulasannya, klaim hasil instan terasa terlalu gimmick.',
        'Instagram',
        '2026-11-20'
      ),
      buildComment(
        'c-h4',
        '@desi.rahma',
        'Kemasannya sih lumayan rapi, tapi videonya terlalu cepat sehingga info manfaatnya kurang jelas.',
        'TikTok',
        '2026-11-20'
      ),
      buildComment(
        'c-h5',
        '@fitri_ani',
        'Saya suka warna produknya, lumayan bagus buat pemakaian acara malam.',
        'Instagram',
        '2026-11-20'
      ),
      buildComment(
        'c-h6',
        '@farah.z',
        'Tadi lihat live streamingnya, jam berapa promo bundling berakhir?',
        'TikTok',
        '2026-11-21'
      ),
      buildComment(
        'c-h7',
        '@tiara.m',
        'Kalau masih pakai gaya promosi settingan begitu bikin audiens tidak percaya ke brand.',
        'Instagram',
        '2026-11-21'
      ),
      buildComment(
        'c-h8',
        '@kiki.amelia',
        'Harganya oke saat flash sale dan pengemasannya aman sampai rumah.',
        'TikTok',
        '2026-11-21'
      ),
    ],
    evaluation: {
      decision: 'perbaiki_strategi',
      brandFitScore: 5,
      messageClarityScore: 4,
      audienceTrustScore: 4,
      notes:
        'Gaya penyampaian terlalu hard-selling dan memicu skeptisisme audiens. Perlu revisi brief ke arah edukasi produk yang lebih realistis.',
      evaluatedAt: '2026-11-21',
      evaluatorName: 'Siti Rahmawati',
    },
  },
  {
    id: 'inf-raka',
    name: 'Raka Pratama',
    handle: '@rakapratama.id',
    platform: 'YouTube & X',
    category: 'Teknologi & Gaya Hidup',
    followers: '1,4 Jt',
    campaignTitle: 'Edukasi Perawatan Kulit Pria Modern',
    avatarUrl: '/src/assets/images/avatar_influencer_four_1795591421183.jpg',
    notes: 'Ekspansi segmen pria melalui konten podcast & review ringkas.',
    isSimulation: true,
    lastAnalyzedAt: '2026-11-22 09:00',
    trend: [
      { label: 'Mei', positif: 48, netral: 34, negatif: 18 },
      { label: 'Jun', positif: 50, netral: 32, negatif: 18 },
      { label: 'Jul', positif: 52, netral: 30, negatif: 18 },
      { label: 'Agu', positif: 51, netral: 31, negatif: 18 },
      { label: 'Sep', positif: 53, netral: 29, negatif: 18 },
      { label: 'Okt', positif: 50, netral: 33, negatif: 17 },
    ],
    comments: [
      buildComment(
        'c-r1',
        '@dimas.anggoro',
        'Penjelasannya lumayan informatif buat cowok yang baru mulai pakai pembersih wajah.',
        'YouTube',
        '2026-11-20'
      ),
      buildComment(
        'c-r2',
        '@bagas_w',
        'Bagus sih idenya, tapi transisi dari topik gadget ke skincare terasa agak kaku.',
        'YouTube',
        '2026-11-20'
      ),
      buildComment(
        'c-r3',
        '@rizky.f',
        'Link pembeliannya ada di deskripsi video menit ke berapa?',
        'YouTube',
        '2026-11-21'
      ),
      buildComment(
        'c-r4',
        '@aldo_pr',
        'Produk ini bisa dipakai sebelum olahraga luar ruangan tidak ya?',
        'X',
        '2026-11-21'
      ),
      buildComment(
        'c-r5',
        '@bima.s',
        'Suka konsepnya yang simpel, cocok untuk pemula dan tidak ribet.',
        'YouTube',
        '2026-11-21'
      ),
      buildComment(
        'c-r6',
        '@hendra.k',
        'Videonya menarik dan jujur, tapi sayang kurang detail soal hasil pemakaian dua minggu.',
        'X',
        '2026-11-22'
      ),
    ],
    evaluation: {
      decision: 'belum_dievaluasi',
      brandFitScore: 6,
      messageClarityScore: 6,
      audienceTrustScore: 7,
      notes: '',
      evaluatedAt: null,
      evaluatorName: 'Siti Rahmawati',
    },
  },
];

export const SAMPLE_COMMENT_PRESETS: { label: string; lines: string }[] = [
  {
    label: 'Contoh Respons Positif',
    lines: [
      'Review-nya sangat jujur dan informatif, jadi makin percaya dengan kualitas brand ini!',
      'Sudah coba produknya dan cocok banget di kulit saya, bikin glowing alami.',
      'Penyampaiannya rapi, elegan, dan tidak lebay. Sangat rekomendasi!',
      'Worth it banget dengan harga segini, kualitasnya memuaskan.',
      'Suka banget kolaborasi ini, citra merek jadi terasa semakin terpercaya.',
    ].join('\n'),
  },
  {
    label: 'Contoh Respons Tidak Positif',
    lines: [
      'Terlalu gimmick dan terkesan iklan doang, jadi kurang percaya.',
      'Setelah dicoba malah tidak cocok dan bikin breakout di kulit sensitif.',
      'Penjelasannya kurang jelas, terkesan settingan untuk kejar promo saja.',
      'Agak kecewa dengan klaimnya yang terlalu lebay dan overpriced.',
      'Apakah produknya aman? Saya masih ragu melihat ulasan yang kurang jujur.',
    ].join('\n'),
  },
];
