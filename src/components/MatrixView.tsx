import React, { useMemo } from 'react';
import { Program, CoverageStatus } from '../types/Program';
import { colors, typography, spacing } from '../designTokens';

interface MatrixViewProps {
  programs: Program[];
}

const getStatusIcon = (status: CoverageStatus | null) => {
  if (!status) return '';
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

const getCellBackground = (status: CoverageStatus | null) => {
  if (!status) {
    // Single diagonal line going all the way through, descending
    return `linear-gradient(-45deg, transparent calc(50% - 0.5px), ${colors.gray[300]} calc(50% - 0.5px), ${colors.gray[300]} calc(50% + 0.5px), transparent calc(50% + 0.5px))`;
  }
  return undefined;
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
  const [selectedState, setSelectedState] = React.useState<string | null>(null);

  const toggleSection = (section: 'federal' | 'state' | 'local') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleStateClick = (state: string) => {
    setSelectedState(prev => prev === state ? null : state);
  };

  // Helper function to render program columns grouped by state
  const renderProgramColumns = (rows: MatrixRow[], headerColor: string, keyPrefix: string) => {
    const programsByState = new Map<string, MatrixRow[]>();
    rows.forEach(row => {
      const state = Array.from(row.jurisdictions.entries()).find(([_, status]) => status !== null)?.[0] || '';
      if (!programsByState.has(state)) {
        programsByState.set(state, []);
      }
      programsByState.get(state)?.push(row);
    });

    return Array.from(programsByState.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([state, statePrograms]) => {
      // Adjust width based on number of programs
      const programCount = statePrograms.length;
      const minWidth = programCount <= 2 ? '180px' : programCount <= 4 ? '220px' : '260px';

      return (
        <div
          key={`${keyPrefix}-col-${state}`}
          style={{
            minWidth: minWidth,
            flex: programCount <= 2 ? '0 0 auto' : '1 1 auto',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-elevation-low)',
            border: `1px solid ${colors.border.light}`,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-elevation-medium)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-elevation-low)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            backgroundColor: headerColor,
            color: colors.white,
            padding: `${spacing.sm} ${spacing.md}`,
            fontWeight: typography.fontWeight.bold,
            fontSize: typography.fontSize.sm,
            textAlign: 'center',
            fontFamily: typography.fontFamily.primary,
            letterSpacing: '0.5px',
          }}>
            {state}
          </div>
          <div style={{
            backgroundColor: colors.white,
          }}>
            {statePrograms.map((row, idx) => {
              const status = row.jurisdictions.get(state) || null;
              const statusColor = getStatusColor(status);
              return (
                <div
                  key={`${keyPrefix}-${state}-prog-${idx}`}
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderBottom: idx < statePrograms.length - 1 ? `1px solid ${colors.gray[100]}` : 'none',
                    backgroundColor: colors.white,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: spacing.sm,
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.white;
                  }}
                >
                  <span style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.secondary[900],
                    fontWeight: typography.fontWeight.medium,
                    flex: 1,
                  }}>
                    {row.name}
                  </span>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: `${statusColor}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{
                      fontSize: typography.fontSize.sm,
                      color: statusColor,
                    }}>
                      {getStatusIcon(status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
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
      'aca_subsidies',
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
      } else if (program.id === 'ccdf' || program.id === 'liheap') {
        // CCDF and LIHEAP apply at federal level
        jurisdictionMap.set('Federal', program.status);
        // Set all states as notStarted by default
        allStates.forEach(state => {
          jurisdictionMap.set(state, 'notStarted');
        });
        // Override with actual state implementation statuses
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
            } else if (program.coverage.includes('Texas') || program.coverage.includes('Dallas') || program.coverage.includes('Harris')) {
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
    <div
      className="animate-fade-in-up"
      style={{
        backgroundColor: colors.white,
        borderRadius: '16px',
        boxShadow: 'var(--shadow-elevation-low)',
        border: `1px solid ${colors.border.light}`,
        overflow: 'hidden',
      }}
    >
      {/* Legend - Sticky at top */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: `${spacing.md} ${spacing.lg}`,
        backgroundColor: colors.white,
        borderBottom: `1px solid ${colors.gray[200]}`,
        display: 'flex',
        gap: spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: `${colors.primary[600]}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.primary[600] }}>✓</span>
          </div>
          <span style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.primary,
          }}>Complete</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: `${colors.primary[400]}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.primary[400] }}>◐</span>
          </div>
          <span style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.primary,
          }}>Partial</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: `${colors.blue[500]}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span className="status-in-progress" style={{ fontSize: typography.fontSize.sm, color: colors.blue[500] }}>⟳</span>
          </div>
          <span style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.primary,
          }}>In Progress</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: colors.gray[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.gray[400] }}>○</span>
          </div>
          <span style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.primary,
          }}>Not Started</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: `linear-gradient(-45deg, transparent calc(50% - 0.5px), ${colors.gray[300]} calc(50% - 0.5px), ${colors.gray[300]} calc(50% + 0.5px), transparent calc(50% + 0.5px))`,
            border: `1px solid ${colors.gray[200]}`,
          }} />
          <span style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.primary,
          }}>Not Applicable</span>
        </div>
      </div>

      {/* Federal Programs Section with horizontal scroll */}
      {matrixData.federalRows.length > 0 && (
        <div style={{
          overflowX: 'auto',
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
                {matrixData.jurisdictions.map(jurisdiction => {
                  const isSelected = selectedState === jurisdiction;
                  const isClickable = jurisdiction !== 'Federal';
                  return (
                  <th
                    key={jurisdiction}
                    onClick={() => isClickable && handleStateClick(jurisdiction)}
                    style={{
                      padding: `${spacing.sm} ${spacing.xs}`,
                      textAlign: 'center',
                      fontWeight: typography.fontWeight.bold,
                      fontSize: typography.fontSize.xs,
                      fontFamily: typography.fontFamily.primary,
                      minWidth: jurisdiction === 'Federal' ? '70px' : '45px',
                      maxWidth: jurisdiction === 'Federal' ? '70px' : '45px',
                      backgroundColor: isSelected ? colors.secondary[900] : colors.primary[600],
                      color: colors.white,
                      borderRight: jurisdiction !== matrixData.jurisdictions[matrixData.jurisdictions.length - 1]
                        ? `1px solid ${colors.primary[700]}`
                        : 'none',
                      cursor: isClickable ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      boxShadow: isSelected ? 'inset 0 -3px 0 0 #38B2AC' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (isClickable && !isSelected) {
                        e.currentTarget.style.backgroundColor = colors.primary[700];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isClickable && !isSelected) {
                        e.currentTarget.style.backgroundColor = colors.primary[600];
                      }
                    }}
                  >
                    {jurisdiction}
                  </th>
                  );
                })}
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
              {expandedSections.federal && matrixData.federalRows.map((row, idx) => {
                // Only highlight row if selected state has this program as COMPLETE
                const selectedStateStatus = selectedState ? row.jurisdictions.get(selectedState) : null;
                const isRowHighlighted = selectedState && selectedStateStatus === 'complete';
                const baseBackground = idx % 2 === 0 ? colors.white : colors.background.secondary;
                const highlightedBackground = '#E6FFFA'; // Light teal for highlighted rows
                return (
                <tr key={`federal-${idx}`} style={{
                  backgroundColor: isRowHighlighted ? highlightedBackground : baseBackground,
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isRowHighlighted) {
                    e.currentTarget.style.backgroundColor = colors.gray[50];
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isRowHighlighted ? highlightedBackground : baseBackground;
                }}
                >
                  <td style={{
                    position: 'sticky',
                    left: 0,
                    backgroundColor: isRowHighlighted ? highlightedBackground : baseBackground,
                    padding: `${spacing.md} ${spacing.lg}`,
                    fontWeight: typography.fontWeight.medium,
                    borderRight: `2px solid ${colors.gray[200]}`,
                    borderBottom: `1px solid ${colors.gray[100]}`,
                    zIndex: 2,
                    boxShadow: '4px 0 8px rgba(0,0,0,0.08)',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isRowHighlighted) {
                      e.currentTarget.style.backgroundColor = colors.gray[50];
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isRowHighlighted ? highlightedBackground : baseBackground;
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
                    const isColumnSelected = selectedState === jurisdiction;
                    const isCellComplete = status === 'complete';
                    let cellBackground = getCellBackground(status);
                    if (!cellBackground && !status) {
                      cellBackground = colors.gray[50];
                    }
                    // Only highlight the cell if column is selected AND cell is complete
                    if (isColumnSelected && isCellComplete) {
                      cellBackground = '#B2F5EA'; // Stronger teal for complete cells in selected column
                    }
                    return (
                      <td key={jurisdiction} style={{
                        padding: `${spacing.sm} 2px`,
                        textAlign: 'center',
                        borderBottom: `1px solid ${colors.gray[100]}`,
                        borderRight: `1px solid ${colors.gray[100]}`,
                        color: getStatusColor(status),
                        fontSize: typography.fontSize.base,
                        background: cellBackground,
                        minWidth: jurisdiction === 'Federal' ? '70px' : '45px',
                        maxWidth: jurisdiction === 'Federal' ? '70px' : '45px',
                        transition: 'all 0.2s ease',
                      }}>
                        {getStatusIcon(status)}
                      </td>
                    );
                  })}
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* State Programs Section - Compact List with independent scroll */}
      {matrixData.stateRows.length > 0 && (
        <div style={{
          maxHeight: '50vh',
          overflowY: 'auto',
          position: 'relative',
        }}>
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
                borderTop: `1px solid ${colors.gray[200]}`,
                transition: 'background-color 0.2s ease',
                position: 'sticky',
                top: 0,
                zIndex: 5,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary[700];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary[600];
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
                <span style={{
                  marginLeft: 'auto',
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}>
                  {matrixData.stateRows.length}
                </span>
              </div>
            </div>
            {expandedSections.state && (
              <div style={{
                padding: spacing.lg,
                backgroundColor: colors.background.secondary,
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: spacing.lg,
                }}>
                  {renderProgramColumns(matrixData.stateRows, colors.primary[600], 'state')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Local Programs Section - Compact List with independent scroll */}
      {matrixData.localRows.length > 0 && (
        <div style={{
          maxHeight: '50vh',
          overflowY: 'auto',
          position: 'relative',
        }}>
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
                borderTop: `1px solid ${colors.gray[200]}`,
                transition: 'background-color 0.2s ease',
                position: 'sticky',
                top: 0,
                zIndex: 5,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.secondary[800];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.secondary[700];
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
                <span style={{
                  marginLeft: 'auto',
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}>
                  {matrixData.localRows.length}
                </span>
              </div>
            </div>
            {expandedSections.local && (
              <div style={{
                padding: spacing.lg,
                backgroundColor: colors.background.secondary,
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: spacing.lg,
                }}>
                  {renderProgramColumns(matrixData.localRows, colors.secondary[700], 'local')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatrixView;
