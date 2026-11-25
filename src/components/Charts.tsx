import React, { useState } from 'react';
import { TrendPoint } from '../types';

interface LineChartProps {
  data: TrendPoint[];
  height?: number;
}

export const SentimentLineChart: React.FC<LineChartProps> = ({
  data,
  height = 240,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 text-sm text-slate-500">
        Belum ada data perkembangan tren sentimen.
      </div>
    );
  }

  const width = 620;
  const padLeft = 40;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 34;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const getX = (index: number) => {
    if (data.length === 1) return padLeft + innerW / 2;
    return padLeft + (index / (data.length - 1)) * innerW;
  };

  const getY = (value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    return padTop + innerH - (clamped / 100) * innerH;
  };

  const buildPath = (key: 'positif' | 'netral' | 'negatif') =>
    data
      .map((point, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(point[key])}`)
      .join(' ');

  const yTicks = [0, 25, 50, 75, 100];
  const activePoint = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Grafik garis perkembangan sentimen audiens"
      >
        {yTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                x2={width - padRight}
                y1={y}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray={tick === 0 ? undefined : '4 4'}
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[11px] font-mono tabular-nums"
              >
                {tick}%
              </text>
            </g>
          );
        })}

        {/* Hover guide line */}
        {hoveredIdx !== null && (
          <line
            x1={getX(hoveredIdx)}
            x2={getX(hoveredIdx)}
            y1={padTop}
            y2={padTop + innerH}
            stroke="#CBD5E1"
            strokeWidth="1"
          />
        )}

        {/* Lines */}
        <path
          d={buildPath('negatif')}
          fill="none"
          stroke="#DC2626"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={buildPath('netral')}
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={buildPath('positif')}
          fill="none"
          stroke="#6D28D9"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points & Labels */}
        {data.map((point, idx) => {
          const cx = getX(idx);
          const isHovered = hoveredIdx === idx;
          return (
            <g key={point.label}>
              <text
                x={cx}
                y={height - 10}
                textAnchor="middle"
                className={`text-[11px] ${
                  isHovered ? 'fill-slate-900 font-semibold' : 'fill-slate-500'
                }`}
              >
                {point.label}
              </text>

              <circle
                cx={cx}
                cy={getY(point.positif)}
                r={isHovered ? 5.5 : 3.5}
                fill="#6D28D9"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <circle
                cx={cx}
                cy={getY(point.netral)}
                r={isHovered ? 5 : 3}
                fill="#0EA5E9"
                stroke="#FFFFFF"
                strokeWidth="1.75"
              />
              <circle
                cx={cx}
                cy={getY(point.negatif)}
                r={isHovered ? 5 : 3}
                fill="#DC2626"
                stroke="#FFFFFF"
                strokeWidth="1.75"
              />

              {/* Invisible hit zone */}
              <rect
                x={cx - innerW / (data.length * 2)}
                y={padTop}
                width={innerW / data.length}
                height={innerH + 24}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#6D28D9] inline-block" />
            <span>Positif</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#0EA5E9] inline-block" />
            <span>Netral</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#DC2626] inline-block" />
            <span>Negatif</span>
          </span>
        </div>

        {activePoint ? (
          <div className="font-mono tabular-nums text-xs text-slate-700">
            {activePoint.label}: Positif {activePoint.positif}% · Netral{' '}
            {activePoint.netral}% · Negatif {activePoint.negatif}%
          </div>
        ) : (
          <div className="text-slate-400">Arahkan kursor ke titik grafik untuk detail</div>
        )}
      </div>
    </div>
  );
};

interface DonutChartProps {
  positifPct: number;
  netralPct: number;
  negatifPct: number;
  positifCount: number;
  netralCount: number;
  negatifCount: number;
  total: number;
}

export const SentimentDonutChart: React.FC<DonutChartProps> = ({
  positifPct,
  netralPct,
  negatifPct,
  positifCount,
  netralCount,
  negatifCount,
  total,
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const radius = 64;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    {
      key: 'positif',
      label: 'Positif',
      pct: positifPct,
      count: positifCount,
      color: '#6D28D9',
    },
    {
      key: 'netral',
      label: 'Netral',
      pct: netralPct,
      count: netralCount,
      color: '#38BDF8',
    },
    {
      key: 'negatif',
      label: 'Negatif',
      pct: negatifPct,
      count: negatifCount,
      color: '#DC2626',
    },
  ];

  let cumulativePct = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-44 h-44 shrink-0">
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {total > 0 &&
            segments.map((seg) => {
              if (seg.pct <= 0) return null;
              const dash = (seg.pct / 100) * circumference;
              const offset = -(cumulativePct / 100) * circumference;
              cumulativePct += seg.pct;
              const isHighlighted = hoveredSegment === seg.key;

              return (
                <circle
                  key={seg.key}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isHighlighted ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={offset}
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredSegment(seg.key)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              );
            })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {total > 0
              ? hoveredSegment
                ? `${segments.find((s) => s.key === hoveredSegment)?.pct ?? 0}%`
                : `${positifPct}%`
              : '0%'}
          </span>
          <span className="text-xs text-slate-500">
            {hoveredSegment
              ? segments.find((s) => s.key === hoveredSegment)?.label
              : 'Positif'}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-3">
        {segments.map((seg) => (
          <div
            key={seg.key}
            onMouseEnter={() => setHoveredSegment(seg.key)}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`flex items-center justify-between py-2 px-3 rounded-lg border transition-colors ${
              hoveredSegment === seg.key
                ? 'border-slate-300 bg-slate-50'
                : 'border-slate-100 bg-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-sm font-medium text-slate-700">{seg.label}</span>
            </div>
            <div className="flex items-center gap-3 font-mono tabular-nums text-sm">
              <span className="text-slate-400 text-xs">{seg.count} komentar</span>
              <span className="font-semibold text-slate-900 w-10 text-right">
                {seg.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export interface BarComparisonItem {
  id: string;
  label: string;
  positifPct: number;
  netralPct: number;
  negatifPct: number;
  totalComments: number;
}

interface BarChartProps {
  items: BarComparisonItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export const SentimentBarChart: React.FC<BarChartProps> = ({
  items,
  selectedId,
  onSelect,
}) => {
  if (items.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-slate-500">
        Belum ada data perbandingan influencer.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#6D28D9]" />
            <span>Positif</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#38BDF8]" />
            <span>Netral</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#DC2626]" />
            <span>Negatif</span>
          </span>
        </div>
        <span className="text-slate-400">Distribusi persentase per influencer</span>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(item.id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                isSelected
                  ? 'border-[#6D28D9] bg-indigo-50/40'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item.label}
                </span>
                <span className="text-xs text-slate-500 font-mono tabular-nums whitespace-nowrap shrink-0">
                  {item.positifPct}% Pos · {item.netralPct}% Net · {item.negatifPct}% Neg (
                  {item.totalComments})
                </span>
              </div>

              <div className="h-3.5 w-full rounded bg-slate-100 overflow-hidden flex">
                {item.positifPct > 0 && (
                  <div
                    style={{ width: `${item.positifPct}%` }}
                    className="bg-[#6D28D9] h-full transition-all duration-200"
                    title={`Positif: ${item.positifPct}%`}
                  />
                )}
                {item.netralPct > 0 && (
                  <div
                    style={{ width: `${item.netralPct}%` }}
                    className="bg-[#38BDF8] h-full transition-all duration-200"
                    title={`Netral: ${item.netralPct}%`}
                  />
                )}
                {item.negatifPct > 0 && (
                  <div
                    style={{ width: `${item.negatifPct}%` }}
                    className="bg-[#DC2626] h-full transition-all duration-200"
                    title={`Negatif: ${item.negatifPct}%`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
