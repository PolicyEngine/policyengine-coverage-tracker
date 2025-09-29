import React from 'react';
import { Program, CoverageStatus } from '../types/Program';
import { statusColors, colors } from '../constants/colors';

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
              backgroundColor: colors.WHITE,
              border: `1px solid ${colors.LIGHT_GRAY}`,
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
              e.currentTarget.style.borderColor = colors.LIGHT_GRAY;
            }}
          >
            {/* Header with name and status */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{
                  margin: 0,
                  color: colors.DARKEST_BLUE,
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: '1.2',
                  flex: 1,
                  marginRight: '8px'
                }}>
                  {program.name}
                </h3>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {!program.stateImplementations && program.coverage && program.coverage !== 'US' && (
                    <div
                      style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        backgroundColor: colors.LIGHT_GRAY,
                        color: colors.DARKEST_BLUE,
                        fontSize: '12px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {program.coverage}
                    </div>
                  )}
                  {program.hasStateVariation && (
                    <div
                      style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        backgroundColor: colors.TEAL_LIGHT,
                        color: colors.TEAL_PRESSED,
                        fontSize: '12px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Full state variation
                    </div>
                  )}
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
                </div>
              </div>
              <p style={{
                margin: '6px 0 0',
                color: colors.GRAY,
                fontSize: '13px',
                lineHeight: '1.4',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {program.fullName}
              </p>
            </div>

            {/* Notes (if any) - more compact */}
            {program.notes && (
              <p style={{
                margin: '0 0 12px',
                color: colors.DARK_GRAY,
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

            {/* GitHub links or State options */}
            <div style={{
              display: 'flex',
              gap: '8px',
              paddingTop: '12px',
              borderTop: `1px solid ${colors.LIGHT_GRAY}`,
            }}>
              {program.stateImplementations && program.stateImplementations.length > 0 ? (
                // Show state buttons for programs with state implementations
                program.stateImplementations.map((stateImpl) => (
                  <button
                    key={stateImpl.state}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '6px',
                      backgroundColor: colors.TEAL_LIGHT,
                      color: colors.TEAL_PRESSED,
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 500,
                      transition: 'background-color 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.TEAL_ACCENT;
                      e.currentTarget.style.color = colors.WHITE;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.TEAL_LIGHT;
                      e.currentTarget.style.color = colors.TEAL_PRESSED;
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
                        flex: 1,
                        textAlign: 'center',
                        padding: '6px',
                        backgroundColor: colors.BLUE_98,
                        color: colors.BLUE_PRIMARY,
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.BLUE_95;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.BLUE_98;
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
                        backgroundColor: colors.BLUE_98,
                        color: colors.BLUE_PRIMARY,
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.BLUE_95;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.BLUE_98;
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
                        backgroundColor: colors.BLUE_98,
                        color: colors.BLUE_PRIMARY,
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.BLUE_95;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.BLUE_98;
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Tests
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