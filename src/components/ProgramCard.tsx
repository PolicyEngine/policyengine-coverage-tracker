import React from 'react';
import { Program, CoverageStatus } from '../types/Program';
import { statusColors, colors, typography, spacing } from '../designTokens';

interface ProgramCardProps {
  program: Program;
  selectedState?: string;
  onStateSelect?: (state: string) => void;
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


const ProgramCard: React.FC<ProgramCardProps> = ({ program, selectedState, onStateSelect }) => {
  let displayStatus = program.status;

  if (selectedState && selectedState !== 'All' && program.stateImplementations) {
    const stateImpl = program.stateImplementations.find(impl => impl.state === selectedState);
    if (stateImpl) {
      displayStatus = stateImpl.status;
    }
  }

  const statusColor = statusColors[displayStatus];

  return (
    <div
      style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.border.light}`,
        borderRadius: spacing.radius.md,
        padding: `${spacing.sm} ${spacing.md}`,
        marginBottom: spacing.xs,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: spacing.shadow.xs,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.background.secondary;
        e.currentTarget.style.borderColor = statusColor;
        e.currentTarget.style.boxShadow = spacing.shadow.sm;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.white;
        e.currentTarget.style.borderColor = colors.border.light;
        e.currentTarget.style.boxShadow = spacing.shadow.xs;
      }}
    >
      {/* Left section - Program info */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <span style={{ fontSize: typography.fontSize.xs, color: statusColor }}>
              {getStatusIcon(displayStatus)}
            </span>
            <h3 style={{
              margin: 0,
              color: colors.secondary[900],
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              fontFamily: typography.fontFamily.primary,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {program.name}
            </h3>
            {program.stateImplementations && program.coverage && program.coverage !== 'US' && (
              <span style={{
                color: colors.gray[600],
                fontSize: typography.fontSize.xs,
                fontFamily: typography.fontFamily.body,
                backgroundColor: colors.gray[100],
                padding: `2px ${spacing.xs}`,
                borderRadius: spacing.radius.xs,
                whiteSpace: 'nowrap'
              }}>
                {program.coverage}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right section - Links or State options */}
      <div style={{ display: 'flex', gap: spacing.xs, alignItems: 'center' }}>
        {program.stateImplementations && program.stateImplementations.length > 0 ? (
          // Show state buttons for programs with state implementations
          program.stateImplementations.map((stateImpl) => (
            <button
              key={stateImpl.state}
              style={{
                padding: `2px ${spacing.sm}`,
                backgroundColor: colors.primary[50],
                color: colors.primary[700],
                border: 'none',
                borderRadius: spacing.radius.sm,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.medium,
                fontFamily: typography.fontFamily.primary,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary[400];
                e.currentTarget.style.color = colors.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary[50];
                e.currentTarget.style.color = colors.primary[700];
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onStateSelect) {
                  onStateSelect(stateImpl.state);
                }
              }}
            >
              {stateImpl.state}
            </button>
          ))
        ) : (
          // Show regular GitHub links for programs without state implementations
          <>
            {program.githubLinks.parameters && (
              <a
                href={program.githubLinks.parameters}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: `2px ${spacing.sm}`,
                  backgroundColor: colors.blue[50],
                  color: colors.blue[700],
                  textDecoration: 'none',
                  borderRadius: spacing.radius.sm,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  fontFamily: typography.fontFamily.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.blue[100];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.blue[50];
                }}
                onClick={(e) => e.stopPropagation()}
              >
                Parameters
              </a>
            )}
            {program.githubLinks.variables && (
              <a
                href={program.githubLinks.variables}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: `2px ${spacing.sm}`,
                  backgroundColor: colors.blue[50],
                  color: colors.blue[700],
                  textDecoration: 'none',
                  borderRadius: spacing.radius.sm,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  fontFamily: typography.fontFamily.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.blue[100];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.blue[50];
                }}
                onClick={(e) => e.stopPropagation()}
              >
                Variables
              </a>
            )}
            {program.githubLinks.tests && (
              <a
                href={program.githubLinks.tests}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: `2px ${spacing.sm}`,
                  backgroundColor: colors.blue[50],
                  color: colors.blue[700],
                  textDecoration: 'none',
                  borderRadius: spacing.radius.sm,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  fontFamily: typography.fontFamily.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.blue[100];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.blue[50];
                }}
                onClick={(e) => e.stopPropagation()}
              >
                Tests
              </a>
            )}
            {program.variable && (
              <a
                href={`https://policyengine.github.io/flowchart/?variable=${program.variable}&country=US`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: `2px ${spacing.sm}`,
                  backgroundColor: colors.primary[50],
                  color: colors.primary[700],
                  textDecoration: 'none',
                  borderRadius: spacing.radius.sm,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  fontFamily: typography.fontFamily.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary[100];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary[50];
                }}
                onClick={(e) => e.stopPropagation()}
              >
                Tree
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProgramCard;