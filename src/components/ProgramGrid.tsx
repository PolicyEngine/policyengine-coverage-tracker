import React from 'react';
import { Program, CoverageStatus } from '../types/Program';
import { statusColors, colors } from '../designTokens';

interface ProgramGridProps {
  programs: Program[];
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

const ProgramGrid: React.FC<ProgramGridProps> = ({ programs, selectedState, onStateSelect }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px',
        rowGap: '28px',
        marginTop: '24px',
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

        return (
          <div
            key={program.id}
            style={{
              backgroundColor: colors.white,
              border: `1px solid ${colors.border.light}`,
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              height: 'fit-content',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = statusColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = colors.border.light;
            }}
          >
            {/* Header with name */}
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{
                margin: 0,
                marginBottom: '8px',
                color: colors.secondary[900],
                fontSize: '18px',
                fontWeight: 600,
                lineHeight: '1.3',
                wordBreak: 'break-word',
              }}>
                {program.name}
              </h3>
              <p style={{
                margin: '6px 0 0',
                color: colors.gray[500],
                fontSize: '13px',
                lineHeight: '1.4',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {program.fullName}
              </p>
              {program.hasStateVariation && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    backgroundColor: colors.primary[50],
                    color: colors.primary[700],
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>
                    Full state variation
                  </span>
                </div>
              )}
            </div>

            {/* Notes (if any) - more compact */}
            {program.notes && (
              <p style={{
                margin: '0 0 12px',
                color: colors.text.secondary,
                fontSize: '11px',
                fontStyle: 'italic',
                lineHeight: '1.4',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
              title={program.notes}>
                {program.notes}
              </p>
            )}

            {/* Status and coverage badges */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '6px', marginBottom: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: `${statusColor}20`,
                  color: statusColor,
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ marginRight: '4px', fontSize: '14px' }}>{getStatusIcon(displayStatus)}</span>
                {getStatusLabel(displayStatus)}
              </div>
              {!program.stateImplementations && program.coverage && program.coverage !== 'US' && (
                <div
                  style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    backgroundColor: colors.border.light,
                    color: colors.secondary[900],
                    fontSize: '12px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {program.coverage}
                </div>
              )}
            </div>

            {/* GitHub links or State options */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              paddingTop: '12px',
              borderTop: `1px solid ${colors.border.light}`,
            }}>
              {program.stateImplementations && program.stateImplementations.length > 0 ? (
                // Show state buttons or state-specific links for programs with state implementations
                <>
                  {!isStateSpecificView ? (
                    // Show state buttons when viewing all states
                    program.stateImplementations.map((stateImpl) => (
                      <button
                        key={stateImpl.state}
                        style={{
                          flex: '0 0 auto',
                          minWidth: '60px',
                          textAlign: 'center',
                          padding: '6px',
                          backgroundColor: colors.primary[50],
                          color: colors.primary[700],
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 500,
                          transition: 'background-color 0.2s',
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
                                  padding: '6px',
                                  backgroundColor: colors.blue[50],
                                  color: colors.blue[700],
                                  textDecoration: 'none',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  transition: 'background-color 0.2s',
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
                            {stateImpl.githubLinks?.variables && (
                              <a
                                href={stateImpl.githubLinks.variables}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  flex: 1,
                                  textAlign: 'center',
                                  padding: '6px',
                                  backgroundColor: colors.blue[50],
                                  color: colors.blue[700],
                                  textDecoration: 'none',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  transition: 'background-color 0.2s',
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
                            {stateImpl.githubLinks?.tests && (
                              <a
                                href={stateImpl.githubLinks.tests}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  flex: 1,
                                  textAlign: 'center',
                                  padding: '6px',
                                  backgroundColor: colors.blue[50],
                                  color: colors.blue[700],
                                  textDecoration: 'none',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  transition: 'background-color 0.2s',
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
                            {stateImpl.variable && (
                              <a
                                href={`https://policyengine.github.io/flowchart/?variable=${stateImpl.variable}&country=US`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  flex: '1 1 100%',
                                  textAlign: 'center',
                                  padding: '6px',
                                  backgroundColor: colors.primary[50],
                                  color: colors.primary[700],
                                  textDecoration: 'none',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  transition: 'background-color 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.primary[400];
                                  e.currentTarget.style.color = colors.white;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = colors.primary[50];
                                  e.currentTarget.style.color = colors.primary[700];
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
                        padding: '6px',
                        backgroundColor: colors.blue[50],
                        color: colors.blue[700],
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        transition: 'background-color 0.2s',
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
                        flex: 1,
                        textAlign: 'center',
                        padding: '6px',
                        backgroundColor: colors.blue[50],
                        color: colors.blue[700],
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        transition: 'background-color 0.2s',
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
                        flex: 1,
                        textAlign: 'center',
                        padding: '6px',
                        backgroundColor: colors.blue[50],
                        color: colors.blue[700],
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        transition: 'background-color 0.2s',
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
                        flex: '1 1 100%',
                        textAlign: 'center',
                        padding: '6px',
                        backgroundColor: colors.primary[50],
                        color: colors.primary[700],
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.primary[400];
                        e.currentTarget.style.color = colors.white;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.primary[50];
                        e.currentTarget.style.color = colors.primary[700];
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Show computation tree
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgramGrid;