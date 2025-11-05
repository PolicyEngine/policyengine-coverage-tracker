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
      'medicare', 'eitc', 'ctc',
      'ccdf', 'liheap', 'aca_subsidies',
      'payroll_taxes', 'school_meals', 'csfp', 'chip'
    ]);

    // Build matrix rows - using major programs in specified order
    const programOrder = [
      'federal_income_tax',
      'state_income_tax',
      'payroll_taxes',
      'ira_tax_credits',
      'snap',
      'summer_ebt',
      'wic',
      'school_meals',
      'csfp',
      'tanf',
      'ccdf',
      'liheap',
      'acp',
      'ssi',
      'social_security',
      'ssi_state_supplement',
      'lifeline',
      'medicare',
      'medicaid',
      'chip',
      'aca_subsidies',
      'section_8',
      'pell_grant',
      'head_start',
      'clean_vehicle_credits',
    ];

    const majorPrograms = programs.filter(p =>
      // Include programs in our order list
      programOrder.includes(p.id) ||
      // Or programs with state implementations
      (p.stateImplementations && p.stateImplementations.length > 0) ||
      // Or state/local programs
      p.agency === 'State' || p.agency === 'Local'
    );

    // Sort by the specified order
    majorPrograms.sort((a, b) => {
      const aIndex = programOrder.indexOf(a.id);
      const bIndex = programOrder.indexOf(b.id);

      // If both are in the order list, sort by order
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // If only a is in the order list, it comes first
      if (aIndex !== -1) return -1;
      // If only b is in the order list, it comes first
      if (bIndex !== -1) return 1;
      // Otherwise maintain original order
      return 0;
    });

    const rows = majorPrograms.map(program => {
      const jurisdictionMap = new Map<string, CoverageStatus | null>();

      // Determine program level
      let level: 'federal' | 'state' | 'local' = 'federal';
      if (program.agency === 'Local') {
        level = 'local';
      } else if (program.agency === 'State' || (program.coverage && program.coverage.length === 2 && program.coverage !== 'US')) {
        // State-specific programs (not State Income Tax, which applies to all states)
        level = 'state';
      }
      // State Income Tax applies to all states, so it stays at federal level

      // Special handling for income taxes
      if (program.id === 'federal_income_tax') {
        // Federal income tax only applies at federal level
        jurisdictionMap.set('Federal', program.status);
      } else if (program.id === 'state_income_tax') {
        // State income tax does NOT apply at federal level, only states
        allStates.forEach(state => {
          jurisdictionMap.set(state, program.status);
        });
      } else if (program.id === 'ssi_state_supplement') {
        // SSI State Supplement does NOT apply at federal level, only states with implementations
        // Leave Federal column as null (will show as Not Applicable)
        // Process state implementations
        if (program.stateImplementations) {
          program.stateImplementations.forEach(impl => {
            jurisdictionMap.set(impl.state, impl.status);
          });
        }
      } else {
        // Federal status for other programs
        if (!program.stateImplementations || program.agency !== 'State') {
          if (level === 'federal') {
            jurisdictionMap.set('Federal', program.status);
          } else if (level === 'state' && program.coverage && program.coverage.length === 2) {
            // State-specific program
            jurisdictionMap.set(program.coverage, program.status);
          } else if (level === 'local' && program.coverage) {
            // Local program - map to appropriate state column
            // Extract state from coverage string
            let stateCode = null;
            if (program.coverage.includes('California') || program.coverage.includes('Los Angeles') ||
                program.coverage.includes('Riverside') || program.coverage.includes('Alameda') ||
                program.coverage.includes('San Francisco')) {
              stateCode = 'CA';
            } else if (program.coverage.includes('New York')) {
              stateCode = 'NY';
            } else if (program.coverage.includes('Texas') || program.coverage.includes('Dallas')) {
              stateCode = 'TX';
            } else if (program.coverage.includes('Illinois') || program.coverage.includes('Chicago')) {
              stateCode = 'IL';
            } else if (program.coverage.includes('Maryland') || program.coverage.includes('Montgomery County, MD')) {
              stateCode = 'MD';
            } else if (program.coverage.includes('DC') || program.coverage === 'DC') {
              stateCode = 'DC';
            }

            if (stateCode) {
              jurisdictionMap.set(stateCode, program.status);
            }
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

    // Sort state and local rows by their applicable jurisdiction
    const sortByJurisdiction = (a: MatrixRow, b: MatrixRow) => {
      const aJurisdiction = Array.from(a.jurisdictions.entries()).find(([_, status]) => status !== null)?.[0] || '';
      const bJurisdiction = Array.from(b.jurisdictions.entries()).find(([_, status]) => status !== null)?.[0] || '';
      return aJurisdiction.localeCompare(bJurisdiction);
    };

    stateRows.sort(sortByJurisdiction);
    localRows.sort(sortByJurisdiction);

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
      {/* Legend - Sticky at top */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: `${spacing.sm} ${spacing.md}`,
        backgroundColor: colors.white,
        borderBottom: `1px solid ${colors.gray[200]}`,
        display: 'flex',
        gap: spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          fontSize: '10px',
          fontWeight: typography.fontWeight.bold,
          color: colors.secondary[900],
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: typography.fontFamily.primary,
        }}>
          Legend:
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <span style={{ fontSize: typography.fontSize.base, color: colors.primary[600] }}>✓</span>
          <span style={{
            fontSize: typography.fontSize.xs,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.body,
          }}>Complete</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <span style={{ fontSize: typography.fontSize.base, color: colors.primary[400] }}>◐</span>
          <span style={{
            fontSize: typography.fontSize.xs,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.body,
          }}>Partial</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <span style={{ fontSize: typography.fontSize.base, color: colors.blue[500] }}>⟳</span>
          <span style={{
            fontSize: typography.fontSize.xs,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.body,
          }}>In Progress</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <span style={{ fontSize: typography.fontSize.base, color: colors.gray[400] }}>○</span>
          <span style={{
            fontSize: typography.fontSize.xs,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.body,
          }}>Not Started</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <span style={{ fontSize: typography.fontSize.base, color: colors.gray[300] }}>-</span>
          <span style={{
            fontSize: typography.fontSize.xs,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.body,
          }}>Not Applicable</span>
        </div>
      </div>

      {/* Federal Programs Section with horizontal scroll */}
      {matrixData.federalRows.length > 0 && (
        <div style={{
          overflowX: 'auto',
          maxHeight: '50vh',
          overflowY: 'auto',
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
            </tbody>
          </table>
        </div>
      )}

      {/* State and Local Programs - No horizontal scroll */}
      <div style={{
        maxHeight: '50vh',
        overflowY: 'auto',
      }}>
        {/* State Programs Section - Compact List */}
        {matrixData.stateRows.length > 0 && (
          <div>
            <div
              onClick={() => toggleSection('state')}
              style={{
                cursor: 'pointer',
                padding: `${spacing.md} ${spacing.lg}`,
                fontWeight: typography.fontWeight.bold,
                fontSize: typography.fontSize.sm,
                color: colors.white,
                backgroundColor: colors.primary[600],
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontFamily: typography.fontFamily.primary,
                borderTop: `2px solid ${colors.gray[300]}`,
              }}
            >
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
            </div>
            {expandedSections.state && (
              <div style={{
                padding: spacing.lg,
                backgroundColor: colors.white,
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: spacing.md,
                }}>
                  {matrixData.stateRows.map((row, idx) => {
                    // Get the state/jurisdiction this program applies to
                    const applicableJurisdiction = Array.from(row.jurisdictions.entries()).find(([_, status]) => status !== null)?.[0] || '';
                    const status = row.jurisdictions.get(applicableJurisdiction) || null;

                    return (
                      <div
                        key={`state-${idx}`}
                        style={{
                          padding: spacing.md,
                          backgroundColor: colors.gray[50],
                          borderRadius: spacing.radius.md,
                          border: `1px solid ${colors.gray[200]}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.primary[50];
                          e.currentTarget.style.borderColor = colors.primary[300];
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.gray[50];
                          e.currentTarget.style.borderColor = colors.gray[200];
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, flex: 1 }}>
                          <span style={{
                            color: colors.secondary[900],
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.semibold,
                          }}>{row.name}</span>
                          <span style={{
                            color: colors.text.secondary,
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.medium,
                          }}>{applicableJurisdiction}</span>
                        </div>
                        <div style={{
                          fontSize: typography.fontSize.xl,
                          color: getStatusColor(status),
                          marginLeft: spacing.md,
                        }}>
                          {getStatusIcon(status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Local Programs Section - Compact List */}
        {matrixData.localRows.length > 0 && (
          <div>
            <div
              onClick={() => toggleSection('local')}
              style={{
                cursor: 'pointer',
                padding: `${spacing.md} ${spacing.lg}`,
                fontWeight: typography.fontWeight.bold,
                fontSize: typography.fontSize.sm,
                color: colors.white,
                backgroundColor: colors.secondary[700],
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontFamily: typography.fontFamily.primary,
                borderTop: `2px solid ${colors.gray[300]}`,
              }}
            >
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
            </div>
            {expandedSections.local && (
              <div style={{
                padding: spacing.lg,
                backgroundColor: colors.white,
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: spacing.md,
                }}>
                  {matrixData.localRows.map((row, idx) => {
                    // Get the state/jurisdiction this program applies to
                    const applicableJurisdiction = Array.from(row.jurisdictions.entries()).find(([_, status]) => status !== null)?.[0] || '';
                    const status = row.jurisdictions.get(applicableJurisdiction) || null;

                    return (
                      <div
                        key={`local-${idx}`}
                        style={{
                          padding: spacing.md,
                          backgroundColor: colors.gray[50],
                          borderRadius: spacing.radius.md,
                          border: `1px solid ${colors.gray[200]}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.primary[50];
                          e.currentTarget.style.borderColor = colors.primary[300];
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.gray[50];
                          e.currentTarget.style.borderColor = colors.gray[200];
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, flex: 1 }}>
                          <span style={{
                            color: colors.secondary[900],
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.semibold,
                          }}>{row.name}</span>
                          <span style={{
                            color: colors.text.secondary,
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.medium,
                          }}>{applicableJurisdiction}</span>
                        </div>
                        <div style={{
                          fontSize: typography.fontSize.xl,
                          color: getStatusColor(status),
                          marginLeft: spacing.md,
                        }}>
                          {getStatusIcon(status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatrixView;
