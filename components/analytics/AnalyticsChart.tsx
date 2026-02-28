'use client';

import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { motion } from 'framer-motion';
import { GetMeResponse } from '@/lib/api/types';
import {
  transformChartData,
  filterChartByRange,
} from '@/lib/utils/calculateTrend';

type Range = '7D' | '30D' | '90D' | 'ALL';
const RANGE_DAYS: Record<Range, number | 'ALL'> = {
  '7D': 7,
  '30D': 30,
  '90D': 90,
  ALL: 'ALL',
};

interface Props {
  chart: GetMeResponse['chart'];
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className='rounded-xl border border-white/10 bg-[#0e0c0c]/90 px-4 py-3 shadow-xl backdrop-blur-md'>
      <p className='mb-1 text-xs text-zinc-500'>{label}</p>
      <p className='text-sm font-semibold text-white'>
        {payload[0].value}{' '}
        <span className='font-normal text-zinc-400'>activities</span>
      </p>
    </div>
  );
}

export function AnalyticsChart({ chart }: Props) {
  const [range, setRange] = useState<Range>('30D');
  const ranges: Range[] = ['7D', '30D', '90D', 'ALL'];

  // Transform lives in the utility — not inline
  const allTransformed = useMemo(() => transformChartData(chart), [chart]);

  const filtered = useMemo(
    () => filterChartByRange(allTransformed, RANGE_DAYS[range]),
    [allTransformed, range]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
      className='rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm'
    >
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='text-base font-semibold text-white'>
            Activity Over Time
          </h3>
          <p className='text-sm text-zinc-500'>Your platform activity trend</p>
        </div>

        <div
          role='group'
          aria-label='Chart time range'
          className='flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1'
        >
          {ranges.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                range === r
                  ? 'bg-gradient-to-r from-[#06b6d4] to-[#4f46e5] text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className='flex h-48 items-center justify-center text-sm text-zinc-600'>
          No activity data available for this period.
        </div>
      ) : (
        <>
          {/* Screen reader data table fallback */}
          <table className='sr-only' aria-label='Activity over time data'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Activity Count</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.date}>
                  <td>{d.label}</td>
                  <td>{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div aria-hidden='true'>
            <ResponsiveContainer width='100%' height={240}>
              <LineChart
                data={filtered}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id='cyanIndigo' x1='0' y1='0' x2='1' y2='0'>
                    <stop offset='0%' stopColor='#06b6d4' />
                    <stop offset='100%' stopColor='#4f46e5' />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='rgba(255,255,255,0.04)'
                />
                <XAxis
                  dataKey='label'
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval='preserveStartEnd'
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type='monotone'
                  dataKey='count'
                  stroke='url(#cyanIndigo)'
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#06b6d4', strokeWidth: 0 }}
                  isAnimationActive
                  animationDuration={600}
                  animationEasing='ease-out'
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </motion.div>
  );
}
