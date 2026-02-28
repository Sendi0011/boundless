'use client';

import { useMemo } from 'react';
import { useAuthStatus } from '@/hooks/use-auth';
import { GetMeResponse } from '@/lib/api/types';
import { AnalyticsBentoGrid } from '@/components/analytics/AnalyticsBentoGrid';
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart';
import { AuthGuard } from '@/components/auth';
import LoadingSpinner from '@/components/LoadingSpinner';

function AnalyticsContent() {
  const { user, isLoading } = useAuthStatus();

  const meData = useMemo(
    () => (user?.profile as GetMeResponse | undefined) ?? null,
    [user?.profile]
  );

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <LoadingSpinner size='xl' color='white' />
      </div>
    );
  }

  if (!meData?.stats || !meData?.chart) {
    return (
      <div className='flex h-64 items-center justify-center text-sm text-zinc-500'>
        Analytics data unavailable.
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 px-4 py-6 lg:px-6'>
      {/* Page header */}
      <div>
        <h1 className='text-2xl font-bold text-white'>Analytics</h1>
        <p className='mt-1 text-sm text-zinc-500'>
          Your personal growth dashboard
        </p>
      </div>

      {/* Bento grid — core stats */}
      <AnalyticsBentoGrid stats={meData.stats} chart={meData.chart} />

      {/* Activity chart */}
      <AnalyticsChart chart={meData.chart} />
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AuthGuard
      redirectTo='/auth?mode=signin'
      fallback={<div className='p-8 text-center'>Authenticating...</div>}
    >
      <AnalyticsContent />
    </AuthGuard>
  );
}
