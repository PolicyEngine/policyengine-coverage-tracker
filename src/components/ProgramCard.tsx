import React from 'react';
import { Program, CoverageStatus } from '../types/Program';
import { statusColors, colors } from '../constants/colors';

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
      style={{
        backgroundColor: colors.WHITE,
        border: `1px solid ${colors.LIGHT_GRAY}`,
        borderRadius: '4px',
        padding: '8px 12px',
        marginBottom: '4px',
        transition: 'all 0.1s ease',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.BLUE_98;
        e.currentTarget.style.borderColor = statusColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.WHITE;
        e.currentTarget.style.borderColor = colors.LIGHT_GRAY;
      }}
    >
      {/* Left section - Program info */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '10px', color: statusColor }}>{getStatusIcon(displayStatus)}</span>
            <h3 style={{
              margin: 0,
              color: colors.DARKEST_BLUE,
              fontSize: '14px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {program.name}
            </h3>
            {program.stateImplementations && program.coverage && program.coverage !== 'US' && (
              <span style={{
                color: colors.GRAY,
                fontSize: '11px',
                backgroundColor: colors.LIGHT_GRAY,
                padding: '2px 4px',
                borderRadius: '2px',
                whiteSpace: 'nowrap'
              }}>
                {program.coverage}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right section - Links or State options */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {program.stateImplementations && program.stateImplementations.length > 0 ? (
          // Show state buttons for programs with state implementations
          program.stateImplementations.map((stateImpl) => (
            <button
              key={stateImpl.state}
              style={{
                padding: '2px 6px',
                backgroundColor: colors.TEAL_LIGHT,
                color: colors.TEAL_PRESSED,
                border: 'none',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: 500,
                transition: 'background-color 0.1s',
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
                  padding: '2px 6px',
                  backgroundColor: colors.BLUE_98,
                  color: colors.BLUE_PRIMARY,
                  textDecoration: 'none',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 500,
                  transition: 'background-color 0.1s',
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
                  padding: '2px 6px',
                  backgroundColor: colors.BLUE_98,
                  color: colors.BLUE_PRIMARY,
                  textDecoration: 'none',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 500,
                  transition: 'background-color 0.1s',
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
                  padding: '2px 6px',
                  backgroundColor: colors.BLUE_98,
                  color: colors.BLUE_PRIMARY,
                  textDecoration: 'none',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 500,
                  transition: 'background-color 0.1s',
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
};

export default ProgramCard;