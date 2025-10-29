import React, { useMemo } from 'react';
import { Program, CoverageStatus } from '../types/Program';
import { colors, typography, spacing } from '../designTokens';

interface MatrixViewProps {
  programs: Program[];
}

const getStatusIcon = (status: CoverageStatus | null) => {
  if (!status) return '-';
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

const getStatusColor = (status: CoverageStatus | null) => {
  if (!status) return colors.gray[300];
  switch (status) {
    case 'complete':
      return colors.primary[600];
    case 'partial':
      return colors.primary[400];
    case 'inProgress':
      return colors.blue[500];
    case 'notStarted':
      return colors.gray[400];
  }
};

interface MatrixRow {
  name: string;
  category?: string;
  jurisdictions: Map<string, CoverageStatus | null>;
  level: 'federal' | 'state' | 'local';
}

interface MatrixData {
  rows: MatrixRow[];
  jurisdictions: string[];
  federalRows: MatrixRow[];
  stateRows: MatrixRow[];
  localRows: MatrixRow[];
}

const MatrixView: React.FC<MatrixViewProps> = ({ programs }) => {
  const [expandedSections, setExpandedSections] = React.useState({
    federal: true,
    state: true,
    local: true,
  });

  const toggleSection = (section: 'federal' | 'state' | 'local') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const matrixData = useMemo<MatrixData>(() => {
    // All US states + DC
    const allStates = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
      'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
      'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
      'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    const jurisdictions = ['Federal', ...allStates];

    // Programs that apply to all states
    const universalStatePrograms = new Set([
      'snap', 'tanf', 'medicaid', 'wic', 'state_income_tax',
      'social_security', 'ssi', 'medicare', 'eitc', 'ctc', 'federal_income_tax'
    ]);

    // Build matrix rows - using major programs
    const majorPrograms = programs.filter(p =>
      // Include major federal programs
      ['eitc', 'ctc', 'snap', 'tanf', 'ssi', 'social_security', 'medicare', 'medicaid',
       'section_8', 'unemployment_compensation', 'wic', 'lifeline', 'acp',
       'federal_income_tax', 'state_income_tax', 'salt_deduction'].includes(p.id) ||
      // Or programs with state implementations
      (p.stateImplementations && p.stateImplementations.length > 0) ||
      // Or state/local programs
      p.agency === 'State' || p.agency === 'Local'
    );

    const rows = majorPrograms.map(program => {
      const jurisdictionMap = new Map<string, CoverageStatus | null>();

      // Determine program level
      let level: 'federal' | 'state' | 'local' = 'federal';
      if (program.agency === 'Local') {
        level = 'local';
      } else if (program.agency === 'State' || (program.coverage && program.coverage.length === 2 && program.coverage !== 'US')) {
        level = 'state';
      }

      // Federal status
      if (!program.stateImplementations || program.agency !== 'State') {
        if (level === 'federal') {
          jurisdictionMap.set('Federal', program.status);
        } else if (level === 'state' && program.coverage && program.coverage.length === 2) {
          // State-specific program
          jurisdictionMap.set(program.coverage, program.status);
        }
      }

      // For universal programs, mark all states with the program's status
      if (universalStatePrograms.has(program.id)) {
        allStates.forEach(state => {
          jurisdictionMap.set(state, program.status);
        });
      }

      // State statuses from stateImplementations (these will override universal status if present)
      if (program.stateImplementations) {
        program.stateImplementations.forEach(impl => {
          jurisdictionMap.set(impl.state, impl.status);
        });
      }

      return {
        name: program.name,
        category: program.category,
        jurisdictions: jurisdictionMap,
        level,
      };
    });

    // Separate rows by level
    const federalRows = rows.filter(r => r.level === 'federal');
    const stateRows = rows.filter(r => r.level === 'state');
    const localRows = rows.filter(r => r.level === 'local');

    return { rows, jurisdictions, federalRows, stateRows, localRows };
  }, [programs]);

  return (
    <div style={{
      backgroundColor: colors.white,
      borderRadius: spacing.radius.lg,
      boxShadow: spacing.shadow.md,
      border: `1px solid ${colors.border.light}`,
      overflow: 'hidden',
    }}>
      <div style={{
        overflowX: 'auto',
        maxHeight: '70vh',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fontFamily.body,
        }}>
          <thead style={{
            position: 'sticky',
            top: 0,
            zIndex: 3,
          }}>
            <tr>
              <th style={{
                position: 'sticky',
                left: 0,
                backgroundColor: colors.primary[600],
                color: colors.white,
                padding: `${spacing.md} ${spacing.lg}`,
                textAlign: 'left',
                fontWeight: typography.fontWeight.bold,
                fontSize: typography.fontSize.base,
                fontFamily: typography.fontFamily.primary,
                borderRight: `2px solid ${colors.primary[700]}`,
                zIndex: 4,
                minWidth: '220px',
                boxShadow: spacing.shadow.sm,
              }}>
                Program
              </th>
              {matrixData.jurisdictions.map(jurisdiction => (
                <th key={jurisdiction} style={{
                  padding: `${spacing.sm} ${spacing.xs}`,
                  textAlign: 'center',
                  fontWeight: typography.fontWeight.bold,
                  fontSize: typography.fontSize.xs,
                  fontFamily: typography.fontFamily.primary,
                  minWidth: jurisdiction === 'Federal' ? '70px' : '45px',
                  maxWidth: jurisdiction === 'Federal' ? '70px' : '45px',
                  backgroundColor: colors.primary[600],
                  color: colors.white,
                  borderRight: jurisdiction !== matrixData.jurisdictions[matrixData.jurisdictions.length - 1]
                    ? `1px solid ${colors.primary[700]}`
                    : 'none',
                }}>
                  {jurisdiction}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Federal Programs Section */}
            {matrixData.federalRows.length > 0 && (
              <>
                <tr
                  onClick={() => toggleSection('federal')}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{
                    position: 'sticky',
                    left: 0,
                    padding: `${spacing.md} ${spacing.lg}`,
                    fontWeight: typography.fontWeight.bold,
                    fontSize: typography.fontSize.sm,
                    color: colors.white,
                    backgroundColor: colors.primary[700],
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontFamily: typography.fontFamily.primary,
                    zIndex: 2,
                    minWidth: '220px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                      <span style={{
                        fontSize: typography.fontSize.xs,
                        transition: 'transform 0.2s ease',
                        transform: expandedSections.federal ? 'rotate(90deg)' : 'rotate(0deg)',
                        display: 'inline-block',
                      }}>
                        ▸
                      </span>
                      Federal Programs
                    </div>
                  </td>
                  <td colSpan={matrixData.jurisdictions.length} style={{
                    padding: `${spacing.md} ${spacing.lg}`,
                    fontWeight: typography.fontWeight.bold,
                    fontSize: typography.fontSize.sm,
                    color: colors.white,
                    backgroundColor: colors.primary[700],
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontFamily: typography.fontFamily.primary,
                  }}>
                  </td>
                </tr>
                {expandedSections.federal && matrixData.federalRows.map((row, idx) => (
                  <tr key={`federal-${idx}`} style={{
                    backgroundColor: idx % 2 === 0 ? colors.white : colors.background.secondary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary[50];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = idx % 2 === 0 ? colors.white : colors.background.secondary;
                  }}
                  >
                    <td style={{
                      position: 'sticky',
                      left: 0,
                      backgroundColor: idx % 2 === 0 ? colors.white : colors.gray[50],
                      padding: `${spacing.md} ${spacing.lg}`,
                      fontWeight: typography.fontWeight.medium,
                      borderRight: `2px solid ${colors.gray[200]}`,
                      borderBottom: `1px solid ${colors.gray[200]}`,
                      zIndex: 1,
                      boxShadow: spacing.shadow.xs,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = idx % 2 === 0 ? colors.white : colors.gray[50];
                    }}
                    >
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: spacing.xs,
                      }}>
                        <span style={{
                          color: colors.secondary[900],
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                        }}>{row.name}</span>
                      </div>
                    </td>
                    {matrixData.jurisdictions.map(jurisdiction => {
                      const status = row.jurisdictions.get(jurisdiction) || null;
                      return (
                        <td key={jurisdiction} style={{
                          padding: `${spacing.sm} 2px`,
                          textAlign: 'center',
                          borderBottom: `1px solid ${colors.gray[200]}`,
                          borderRight: `1px solid ${colors.gray[100]}`,
                          color: getStatusColor(status),
                          fontSize: typography.fontSize.base,
                          backgroundColor: status ? undefined : colors.gray[50],
                          minWidth: jurisdiction === 'Federal' ? '70px' : '45px',
                          maxWidth: jurisdiction === 'Federal' ? '70px' : '45px',
                        }}>
                          {getStatusIcon(status)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </>
            )}

            {/* State Programs Section */}
            {matrixData.stateRows.length > 0 && (
              <>
                <tr
                  onClick={() => toggleSection('state')}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{
                    position: 'sticky',
                    left: 0,
                    padding: `${spacing.md} ${spacing.lg}`,
                    fontWeight: typography.fontWeight.bold,
                    fontSize: typography.fontSize.sm,
                    color: colors.white,
                    backgroundColor: colors.primary[600],
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontFamily: typography.fontFamily.primary,
                    zIndex: 2,
                    minWidth: '220px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                      <span style={{
                        fontSize: typography.fontSize.xs,
                        transition: 'transform 0.2s ease',
                        transform: expandedSections.state ? 'rotate(90deg)' : 'rotate(0deg)',
                        display: 'inline-block',
                      }}>
                        ▸
                      </span>
                      State Programs
                    </div>
                  </td>
                  <td colSpan={matrixData.jurisdictions.length} style={{
                    padding: `${spacing.md} ${spacing.lg}`,
                    fontWeight: typography.fontWeight.bold,
                    fontSize: typography.fontSize.sm,
                    color: colors.white,
                    backgroundColor: colors.primary[600],
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontFamily: typography.fontFamily.primary,
                  }}>
                  </td>
                </tr>
                {expandedSections.state && matrixData.stateRows.map((row, idx) => (
                  <tr key={`state-${idx}`} style={{
                    backgroundColor: idx % 2 === 0 ? colors.white : colors.background.secondary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary[50];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = idx % 2 === 0 ? colors.white : colors.background.secondary;
                  }}
                  >
                    <td style={{
                      position: 'sticky',
                      left: 0,
                      backgroundColor: idx % 2 === 0 ? colors.white : colors.gray[50],
                      padding: `${spacing.md} ${spacing.lg}`,
                      fontWeight: typography.fontWeight.medium,
                      borderRight: `2px solid ${colors.gray[200]}`,
                      borderBottom: `1px solid ${colors.gray[200]}`,
                      zIndex: 1,
                      boxShadow: spacing.shadow.xs,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = idx % 2 === 0 ? colors.white : colors.gray[50];
                    }}
                    >
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: spacing.xs,
                      }}>
                        <span style={{
                          color: colors.secondary[900],
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                        }}>{row.name}</span>
                      </div>
                    </td>
                    {matrixData.jurisdictions.map(jurisdiction => {
                      const status = row.jurisdictions.get(jurisdiction) || null;
                      return (
                        <td key={jurisdiction} style={{
                          padding: `${spacing.sm} 2px`,
                          textAlign: 'center',
                          borderBottom: `1px solid ${colors.gray[200]}`,
                          borderRight: `1px solid ${colors.gray[100]}`,
                          color: getStatusColor(status),
                          fontSize: typography.fontSize.base,
                          backgroundColor: status ? undefined : colors.gray[50],
                          minWidth: jurisdiction === 'Federal' ? '70px' : '45px',
                          maxWidth: jurisdiction === 'Federal' ? '70px' : '45px',
                        }}>
                          {getStatusIcon(status)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </>
            )}

            {/* Local Programs Section */}
            {matrixData.localRows.length > 0 && (
              <>
                <tr
                  onClick={() => toggleSection('local')}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{
                    position: 'sticky',
                    left: 0,
                    padding: `${spacing.md} ${spacing.lg}`,
                    fontWeight: typography.fontWeight.bold,
                    fontSize: typography.fontSize.sm,
                    color: colors.white,
                    backgroundColor: colors.secondary[700],
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontFamily: typography.fontFamily.primary,
                    zIndex: 2,
                    minWidth: '220px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                      <span style={{
                        fontSize: typography.fontSize.xs,
                        transition: 'transform 0.2s ease',
                        transform: expandedSections.local ? 'rotate(90deg)' : 'rotate(0deg)',
                        display: 'inline-block',
                      }}>
                        ▸
                      </span>
                      Local Programs
                    </div>
                  </td>
                  <td colSpan={matrixData.jurisdictions.length} style={{
                    padding: `${spacing.md} ${spacing.lg}`,
                    fontWeight: typography.fontWeight.bold,
                    fontSize: typography.fontSize.sm,
                    color: colors.white,
                    backgroundColor: colors.secondary[700],
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontFamily: typography.fontFamily.primary,
                  }}>
                  </td>
                </tr>
                {expandedSections.local && matrixData.localRows.map((row, idx) => (
                  <tr key={`local-${idx}`} style={{
                    backgroundColor: idx % 2 === 0 ? colors.white : colors.background.secondary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary[50];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = idx % 2 === 0 ? colors.white : colors.background.secondary;
                  }}
                  >
                    <td style={{
                      position: 'sticky',
                      left: 0,
                      backgroundColor: idx % 2 === 0 ? colors.white : colors.gray[50],
                      padding: `${spacing.md} ${spacing.lg}`,
                      fontWeight: typography.fontWeight.medium,
                      borderRight: `2px solid ${colors.gray[200]}`,
                      borderBottom: `1px solid ${colors.gray[200]}`,
                      zIndex: 1,
                      boxShadow: spacing.shadow.xs,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = idx % 2 === 0 ? colors.white : colors.gray[50];
                    }}
                    >
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: spacing.xs,
                      }}>
                        <span style={{
                          color: colors.secondary[900],
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                        }}>{row.name}</span>
                      </div>
                    </td>
                    {matrixData.jurisdictions.map(jurisdiction => {
                      const status = row.jurisdictions.get(jurisdiction) || null;
                      return (
                        <td key={jurisdiction} style={{
                          padding: `${spacing.sm} 2px`,
                          textAlign: 'center',
                          borderBottom: `1px solid ${colors.gray[200]}`,
                          borderRight: `1px solid ${colors.gray[100]}`,
                          color: getStatusColor(status),
                          fontSize: typography.fontSize.base,
                          backgroundColor: status ? undefined : colors.gray[50],
                          minWidth: jurisdiction === 'Federal' ? '70px' : '45px',
                          maxWidth: jurisdiction === 'Federal' ? '70px' : '45px',
                        }}>
                          {getStatusIcon(status)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{
        padding: spacing.xl,
        backgroundColor: colors.gray[50],
        borderTop: `2px solid ${colors.gray[200]}`,
        display: 'flex',
        gap: spacing['2xl'],
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <div style={{
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.bold,
          color: colors.secondary[900],
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: typography.fontFamily.primary,
        }}>
          Legend:
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <span style={{ fontSize: typography.fontSize.xl, color: colors.primary[600] }}>✓</span>
          <span style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.body,
          }}>Complete</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <span style={{ fontSize: typography.fontSize.xl, color: colors.primary[400] }}>◐</span>
          <span style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.body,
          }}>Partial</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <span style={{ fontSize: typography.fontSize.xl, color: colors.blue[500] }}>⟳</span>
          <span style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.body,
          }}>In Progress</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <span style={{ fontSize: typography.fontSize.xl, color: colors.gray[400] }}>○</span>
          <span style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.body,
          }}>Not Started</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <span style={{ fontSize: typography.fontSize.xl, color: colors.gray[300] }}>-</span>
          <span style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.body,
          }}>Not Applicable</span>
        </div>
      </div>
    </div>
  );
};

export default MatrixView;
