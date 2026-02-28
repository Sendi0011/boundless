'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  FolderGit2,
  Trophy,
  Star,
  DollarSign,
  MessageSquare,
  ThumbsUp,
  GitBranch,
} from 'lucide-react';
import { GetMeResponse } from '@/lib/api/types';
import { calculateChartTrend, TrendResult } from '@/lib/utils/calculateTrend';

interface Props {
  stats: GetMeResponse['stats'];
  chart: GetMeResponse['chart'];
}

function TrendBadge({ trend }: { trend: TrendResult }) {
  if (trend.direction === 'up') {
    return (
      <span
        aria-label={`Up ${trend.percentage}%`}
        className='inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400'
      >
        <TrendingUp className='h-3 w-3' aria-hidden='true' />
        {trend.percentage}%
      </span>
    );
  }
  if (trend.direction === 'down') {
    return (
      <span
        aria-label={`Down ${trend.percentage}%`}
        className='inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-400'
      >
        <TrendingDown className='h-3 w-3' aria-hidden='true' />
        {trend.percentage}%
      </span>
    );
  }
  return (
    <span
      aria-label='No change'
      className='inline-flex items-center gap-1 rounded-full bg-zinc-700/50 px-2 py-0.5 text-xs font-medium text-zinc-400'
    >
      <Minus className='h-3 w-3' aria-hidden='true' />
      0%
    </span>
  );
}

interface TileConfig {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend: TrendResult;
  colSpan: string;
  rowSpan: string;
  gradient: string;
  large?: boolean;
}

const FLAT_TREND: TrendResult = { percentage: 0, direction: 'flat' };

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const tileVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
};

export function AnalyticsBentoGrid({ stats, chart }: Props) {
  const chartTrend = useMemo(() => calculateChartTrend(chart), [chart]);

  const tiles: TileConfig[] = useMemo(
    () => [
      {
        label: 'Global Reputation',
        value: stats.reputation,
        icon: <Star className='h-5 w-5' />,
        trend: chartTrend,
        colSpan: 'col-span-2',
        rowSpan: 'row-span-2',
        gradient:
          'bg-gradient-to-br from-[#06b6d4]/20 via-[#4f46e5]/10 to-transparent',
        large: true,
      },
      {
        label: 'Community Score',
        value: stats.communityScore,
        icon: <Users className='h-4 w-4' />,
        trend: chartTrend,
        colSpan: 'col-span-1',
        rowSpan: 'row-span-1',
        gradient: 'bg-white/[0.03]',
      },
      {
        label: 'Projects Created',
        value: stats.projectsCreated,
        icon: <FolderGit2 className='h-4 w-4' />,
        trend: FLAT_TREND,
        colSpan: 'col-span-1',
        rowSpan: 'row-span-1',
        gradient: 'bg-white/[0.03]',
      },
      {
        label: 'Hackathons Entered',
        value: stats.hackathons,
        icon: <Trophy className='h-4 w-4' />,
        trend: FLAT_TREND,
        colSpan: 'col-span-1',
        rowSpan: 'row-span-1',
        gradient: 'bg-gradient-to-br from-amber-500/10 to-transparent',
      },
      {
        label: 'Followers',
        value: stats.followers,
        icon: <Users className='h-4 w-4' />,
        trend: FLAT_TREND,
        colSpan: 'col-span-1',
        rowSpan: 'row-span-1',
        gradient: 'bg-white/[0.03]',
      },
      {
        label: 'Total Contributed',
        value: stats.totalContributed,
        icon: <DollarSign className='h-4 w-4' />,
        trend: FLAT_TREND,
        colSpan: 'col-span-1',
        rowSpan: 'row-span-1',
        gradient: 'bg-gradient-to-br from-emerald-500/10 to-transparent',
      },
      {
        label: 'Comments Posted',
        value: stats.commentsPosted,
        icon: <MessageSquare className='h-4 w-4' />,
        trend: FLAT_TREND,
        colSpan: 'col-span-1',
        rowSpan: 'row-span-1',
        gradient: 'bg-white/[0.03]',
      },
      {
        label: 'Votes Cast',
        value: stats.votes,
        icon: <ThumbsUp className='h-4 w-4' />,
        trend: FLAT_TREND,
        colSpan: 'col-span-1',
        rowSpan: 'row-span-1',
        gradient: 'bg-white/[0.03]',
      },
      {
        label: 'Following',
        value: stats.following,
        icon: <GitBranch className='h-4 w-4' />,
        trend: FLAT_TREND,
        colSpan: 'col-span-1',
        rowSpan: 'row-span-1',
        gradient: 'bg-white/[0.03]',
      },
    ],
    [stats, chartTrend]
  );

  return (
    <>
      <table className='sr-only' aria-label='Analytics statistics'>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {tiles.map(t => (
            <tr key={t.label}>
              <td>{t.label}</td>
              <td>{t.value.toLocaleString()}</td>
              <td>
                {t.trend.direction === 'flat'
                  ? 'No change'
                  : `${t.trend.direction === 'up' ? 'Up' : 'Down'} ${t.trend.percentage}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <motion.div
        aria-hidden='true'
        variants={containerVariants}
        initial='hidden'
        animate='show'
        className='grid grid-cols-2 gap-3 sm:grid-cols-4'
      >
        {tiles.map(tile => (
          <motion.div
            key={tile.label}
            variants={tileVariants}
            className={`relative flex flex-col justify-between rounded-2xl border border-white/[0.06] p-5 backdrop-blur-sm transition-colors duration-200 hover:border-white/10 ${tile.gradient} ${tile.colSpan} ${tile.rowSpan}`}
          >
            <div className='pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent' />
            <div className='flex items-start justify-between'>
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-300'>
                {tile.icon}
              </div>
              <TrendBadge trend={tile.trend} />
            </div>
            <div className='mt-4'>
              <p
                className={`font-bold tracking-tight text-white ${tile.large ? 'text-4xl' : 'text-2xl'}`}
              >
                {tile.value.toLocaleString()}
              </p>
              <p className='mt-1 text-sm text-zinc-500'>{tile.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
