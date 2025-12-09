import React from 'react';
import { Program, CoverageStatus } from '../types/Program';
import { statusColors, colors, typography, spacing } from '../designTokens';

interface ProgramGridProps {
  programs: Program[];
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

const ProgramGrid: React.FC<ProgramGridProps> = ({ programs, selectedState, onStateSelect, showTechnicalLinks = true }) => {
  return (
    <div
      className="stagger-children"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: spacing.lg,
        rowGap: spacing.xl,
        marginTop: spacing.lg,
      }}
    >
      {programs.map((program) => {
        // Check if this program has state-specific implementation
        let displayStatus = program.status;
        let isStateSpecificView = false;

        if (selectedState && selectedState !== 'All' && program.stateImplementations) {
          const stateImpl = program.stateImplementations.find(impl => impl.state === selectedState);
          if (stateImpl) {
            displayStatus = stateImpl.status;
            isStateSpecificView = true;
          }
        }

        const statusColor = statusColors[displayStatus];

        // Filter state implementations to only show non-notStarted states
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
            key={program.id}
            className="card-hover"
            style={{
              backgroundColor: colors.white,
              border: `1px solid ${colors.border.light}`,
              borderRadius: '16px',
              padding: spacing.xl,
              boxShadow: 'var(--shadow-elevation-low)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column',
              height: 'fit-content',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-elevation-medium)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = statusColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-elevation-low)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = colors.border.light;
            }}
          >
            {/* Status accent line at top */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: statusColor,
              }}
            />

            {/* Header with name */}
            <div style={{ marginBottom: spacing.md }}>
              <h3 style={{
                margin: 0,
                marginBottom: spacing.xs,
                color: colors.secondary[900],
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                fontFamily: typography.fontFamily.primary,
                lineHeight: '1.3',
                wordBreak: 'break-word',
                letterSpacing: '-0.01em',
              }}>
                {program.name}
              </h3>
              <p style={{
                margin: `${spacing.xs} 0 0`,
                color: colors.gray[500],
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily.body,
                lineHeight: '1.4',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {program.fullName}
              </p>
              {program.hasStateVariation && (
                <div style={{ marginTop: spacing.sm }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: colors.primary[50],
                    color: colors.primary[700],
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                    fontFamily: typography.fontFamily.primary,
                  }}>
                    Full state variation
                  </span>
                </div>
              )}
            </div>

            {/* Notes (if any) - more compact */}
            {program.notes && (
              <p style={{
                margin: `0 0 ${spacing.md}`,
                color: colors.text.secondary,
                fontSize: typography.fontSize.xs,
                fontStyle: 'italic',
                fontFamily: typography.fontFamily.body,
                lineHeight: '1.5',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                padding: spacing.sm,
                backgroundColor: colors.gray[50],
                borderRadius: spacing.radius.sm,
                borderLeft: `3px solid ${colors.gray[200]}`,
              }}
              title={program.notes}>
                {program.notes}
              </p>
            )}

            {/* Status and coverage badges */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: spacing.sm, marginBottom: spacing.md }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  backgroundColor: `${statusColor}15`,
                  color: statusColor,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  fontFamily: typography.fontFamily.primary,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ marginRight: spacing.xs, fontSize: typography.fontSize.base }}>{getStatusIcon(displayStatus)}</span>
                {getStatusLabel(displayStatus)}
              </div>
              {!program.stateImplementations && program.coverage && program.coverage !== 'US' && (
                <div
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    backgroundColor: colors.gray[100],
                    color: colors.secondary[700],
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    fontFamily: typography.fontFamily.primary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {program.coverage}
                </div>
              )}
            </div>

            {/* GitHub links or State options */}
            {showTechnicalLinks && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: spacing.sm,
                paddingTop: spacing.md,
                borderTop: `1px solid ${colors.border.light}`,
                marginTop: 'auto',
              }}>
                {filteredStateImplementations && filteredStateImplementations.length > 0 ? (
                // Show state buttons or state-specific links for programs with state implementations
                <>
                  {!isStateSpecificView ? (
                    // Show state buttons when viewing all states (only non-notStarted)
                    filteredStateImplementations.map((stateImpl) => (
                      <button
                        key={stateImpl.state}
                        style={{
                          flex: '0 0 auto',
                          minWidth: '48px',
                          textAlign: 'center',
                          padding: '6px 10px',
                          backgroundColor: colors.primary[50],
                          color: colors.primary[700],
                          border: `1px solid ${colors.primary[100]}`,
                          borderRadius: '8px',
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.semibold,
                          fontFamily: typography.fontFamily.primary,
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.primary[600];
                          e.currentTarget.style.color = colors.white;
                          e.currentTarget.style.borderColor = colors.primary[600];
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.primary[50];
                          e.currentTarget.style.color = colors.primary[700];
                          e.currentTarget.style.borderColor = colors.primary[100];
                          e.currentTarget.style.transform = 'translateY(0)';
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
                    // Show state-specific GitHub links and flowchart when viewing a specific state
                    <>
                      {(() => {
                        const stateImpl = program.stateImplementations!.find(impl => impl.state === selectedState);
                        if (!stateImpl) return null;
                        return (
                          <>
                            {stateImpl.githubLinks?.parameters && (
                              <a
                                href={stateImpl.githubLinks.parameters}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  flex: 1,
                                  textAlign: 'center',
                                  padding: '8px 12px',
                                  backgroundColor: colors.blue[50],
                                  color: colors.blue[700],
                                  textDecoration: 'none',
                                  borderRadius: '8px',
                                  fontSize: typography.fontSize.xs,
                                  fontWeight: typography.fontWeight.semibold,
                                  fontFamily: typography.fontFamily.primary,
                                  transition: 'all 0.2s ease',
                                  border: `1px solid ${colors.blue[100]}`,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.blue[100];
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.blue[50];
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Parameters
                              </a>
                            )}
                            {stateImpl.githubLinks?.variables && (
                              <a
                                href={stateImpl.githubLinks.variables}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  flex: 1,
                                  textAlign: 'center',
                                  padding: '8px 12px',
                                  backgroundColor: colors.blue[50],
                                  color: colors.blue[700],
                                  textDecoration: 'none',
                                  borderRadius: '8px',
                                  fontSize: typography.fontSize.xs,
                                  fontWeight: typography.fontWeight.semibold,
                                  fontFamily: typography.fontFamily.primary,
                                  transition: 'all 0.2s ease',
                                  border: `1px solid ${colors.blue[100]}`,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.blue[100];
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.blue[50];
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Variables
                              </a>
                            )}
                            {stateImpl.githubLinks?.tests && (
                              <a
                                href={stateImpl.githubLinks.tests}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  flex: 1,
                                  textAlign: 'center',
                                  padding: '8px 12px',
                                  backgroundColor: colors.blue[50],
                                  color: colors.blue[700],
                                  textDecoration: 'none',
                                  borderRadius: '8px',
                                  fontSize: typography.fontSize.xs,
                                  fontWeight: typography.fontWeight.semibold,
                                  fontFamily: typography.fontFamily.primary,
                                  transition: 'all 0.2s ease',
                                  border: `1px solid ${colors.blue[100]}`,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.blue[100];
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.blue[50];
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Tests
                              </a>
                            )}
                            {stateImpl.variable && (
                              <a
                                href={`https://policyengine.github.io/flowchart/?variable=${stateImpl.variable}&country=US`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  flex: '1 1 100%',
                                  textAlign: 'center',
                                  padding: '10px 12px',
                                  background: 'linear-gradient(135deg, #2C7A7B 0%, #319795 100%)',
                                  color: colors.white,
                                  textDecoration: 'none',
                                  borderRadius: '8px',
                                  fontSize: typography.fontSize.sm,
                                  fontWeight: typography.fontWeight.semibold,
                                  fontFamily: typography.fontFamily.primary,
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 122, 123, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Show computation tree
                              </a>
                            )}
                          </>
                        );
                      })()}
                    </>
                  )}
                </>
              ) : (
                // Show regular GitHub links for programs without state implementations
                <>
                  {program.githubLinks.parameters && (
                    <a
                      href={program.githubLinks.parameters}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '8px 12px',
                        backgroundColor: colors.blue[50],
                        color: colors.blue[700],
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        fontFamily: typography.fontFamily.primary,
                        transition: 'all 0.2s ease',
                        border: `1px solid ${colors.blue[100]}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.blue[100];
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.blue[50];
                        e.currentTarget.style.transform = 'translateY(0)';
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
                        flex: 1,
                        textAlign: 'center',
                        padding: '8px 12px',
                        backgroundColor: colors.blue[50],
                        color: colors.blue[700],
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        fontFamily: typography.fontFamily.primary,
                        transition: 'all 0.2s ease',
                        border: `1px solid ${colors.blue[100]}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.blue[100];
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.blue[50];
                        e.currentTarget.style.transform = 'translateY(0)';
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
                        flex: 1,
                        textAlign: 'center',
                        padding: '8px 12px',
                        backgroundColor: colors.blue[50],
                        color: colors.blue[700],
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        fontFamily: typography.fontFamily.primary,
                        transition: 'all 0.2s ease',
                        border: `1px solid ${colors.blue[100]}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.blue[100];
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.blue[50];
                        e.currentTarget.style.transform = 'translateY(0)';
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
                        flex: '1 1 100%',
                        textAlign: 'center',
                        padding: '10px 12px',
                        background: 'linear-gradient(135deg, #2C7A7B 0%, #319795 100%)',
                        color: colors.white,
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.semibold,
                        fontFamily: typography.fontFamily.primary,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 122, 123, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Show computation tree
                    </a>
                  )}
                </>
              )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgramGrid;
