import React from 'react';
import { colors, statusColors } from '../constants/colors';
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
      color: colors.DARKEST_BLUE,
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
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: colors.WHITE,
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              borderLeft: `4px solid ${stat.color}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', height: '80px' }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: stat.color, marginBottom: '8px', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ color: colors.DARK_GRAY, fontSize: '14px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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