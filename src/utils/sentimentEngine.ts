import { AudienceComment, SentimentCategory, SentimentSummary } from '../types';

const POSITIVE_PHRASES: Record<string, number> = {
  'worth it': 2.2,
  'oke banget': 2,
  'keren banget': 2.3,
  'bagus banget': 2.3,
  'suka banget': 2.2,
  'cocok banget': 2.3,
  'top banget': 2.2,
  'bikin glowing': 2,
  'jujur banget': 2.2,
  'sangat membantu': 2.1,
  'sangat bagus': 2.2,
  'sangat cocok': 2.2,
  'sangat rekomendasi': 2.4,
  'highly recommended': 2.4,
  'mudah dipahami': 1.8,
  'penjelasan jelas': 1.9,
  'kualitas bagus': 2,
  'aman dipakai': 1.9,
  'percaya banget': 2.1,
  'selalu jujur': 2.2,
  'auto beli': 1.9,
  'langsung checkout': 1.9,
};

const NEGATIVE_PHRASES: Record<string, number> = {
  'iklan doang': -2.2,
  'endorse doang': -2.2,
  'endorse banget': -2,
  'kurang jujur': -2.3,
  'tidak jujur': -2.4,
  'gak jujur': -2.4,
  'nggak jujur': -2.4,
  'tidak cocok': -2.1,
  'gak cocok': -2.1,
  'nggak cocok': -2.1,
  'kurang cocok': -1.8,
  'tidak efektif': -2,
  'kurang jelas': -1.6,
  'tidak sesuai': -2,
  'bikin jerawat': -2.3,
  'bikin breakout': -2.4,
  'jelek banget': -2.5,
  'kecewa banget': -2.5,
  'kurang percaya': -2,
  'tidak percaya': -2.2,
  'terlalu mahal': -1.9,
  'terlalu lebay': -2,
  'terlalu gimmick': -2.2,
  'tidak rekomendasi': -2.3,
  'jangan beli': -2.4,
  'bukan favorit': -1.6,
};

const POSITIVE_WORDS: Record<string, number> = {
  bagus: 1.5,
  keren: 1.5,
  mantap: 1.6,
  suka: 1.4,
  cocok: 1.5,
  jujur: 1.7,
  terpercaya: 1.8,
  percaya: 1.5,
  rekomendasi: 1.7,
  recommended: 1.7,
  elegan: 1.5,
  berkualitas: 1.7,
  aman: 1.4,
  terbukti: 1.6,
  memuaskan: 1.7,
  puas: 1.6,
  rapi: 1.3,
  detail: 1.3,
  informatif: 1.6,
  menginspirasi: 1.6,
  inspiratif: 1.6,
  langganan: 1.4,
  top: 1.4,
  terbaik: 1.8,
  positif: 1.6,
  profesional: 1.6,
  valid: 1.4,
  nyaman: 1.4,
  favorit: 1.6,
  asli: 1.2,
  original: 1.4,
  setuju: 1.2,
  sukses: 1.5,
  hebat: 1.6,
  ramah: 1.4,
  halus: 1.3,
  cerah: 1.3,
  natural: 1.3,
  autentik: 1.6,
  authentic: 1.6,
  love: 1.6,
  great: 1.6,
  amazing: 1.7,
  trusted: 1.7,
  helpful: 1.5,
  glowing: 1.4,
  juara: 1.6,
  kerennya: 1.4,
};

const NEGATIVE_WORDS: Record<string, number> = {
  kecewa: -1.8,
  mengecewakan: -2.0,
  jelek: -1.8,
  buruk: -1.8,
  mahal: -1.3,
  overpriced: -1.7,
  lebay: -1.6,
  bohong: -2.1,
  palsu: -2.0,
  gimmick: -1.7,
  settingan: -1.9,
  menyesal: -1.9,
  rugi: -1.8,
  iritasi: -1.9,
  parah: -1.6,
  lambat: -1.4,
  gagal: -1.8,
  aneh: -1.4,
  boikot: -2.2,
  unfollow: -1.8,
  toxic: -2.0,
  kontroversi: -1.7,
  negatif: -1.6,
  spam: -1.6,
  ribet: -1.4,
  penipuan: -2.3,
  scam: -2.3,
  fake: -2.0,
  hancur: -2.0,
  rusak: -1.9,
  skip: -1.4,
  kaku: -1.3,
  monoton: -1.3,
  membosankan: -1.5,
  kurang: -0.9,
  bad: -1.7,
  worst: -2.0,
  disappointed: -1.9,
  waste: -1.8,
  breakout: -1.9,
  jerawat: -1.4,
  hoax: -2.1,
};

const NEGATION_TOKENS = new Set([
  'tidak',
  'tak',
  'nggak',
  'gak',
  'ga',
  'enggak',
  'bukan',
  'kurang',
  'belum',
  'jangan',
  'not',
  'never',
]);

const INTENSIFIER_TOKENS = new Set([
  'banget',
  'sangat',
  'amat',
  'super',
  'beneran',
  'benar',
  'paling',
  'terlalu',
  'really',
  'very',
]);

export function analyzeCommentSentiment(text: string): {
  sentiment: SentimentCategory;
  score: number;
  matchedKeywords: string[];
} {
  const normalized = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s!?]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) {
    return { sentiment: 'netral', score: 0, matchedKeywords: [] };
  }

  let totalScore = 0;
  const matchedKeywords: string[] = [];
  let workingText = normalized;

  // 1. Match multi-word phrases first to handle common Indonesian nuances
  for (const [phrase, weight] of Object.entries(POSITIVE_PHRASES)) {
    if (workingText.includes(phrase)) {
      totalScore += weight;
      matchedKeywords.push(phrase);
      workingText = workingText.replaceAll(phrase, ' ');
    }
  }

  for (const [phrase, weight] of Object.entries(NEGATIVE_PHRASES)) {
    if (workingText.includes(phrase)) {
      totalScore += weight;
      matchedKeywords.push(phrase);
      workingText = workingText.replaceAll(phrase, ' ');
    }
  }

  // 2. Token-level scoring with negation & intensifier lookback
  const tokens = workingText.split(/\s+/).filter(Boolean);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prevToken = i > 0 ? tokens[i - 1] : '';
    const nextToken = i < tokens.length - 1 ? tokens[i + 1] : '';

    const hasNegation = NEGATION_TOKENS.has(prevToken);
    const hasIntensifier =
      INTENSIFIER_TOKENS.has(prevToken) || INTENSIFIER_TOKENS.has(nextToken);
    const multiplier = hasIntensifier ? 1.25 : 1;

    if (token in POSITIVE_WORDS) {
      const base = POSITIVE_WORDS[token];
      if (hasNegation) {
        totalScore -= base * 1.15;
        matchedKeywords.push(`${prevToken} ${token}`);
      } else {
        totalScore += base * multiplier;
        matchedKeywords.push(token);
      }
    } else if (token in NEGATIVE_WORDS) {
      const base = NEGATIVE_WORDS[token];
      if (hasNegation && token !== 'kurang') {
        totalScore += Math.abs(base) * 0.7;
        matchedKeywords.push(`${prevToken} ${token}`);
      } else {
        totalScore += base * multiplier;
        matchedKeywords.push(token);
      }
    }
  }

  // 3. Punctuation emphasis
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount >= 2 && totalScore !== 0) {
    totalScore *= 1.1;
  }

  const uniqueKeywords = Array.from(new Set(matchedKeywords)).slice(0, 5);

  let sentiment: SentimentCategory = 'netral';
  if (totalScore >= 0.75) {
    sentiment = 'positif';
  } else if (totalScore <= -0.75) {
    sentiment = 'negatif';
  }

  return {
    sentiment,
    score: Number(totalScore.toFixed(2)),
    matchedKeywords: uniqueKeywords,
  };
}

export function computeSentimentSummary(
  comments: AudienceComment[],
  positiveThreshold = 60,
  negativeAlertThreshold = 25
): SentimentSummary {
  const total = comments.length;
  const positifCount = comments.filter((c) => c.sentiment === 'positif').length;
  const netralCount = comments.filter((c) => c.sentiment === 'netral').length;
  const negatifCount = comments.filter((c) => c.sentiment === 'negatif').length;

  let positifPct = 0;
  let netralPct = 0;
  let negatifPct = 0;

  if (total > 0) {
    positifPct = Math.round((positifCount / total) * 100);
    negatifPct = Math.round((negatifCount / total) * 100);
    netralPct = Math.max(0, 100 - positifPct - negatifPct);
    if (positifPct + netralPct + negatifPct !== 100) {
      positifPct = 100 - netralPct - negatifPct;
    }
  }

  const netSentimentScore = total > 0 ? positifPct - negatifPct : 0;

  const isPositiveImpact =
    total > 0 &&
    positifPct >= positiveThreshold &&
    negatifPct < negativeAlertThreshold &&
    positifPct > negatifPct;

  let impactLabel = 'Belum Ada Data Audiens';
  let impactDescription =
    'Masukkan komentar audiens terlebih dahulu untuk mengetahui kecenderungan pengaruh influencer terhadap citra merek.';

  if (total > 0) {
    if (isPositiveImpact && positifPct >= 75) {
      impactLabel = 'Pengaruh Positif Kuat';
      impactDescription = `Mayoritas audiens (${positifPct}%) memberikan respons positif. Kolaborasi memperkuat kredibilitas dan persepsi positif terhadap citra merek.`;
    } else if (isPositiveImpact) {
      impactLabel = 'Pengaruh Positif';
      impactDescription = `Sentimen positif (${positifPct}%) melampaui ambang batas minimal (${positiveThreshold}%) dengan sentimen negatif terkendali (${negatifPct}%). Citra merek terdorong ke arah positif.`;
    } else if (negatifPct >= negativeAlertThreshold || negatifPct >= positifPct) {
      impactLabel = 'Pengaruh Negatif / Berisiko';
      impactDescription = `Sentimen negatif (${negatifPct}%) cukup tinggi dan berpotensi menurunkan kepercayaan audiens terhadap citra merek. Diperlukan perbaikan strategi komunikasi.`;
    } else {
      impactLabel = 'Pengaruh Belum Optimal (Campuran)';
      impactDescription = `Sentimen positif (${positifPct}%) belum mencapai ambang batas target (${positiveThreshold}%) dan didominasi komentar netral/campuran. Strategi pesan perlu disesuaikan.`;
    }
  }

  const posKeywordCounts: Record<string, number> = {};
  const negKeywordCounts: Record<string, number> = {};

  for (const comment of comments) {
    for (const kw of comment.matchedKeywords) {
      if (comment.sentiment === 'positif') {
        posKeywordCounts[kw] = (posKeywordCounts[kw] || 0) + 1;
      } else if (comment.sentiment === 'negatif') {
        negKeywordCounts[kw] = (negKeywordCounts[kw] || 0) + 1;
      }
    }
  }

  const topPositiveKeywords = Object.entries(posKeywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  const topNegativeKeywords = Object.entries(negKeywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return {
    total,
    positifCount,
    netralCount,
    negatifCount,
    positifPct,
    netralPct,
    negatifPct,
    netSentimentScore,
    isPositiveImpact,
    impactLabel,
    impactDescription,
    recommendationType: isPositiveImpact ? 'lanjutkan' : 'perbaiki_strategi',
    topPositiveKeywords,
    topNegativeKeywords,
  };
}
