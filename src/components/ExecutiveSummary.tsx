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
    <div style={{
      backgroundColor: colors.white,
      padding: spacing['2xl'],
      borderRadius: spacing.radius.lg,
      boxShadow: spacing.shadow.md,
      border: `1px solid ${colors.border.light}`,
      overflow: 'hidden',
    }}>
      <p style={{
        margin: `0 0 ${spacing.xl}`,
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
        display: 'flex',
        gap: spacing.lg,
      }}>
        <div style={{
          textAlign: 'center',
          padding: spacing.lg,
          backgroundColor: colors.background.secondary,
          borderRadius: spacing.radius.md,
          flex: '1',
        }}>
          <div style={{
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            fontFamily: typography.fontFamily.primary,
            color: colors.secondary[900],
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
          flex: '1',
        }}>
          <div style={{
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            fontFamily: typography.fontFamily.primary,
            color: colors.primary[600],
            marginBottom: spacing.xs,
          }}>
            {statusCounts.complete}
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
          flex: '1',
        }}>
          <div style={{
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            fontFamily: typography.fontFamily.primary,
            color: colors.primary[400],
            marginBottom: spacing.xs,
          }}>
            {statusCounts.partial}
          </div>
          <div style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            fontFamily: typography.fontFamily.body,
          }}>
            Partial Coverage
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: spacing.lg,
          backgroundColor: colors.background.secondary,
          borderRadius: spacing.radius.md,
          flex: '1',
        }}>
          <div style={{
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            fontFamily: typography.fontFamily.primary,
            color: colors.blue[500],
            marginBottom: spacing.xs,
          }}>
            {statusCounts.inProgress}
          </div>
          <div style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            fontFamily: typography.fontFamily.body,
          }}>
            In Progress
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
