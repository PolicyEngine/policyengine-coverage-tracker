import React from 'react';
import { colors, typography, spacing } from '../designTokens';
import { Program, CoverageStatus } from '../types/Program';

interface ExecutiveSummaryProps {
  programs: Program[];
  statusCounts: Record<CoverageStatus, number>;
  totalPrograms: number;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ programs, statusCounts, totalPrograms }) => {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        backgroundColor: colors.white,
        padding: spacing['2xl'],
        borderRadius: '16px',
        boxShadow: 'var(--shadow-elevation-low)',
        border: `1px solid ${colors.border.light}`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle gradient accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #2C7A7B 0%, #38B2AC 50%, #0EA5E9 100%)',
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: spacing.xl }}>
        <h2
          style={{
            margin: 0,
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.secondary[900],
            fontFamily: typography.fontFamily.primary,
            letterSpacing: '-0.02em',
          }}
        >
          Implementation Overview
        </h2>
        <p
          style={{
            margin: `${spacing.sm} 0 0`,
            color: colors.text.secondary,
            fontSize: typography.fontSize.base,
            fontFamily: typography.fontFamily.body,
            lineHeight: typography.lineHeight.relaxed,
            maxWidth: '720px',
          }}
        >
          PolicyEngine US is a comprehensive tax and benefit microsimulation model that calculates
          household eligibility and amounts for government programs.
        </p>
      </div>

      {/* Key Metrics */}
      <div
        className="stagger-children"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: spacing.lg,
        }}
      >
        {/* Total Programs */}
        <div
          style={{
            textAlign: 'center',
            padding: spacing.xl,
            backgroundColor: colors.background.secondary,
            borderRadius: '12px',
            border: `1px solid ${colors.border.light}`,
          }}
        >
          <div
            className="metric-number"
            style={{
              fontSize: '40px',
              fontWeight: typography.fontWeight.bold,
              fontFamily: typography.fontFamily.primary,
              color: colors.secondary[900],
              marginBottom: spacing.xs,
              lineHeight: 1,
            }}
          >
            {totalPrograms}
          </div>
          <div
            style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.secondary,
              fontFamily: typography.fontFamily.primary,
              fontWeight: typography.fontWeight.semibold,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Total Programs
          </div>
        </div>

        {/* Complete */}
        <div
          style={{
            textAlign: 'center',
            padding: spacing.xl,
            backgroundColor: colors.background.secondary,
            borderRadius: '12px',
            border: `1px solid ${colors.border.light}`,
          }}
        >
          <div
            className="metric-number"
            style={{
              fontSize: '40px',
              fontWeight: typography.fontWeight.bold,
              fontFamily: typography.fontFamily.primary,
              color: colors.primary[600],
              marginBottom: spacing.xs,
              lineHeight: 1,
            }}
          >
            {statusCounts.complete}
          </div>
          <div
            style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.secondary,
              fontFamily: typography.fontFamily.primary,
              fontWeight: typography.fontWeight.semibold,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Complete
          </div>
        </div>

        {/* Partial */}
        <div
          style={{
            textAlign: 'center',
            padding: spacing.xl,
            backgroundColor: colors.background.secondary,
            borderRadius: '12px',
            border: `1px solid ${colors.border.light}`,
          }}
        >
          <div
            className="metric-number"
            style={{
              fontSize: '40px',
              fontWeight: typography.fontWeight.bold,
              fontFamily: typography.fontFamily.primary,
              color: colors.primary[400],
              marginBottom: spacing.xs,
              lineHeight: 1,
            }}
          >
            {statusCounts.partial}
          </div>
          <div
            style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.secondary,
              fontFamily: typography.fontFamily.primary,
              fontWeight: typography.fontWeight.semibold,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Partial Coverage
          </div>
        </div>

        {/* In Progress */}
        <div
          style={{
            textAlign: 'center',
            padding: spacing.xl,
            backgroundColor: colors.background.secondary,
            borderRadius: '12px',
            border: `1px solid ${colors.border.light}`,
          }}
        >
          <div
            className="metric-number"
            style={{
              fontSize: '40px',
              fontWeight: typography.fontWeight.bold,
              fontFamily: typography.fontFamily.primary,
              color: colors.blue[500],
              marginBottom: spacing.xs,
              lineHeight: 1,
            }}
          >
            {statusCounts.inProgress}
          </div>
          <div
            style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.secondary,
              fontFamily: typography.fontFamily.primary,
              fontWeight: typography.fontWeight.semibold,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            In Progress
          </div>
        </div>
      </div>

    </div>
  );
};

export default ExecutiveSummary;
