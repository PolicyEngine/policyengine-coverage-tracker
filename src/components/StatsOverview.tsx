import React from 'react';
import { colors, statusColors, typography, spacing } from '../designTokens';
import { CoverageStatus } from '../types/Program';

interface StatsOverviewProps {
  statusCounts: Record<CoverageStatus, number>;
  totalPrograms: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ statusCounts, totalPrograms }) => {
  const stats = [
    {
      label: 'Total Programs',
      value: totalPrograms,
      color: colors.secondary[900],
    },
    {
      label: 'Complete',
      value: statusCounts.complete,
      color: statusColors.complete,
    },
    {
      label: 'Partial Coverage',
      value: statusCounts.partial,
      color: statusColors.partial,
    },
    {
      label: 'In Progress',
      value: statusCounts.inProgress,
      color: statusColors.inProgress,
    },
  ];

  return (
    <div style={{ marginBottom: spacing['3xl'] }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.lg }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: colors.white,
              padding: spacing.xl,
              borderRadius: spacing.radius.lg,
              boxShadow: spacing.shadow.sm,
              borderLeft: `4px solid ${stat.color}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', height: '80px' }}>
              <div style={{
                fontSize: typography.fontSize['4xl'],
                fontWeight: typography.fontWeight.bold,
                fontFamily: typography.fontFamily.primary,
                color: stat.color,
                marginBottom: spacing.sm,
                lineHeight: 1
              }}>
                {stat.value}
              </div>
              <div style={{
                color: colors.text.secondary,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                fontFamily: typography.fontFamily.body,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsOverview;