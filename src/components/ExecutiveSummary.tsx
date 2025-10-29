import React from 'react';
import { colors, typography, spacing } from '../designTokens';
import { Program, CoverageStatus } from '../types/Program';
import { getProgramBreakdown } from '../utils/programStats';

interface ExecutiveSummaryProps {
  programs: Program[];
  statusCounts: Record<CoverageStatus, number>;
  totalPrograms: number;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ programs, statusCounts, totalPrograms }) => {
  const breakdown = getProgramBreakdown(programs);
  const completionRate = Math.round((statusCounts.complete / totalPrograms) * 100);

  return (
    <div style={{
      backgroundColor: colors.white,
      padding: spacing['2xl'],
      borderRadius: spacing.radius.lg,
      boxShadow: spacing.shadow.lg,
      border: `1px solid ${colors.border.light}`,
    }}>
      <p style={{
        margin: `0 0 ${spacing.lg}`,
        color: colors.text.secondary,
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.body,
        lineHeight: typography.lineHeight.relaxed,
      }}>
        PolicyEngine US is a comprehensive tax and benefit microsimulation model that calculates household
        eligibility and amounts for government programs. This tracker shows implementation status across
        federal, state, and local programs.
      </p>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: spacing.lg,
        marginBottom: spacing.lg,
      }}>
        <div style={{
          textAlign: 'center',
          padding: spacing.lg,
          backgroundColor: colors.background.secondary,
          borderRadius: spacing.radius.md,
        }}>
          <div style={{
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            fontFamily: typography.fontFamily.primary,
            color: colors.primary[600],
            marginBottom: spacing.xs,
          }}>
            {totalPrograms}
          </div>
          <div style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            fontFamily: typography.fontFamily.body,
          }}>
            Total Programs
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: spacing.lg,
          backgroundColor: colors.background.secondary,
          borderRadius: spacing.radius.md,
        }}>
          <div style={{
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            fontFamily: typography.fontFamily.primary,
            color: colors.success,
            marginBottom: spacing.xs,
          }}>
            {completionRate}%
          </div>
          <div style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            fontFamily: typography.fontFamily.body,
          }}>
            Complete
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: spacing.lg,
          backgroundColor: colors.background.secondary,
          borderRadius: spacing.radius.md,
        }}>
          <div style={{
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            fontFamily: typography.fontFamily.primary,
            color: colors.blue[600],
            marginBottom: spacing.xs,
          }}>
            {breakdown.byAgency.length + 1}
          </div>
          <div style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            fontFamily: typography.fontFamily.body,
          }}>
            Federal Agencies
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: spacing.lg,
          backgroundColor: colors.background.secondary,
          borderRadius: spacing.radius.md,
        }}>
          <div style={{
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            fontFamily: typography.fontFamily.primary,
            color: colors.primary[600],
            marginBottom: spacing.xs,
          }}>
            {breakdown.totalStates}
          </div>
          <div style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            fontFamily: typography.fontFamily.body,
          }}>
            States Covered
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
