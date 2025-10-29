import React from 'react';
import { Program, CoverageStatus } from '../types/Program';
import { statusColors, colors, typography, spacing } from '../designTokens';

interface CompactProgramGridProps {
  programs: Program[];
}

const getStatusIcon = (status: CoverageStatus) => {
  switch (status) {
    case 'complete':
      return '✓';
    case 'partial':
      return '◐';
    case 'inProgress':
      return '⟳';
    case 'notStarted':
      return '○';
  }
};

const CompactProgramGrid: React.FC<CompactProgramGridProps> = ({ programs }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: spacing.sm,
      }}
    >
      {programs.map((program) => {
        const statusColor = statusColors[program.status];

        return (
          <div
            key={program.id}
            style={{
              backgroundColor: colors.white,
              border: `2px solid ${colors.border.light}`,
              borderRadius: spacing.radius.sm,
              padding: `${spacing.sm} ${spacing.md}`,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              minHeight: '50px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = statusColor;
              e.currentTarget.style.boxShadow = spacing.shadow.sm;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border.light;
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                fontSize: typography.fontSize.lg,
                color: statusColor,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {getStatusIcon(program.status)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  fontFamily: typography.fontFamily.primary,
                  color: colors.secondary[900],
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={program.fullName}
              >
                {program.name}
              </div>
              {program.agency && (
                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.text.secondary,
                    fontFamily: typography.fontFamily.body,
                    marginTop: '2px',
                  }}
                >
                  {program.agency}
                </div>
              )}
              {program.category && !program.agency && (
                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.text.secondary,
                    fontFamily: typography.fontFamily.body,
                    marginTop: '2px',
                  }}
                >
                  {program.category}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompactProgramGrid;
