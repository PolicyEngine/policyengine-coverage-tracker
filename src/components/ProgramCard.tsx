import React from 'react';
import { Program, CoverageStatus } from '../types/Program';
import { statusColors, colors, typography, spacing } from '../designTokens';

interface ProgramCardProps {
  program: Program;
  selectedState?: string;
  onStateSelect?: (state: string) => void;
  showTechnicalLinks?: boolean;
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

const getStatusLabel = (status: CoverageStatus) => {
  switch (status) {
    case 'complete':
      return 'Complete';
    case 'partial':
      return 'Partial';
    case 'inProgress':
      return 'In Progress';
    case 'notStarted':
      return 'Not Started';
  }
};

const ProgramCard: React.FC<ProgramCardProps> = ({ program, selectedState, onStateSelect, showTechnicalLinks = true }) => {
  let displayStatus = program.status;

  if (selectedState && selectedState !== 'All' && program.stateImplementations) {
    const stateImpl = program.stateImplementations.find(impl => impl.state === selectedState);
    if (stateImpl) {
      displayStatus = stateImpl.status;
    }
  }

  const statusColor = statusColors[displayStatus];

  // Filter out notStarted state implementations
  // For TANF: only show completed state implementations
  const filteredStateImplementations = program.stateImplementations?.filter(
    impl => {
      if (program.id === 'tanf') {
        return impl.status === 'complete';
      }
      return impl.status !== 'notStarted';
    }
  );

  return (
    <div
      style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.border.light}`,
        borderRadius: '12px',
        padding: `${spacing.md} ${spacing.lg}`,
        marginBottom: spacing.sm,
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-elevation-low)',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-elevation-medium)';
        e.currentTarget.style.borderColor = statusColor;
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-elevation-low)';
        e.currentTarget.style.borderColor = colors.border.light;
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      {/* Status accent on left */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          backgroundColor: statusColor,
        }}
      />

      {/* Left section - Program info */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, paddingLeft: spacing.sm }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
            <h3 style={{
              margin: 0,
              color: colors.secondary[900],
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              fontFamily: typography.fontFamily.primary,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {program.name}
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: '16px',
                backgroundColor: `${statusColor}15`,
                color: statusColor,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
                fontFamily: typography.fontFamily.primary,
                whiteSpace: 'nowrap',
                gap: spacing.xs,
              }}
            >
              <span>{getStatusIcon(displayStatus)}</span>
              {getStatusLabel(displayStatus)}
            </div>
            {!program.stateImplementations && program.coverage && program.coverage !== 'US' && (
              <span style={{
                color: colors.gray[600],
                fontSize: typography.fontSize.xs,
                fontFamily: typography.fontFamily.body,
                backgroundColor: colors.gray[100],
                padding: `4px ${spacing.sm}`,
                borderRadius: '16px',
                whiteSpace: 'nowrap',
                fontWeight: typography.fontWeight.medium,
              }}>
                {program.coverage}
              </span>
            )}
          </div>
          {program.notes && (
            <p style={{
              margin: `${spacing.xs} 0 0`,
              color: colors.text.secondary,
              fontSize: typography.fontSize.xs,
              fontFamily: typography.fontFamily.body,
              fontStyle: 'italic',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '400px',
            }}>
              {program.notes}
            </p>
          )}
        </div>
      </div>

      {/* Right section - Links or State options */}
      {showTechnicalLinks && (
        <div style={{ display: 'flex', gap: spacing.xs, alignItems: 'center', flexShrink: 0 }}>
          {filteredStateImplementations && filteredStateImplementations.length > 0 ? (
          // Show state buttons for programs with state implementations (excluding notStarted)
          filteredStateImplementations.slice(0, 8).map((stateImpl) => (
            <button
              key={stateImpl.state}
              style={{
                padding: `4px ${spacing.sm}`,
                backgroundColor: colors.primary[50],
                color: colors.primary[700],
                border: `1px solid ${colors.primary[100]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
                fontFamily: typography.fontFamily.primary,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary[600];
                e.currentTarget.style.color = colors.white;
                e.currentTarget.style.borderColor = colors.primary[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary[50];
                e.currentTarget.style.color = colors.primary[700];
                e.currentTarget.style.borderColor = colors.primary[100];
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
                  padding: `4px ${spacing.sm}`,
                  backgroundColor: colors.blue[50],
                  color: colors.blue[700],
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  fontFamily: typography.fontFamily.primary,
                  border: `1px solid ${colors.blue[100]}`,
                  transition: 'all 0.2s ease',
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
                  padding: `4px ${spacing.sm}`,
                  backgroundColor: colors.blue[50],
                  color: colors.blue[700],
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  fontFamily: typography.fontFamily.primary,
                  border: `1px solid ${colors.blue[100]}`,
                  transition: 'all 0.2s ease',
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
                  padding: `4px ${spacing.sm}`,
                  backgroundColor: colors.blue[50],
                  color: colors.blue[700],
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  fontFamily: typography.fontFamily.primary,
                  border: `1px solid ${colors.blue[100]}`,
                  transition: 'all 0.2s ease',
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
                  padding: `4px ${spacing.sm}`,
                  backgroundColor: colors.primary[50],
                  color: colors.primary[700],
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  fontFamily: typography.fontFamily.primary,
                  border: `1px solid ${colors.primary[100]}`,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary[100];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary[50];
                }}
                onClick={(e) => e.stopPropagation()}
              >
                Flowchart
              </a>
            )}
          </>
        )}
        {filteredStateImplementations && filteredStateImplementations.length > 8 && (
          <span style={{
            fontSize: typography.fontSize.xs,
            color: colors.gray[500],
            fontFamily: typography.fontFamily.body,
          }}>
            +{filteredStateImplementations.length - 8} more
          </span>
        )}
        </div>
      )}
    </div>
  );
};

export default ProgramCard;
