import React, { useState, useMemo } from 'react';
import './App.css';
import FilterBar from './components/FilterBar';
import ProgramCard from './components/ProgramCard';
import ProgramGrid from './components/ProgramGrid';
import MatrixView from './components/MatrixView';
import ExecutiveSummary from './components/ExecutiveSummary';
import { programs, getStatusCount } from './data/programs';
import { CoverageStatus, Program } from './types/Program';
import { colors, typography, spacing } from './designTokens';
import { extractStatesFromPrograms } from './utils/extractStates';

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'federal' | 'state-local';
type DisplayMode = 'overview' | 'developer';

function App() {
  const [selectedStatus, setSelectedStatus] = useState<CoverageStatus | 'all'>('all');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedAgency, setSelectedAgency] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('overview');

  const statusCounts = getStatusCount();
  const availableStates = extractStatesFromPrograms(programs);

  const handleStateSelect = (state: string) => {
    setFilterMode('state-local');
    setSelectedState(state);
  };

  const filteredPrograms = useMemo(() => {
    // If there's a search query, ignore all filters and search everything
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return programs.filter(
        (program) =>
          program.name.toLowerCase().includes(query) ||
          program.fullName.toLowerCase().includes(query) ||
          program.notes?.toLowerCase().includes(query) ||
          program.coverage?.toLowerCase().includes(query)
      );
    }

    let filtered: Program[];

    if (filterMode === 'all') {
      // In "All Programs" mode, show only the original programs
      filtered = [...programs];
    } else {
      // For other modes, create expanded program list with state-specific versions
      let expandedPrograms: Program[] = [];

      programs.forEach(program => {
        if (program.stateImplementations && program.stateImplementations.length > 0) {
          // In federal mode, only add the general/parent program
          if (filterMode === 'federal') {
            expandedPrograms.push(program);
          }
          // In state-local mode, add state-specific versions only (exclude notStarted)
          else if (filterMode === 'state-local') {
            // Add state-specific versions of the program, filtering out notStarted
            program.stateImplementations
              .filter(stateImpl => stateImpl.status !== 'notStarted')
              .forEach(stateImpl => {
                const stateSpecificProgram: Program = {
                  ...program,
                  id: `${program.id}_${stateImpl.state}`,
                  name: stateImpl.name || `${program.name} (${stateImpl.state})`,
                  fullName: stateImpl.fullName || program.fullName,
                  status: stateImpl.status,
                  coverage: stateImpl.state,
                  notes: stateImpl.notes || program.notes,
                  variable: stateImpl.variable || program.variable,
                  githubLinks: stateImpl.githubLinks || program.githubLinks,
                  stateImplementations: undefined,
                };
                expandedPrograms.push(stateSpecificProgram);
              });
          }
        } else {
          // For state-local mode, only add programs that are state/local or state income tax
          if (filterMode === 'state-local') {
            if (program.agency === 'State' || program.agency === 'Local' || program.id === 'state_income_tax') {
              expandedPrograms.push(program);
            }
          } else {
            // For federal mode, add all programs without state implementations
            expandedPrograms.push(program);
          }
        }
      });

      filtered = expandedPrograms;
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((program) => program.status === selectedStatus);
    }

    // Filter by program level (federal vs state/local) - only applies when not in "all" mode
    if (filterMode === 'federal') {
      // Show only federal programs (exclude State and Local agencies)
      filtered = filtered.filter((program) =>
        // Include programs without an agency (e.g., federal taxes) OR programs with federal agencies
        (!program.agency || (program.agency !== 'State' && program.agency !== 'Local'))
      );

      // Further filter by specific federal agency if selected
      if (selectedAgency !== 'All') {
        filtered = filtered.filter(
          (program) =>
            program.agency === selectedAgency ||
            // Include category-based programs when filtering by related agencies
            (selectedAgency === 'IRS' && program.category === 'Taxes') ||
            (selectedAgency === 'DOE' && program.category === 'Energy')
        );
      }
    } else if (filterMode === 'state-local') {
      // Show State and Local programs, plus state-specific versions of federal programs
      filtered = filtered.filter((program) => {
        // For federal programs with state implementations, show only the state-specific versions
        if (program.id.includes('_')) return true; // State-specific versions

        // When "All" states is selected
        if (selectedState === 'All') {
          // Show State Income Taxes as it varies by state
          if (program.id === 'state_income_tax') return true;
          // Don't show other programs without state implementations
          return false;
        }

        // When a specific state is selected, include State and Local agency programs
        if (program.agency === 'State' || program.agency === 'Local') return true;

        // Also include State Income Taxes when a specific state is selected
        if (program.id === 'state_income_tax') return true;

        return false;
      });

      // Further filter by specific state if selected
      if (selectedState !== 'All') {
        filtered = filtered.filter((program) => {
          // For state-specific versions (from stateImplementations), check if it matches the selected state
          // These are identified by not having stateImplementations and having coverage that's a 2-letter state code
          if (!program.stateImplementations && program.coverage && program.coverage.length === 2) {
            // This is a state-specific version like "tanf_CA" or "ssi_state_supplement_CA"
            return program.coverage === selectedState;
          }

          // For regular programs, check coverage
          if (!program.coverage) return false;

          // Check for local county/city programs first
          if (selectedState === 'CA') {
            if (program.coverage.includes('Los Angeles County') ||
                program.coverage.includes('Riverside County') ||
                program.coverage.includes('Alameda County') ||
                program.coverage === 'Los Angeles' ||
                program.coverage === 'Riverside County' ||
                program.coverage.includes('San Francisco')) {
              return true;
            }
          }

          if (selectedState === 'TX' && program.coverage.includes('Dallas County')) {
            return true;
          }

          if (selectedState === 'IL' && program.coverage.includes('Chicago')) {
            return true;
          }

          if (selectedState === 'NY' && program.coverage.includes('New York City')) {
            return true;
          }

          if (selectedState === 'MD' && program.coverage.includes('Montgomery County')) {
            return true;
          }

          // Check if the selected state is in the coverage
          const coverageStates = program.coverage.split(',').map(s => s.trim());

          // Direct state match
          if (coverageStates.includes(selectedState)) return true;

          return false;
        });
      }
    }
    // No additional filtering needed for filterMode === 'all' since we already set filtered to the original programs
    // If filterMode is 'all', show all programs without level filtering

    return filtered;
  }, [selectedStatus, filterMode, selectedAgency, selectedState, searchQuery]);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header
        className="header-accent"
        style={{
          backgroundColor: colors.white,
          boxShadow: 'var(--shadow-elevation-low)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `${spacing.xl} ${spacing['2xl']}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
              <img
                src={`${process.env.PUBLIC_URL}/policyengine.png`}
                alt="PolicyEngine Logo"
                style={{
                  height: '44px',
                  width: 'auto'
                }}
              />
              <div>
                <h1 style={{
                  margin: 0,
                  color: colors.secondary[900],
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  fontFamily: typography.fontFamily.primary,
                  letterSpacing: '-0.02em',
                }}>
                  Coverage Tracker
                </h1>
                <p style={{
                  margin: `2px 0 0`,
                  color: colors.text.secondary,
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily.body,
                }}>
                  PolicyEngine US implementation status
                </p>
              </div>
            </div>

            {/* Navigation tabs in header */}
            <div style={{
              display: 'flex',
              gap: '4px',
              backgroundColor: colors.gray[100],
              padding: '4px',
              borderRadius: '12px',
            }}>
              <button
                onClick={() => setDisplayMode('overview')}
                style={{
                  padding: `${spacing.sm} ${spacing.xl}`,
                  border: 'none',
                  backgroundColor: displayMode === 'overview' ? colors.white : 'transparent',
                  color: displayMode === 'overview' ? colors.primary[700] : colors.text.secondary,
                  borderRadius: '8px',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  cursor: 'pointer',
                  fontFamily: typography.fontFamily.primary,
                  transition: 'all 0.2s ease',
                  boxShadow: displayMode === 'overview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Overview
              </button>
              <button
                onClick={() => setDisplayMode('developer')}
                style={{
                  padding: `${spacing.sm} ${spacing.xl}`,
                  border: 'none',
                  backgroundColor: displayMode === 'developer' ? colors.white : 'transparent',
                  color: displayMode === 'developer' ? colors.primary[700] : colors.text.secondary,
                  borderRadius: '8px',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  cursor: 'pointer',
                  fontFamily: typography.fontFamily.primary,
                  transition: 'all 0.2s ease',
                  boxShadow: displayMode === 'developer' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Program Details
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Executive Summary Section */}
      <div style={{ paddingTop: spacing['2xl'], paddingBottom: spacing.xl }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `0 ${spacing['2xl']}` }}>
          <ExecutiveSummary
            statusCounts={statusCounts}
            totalPrograms={programs.length}
          />
        </div>
      </div>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: `0 ${spacing['2xl']} ${spacing['4xl']}` }}>

        {/* Only show filters in Developer Mode */}
        {displayMode === 'developer' && (
          <FilterBar
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            filterMode={filterMode}
            onFilterModeChange={setFilterMode}
            selectedAgency={selectedAgency}
            onAgencyChange={setSelectedAgency}
            selectedState={selectedState}
            onStateChange={setSelectedState}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusCounts={statusCounts}
            totalPrograms={programs.length}
            availableStates={availableStates}
          />
        )}

        <div>
          {displayMode === 'developer' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: spacing.lg,
              }}
            >
              <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
                {/* View mode toggle */}
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: colors.white,
                    borderRadius: '10px',
                    padding: '3px',
                    boxShadow: 'var(--shadow-elevation-low)',
                    border: `1px solid ${colors.border.light}`,
                  }}
                >
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: `${spacing.sm} ${spacing.md}`,
                      border: 'none',
                      backgroundColor: viewMode === 'grid' ? colors.primary[600] : 'transparent',
                      color: viewMode === 'grid' ? colors.white : colors.text.secondary,
                      borderRadius: '7px',
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1" y="1" width="6" height="6" rx="1" />
                      <rect x="9" y="1" width="6" height="6" rx="1" />
                      <rect x="1" y="9" width="6" height="6" rx="1" />
                      <rect x="9" y="9" width="6" height="6" rx="1" />
                    </svg>
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: `${spacing.sm} ${spacing.md}`,
                      border: 'none',
                      backgroundColor: viewMode === 'list' ? colors.primary[600] : 'transparent',
                      color: viewMode === 'list' ? colors.white : colors.text.secondary,
                      borderRadius: '7px',
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1" y="2" width="14" height="2" rx="1" />
                      <rect x="1" y="7" width="14" height="2" rx="1" />
                      <rect x="1" y="12" width="14" height="2" rx="1" />
                    </svg>
                    List
                  </button>
                </div>

                <a
                  href="https://github.com/PolicyEngine/policyengine-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: `${spacing.sm} ${spacing.lg}`,
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    style={{ marginRight: '8px' }}
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  View on GitHub
                </a>
              </div>
            </div>
          )}

          {filteredPrograms.length === 0 ? (
            <div
              className="animate-fade-in"
              style={{
                backgroundColor: colors.white,
                padding: spacing['4xl'],
                borderRadius: '16px',
                textAlign: 'center',
                color: colors.text.secondary,
                boxShadow: 'var(--shadow-elevation-low)',
                border: `1px solid ${colors.border.light}`,
              }}
            >
              <div style={{ marginBottom: spacing.lg }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.gray[300]} strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <p style={{
                fontSize: typography.fontSize.lg,
                margin: 0,
                fontFamily: typography.fontFamily.body,
                fontWeight: typography.fontWeight.medium,
                color: colors.secondary[900],
              }}>No programs found</p>
              <p style={{
                fontSize: typography.fontSize.sm,
                marginTop: spacing.sm,
                fontFamily: typography.fontFamily.body
              }}>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : displayMode === 'overview' ? (
            // Matrix view for Overview Mode
            <MatrixView programs={programs} />
          ) : (() => {
            // Separate state programs from local programs when in state-local mode with a specific state selected
            const shouldSeparate = filterMode === 'state-local' && selectedState !== 'All';

            if (!shouldSeparate) {
              // Normal rendering without divider
              return viewMode === 'grid' ? (
                <ProgramGrid programs={filteredPrograms} selectedState={selectedState} onStateSelect={handleStateSelect} showTechnicalLinks={displayMode === 'developer'} />
              ) : (
                <div>
                  {filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} selectedState={selectedState} onStateSelect={handleStateSelect} showTechnicalLinks={displayMode === 'developer'} />
                  ))}
                </div>
              );
            }

            // Separate programs into state and local
            const statePrograms = filteredPrograms.filter(program =>
              program.agency === 'State' ||
              (program.coverage && program.coverage.length === 2) || // State-specific versions
              program.id === 'state_income_tax'
            );

            const localPrograms = filteredPrograms.filter(program =>
              program.agency === 'Local' ||
              (program.coverage && program.coverage.includes('County')) ||
              (program.coverage && (program.coverage.includes('Los Angeles') || program.coverage.includes('Chicago')))
            );

            const hasLocalPrograms = localPrograms.length > 0;

            if (!hasLocalPrograms) {
              // No local programs, render normally
              return viewMode === 'grid' ? (
                <ProgramGrid programs={filteredPrograms} selectedState={selectedState} onStateSelect={handleStateSelect} showTechnicalLinks={displayMode === 'developer'} />
              ) : (
                <div>
                  {filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} selectedState={selectedState} onStateSelect={handleStateSelect} showTechnicalLinks={displayMode === 'developer'} />
                  ))}
                </div>
              );
            }

            // Render with divider
            return (
              <div>
                {/* State Programs Section */}
                {statePrograms.length > 0 && (
                  <>
                    <div style={{ marginBottom: spacing.md }}>
                      <h3 style={{
                        margin: 0,
                        color: colors.secondary[900],
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.semibold,
                        fontFamily: typography.fontFamily.primary
                      }}>
                        State Programs ({statePrograms.length})
                      </h3>
                    </div>
                    {viewMode === 'grid' ? (
                      <ProgramGrid programs={statePrograms} selectedState={selectedState} onStateSelect={handleStateSelect} showTechnicalLinks={displayMode === 'developer'} />
                    ) : (
                      <div>
                        {statePrograms.map((program) => (
                          <ProgramCard key={program.id} program={program} selectedState={selectedState} onStateSelect={handleStateSelect} showTechnicalLinks={displayMode === 'developer'} />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Divider */}
                <div style={{
                  margin: `${spacing['3xl']} 0`,
                  padding: `${spacing.lg} 0`,
                  borderTop: `2px solid ${colors.border.light}`,
                }}>
                  <h3 style={{
                    margin: 0,
                    color: colors.secondary[900],
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    fontFamily: typography.fontFamily.primary
                  }}>
                    Local Programs ({localPrograms.length})
                  </h3>
                </div>

                {/* Local Programs Section */}
                {viewMode === 'grid' ? (
                  <ProgramGrid programs={localPrograms} selectedState={selectedState} onStateSelect={handleStateSelect} showTechnicalLinks={displayMode === 'developer'} />
                ) : (
                  <div>
                    {localPrograms.map((program) => (
                      <ProgramCard key={program.id} program={program} selectedState={selectedState} onStateSelect={handleStateSelect} showTechnicalLinks={displayMode === 'developer'} />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: colors.secondary[900],
          color: colors.white,
          padding: `${spacing['2xl']} 0`,
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: `0 ${spacing['2xl']}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: spacing.lg,
        }}>
          <p style={{
            margin: 0,
            fontSize: typography.fontSize.sm,
            fontFamily: typography.fontFamily.body,
            color: colors.gray[400],
          }}>
            © {new Date().getFullYear()} PolicyEngine. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            gap: spacing.xl,
          }}>
            <a
              href="https://policyengine.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: colors.gray[400],
                textDecoration: 'none',
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily.body,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.primary[300]}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.gray[400]}
            >
              PolicyEngine.org
            </a>
            <a
              href="https://github.com/PolicyEngine"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: colors.gray[400],
                textDecoration: 'none',
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily.body,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.primary[300]}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.gray[400]}
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/ThePolicyEngine"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: colors.gray[400],
                textDecoration: 'none',
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily.body,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.primary[300]}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.gray[400]}
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
