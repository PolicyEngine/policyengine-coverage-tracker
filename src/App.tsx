import React, { useState, useMemo } from 'react';
import './App.css';
import FilterBar from './components/FilterBar';
import ProgramCard from './components/ProgramCard';
import ProgramGrid from './components/ProgramGrid';
import MatrixView from './components/MatrixView';
import ExecutiveSummary from './components/ExecutiveSummary';
import CountrySelector from './components/CountrySelector';
import { getProgramsForCountry, getStatusCountForCountry } from './data/countries';
import { CountryCode, COUNTRIES } from './types/Country';
import { CoverageStatus, Program } from './types/Program';
import { colors, typography, spacing } from './designTokens';
import { extractStatesFromPrograms } from './utils/extractStates';

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'federal' | 'state-local';
type DisplayMode = 'overview' | 'developer';

function App() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('us');
  const [selectedStatus, setSelectedStatus] = useState<CoverageStatus | 'all'>('all');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedAgency, setSelectedAgency] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('overview');

  const programs = getProgramsForCountry(selectedCountry);
  const statusCounts = getStatusCountForCountry(selectedCountry);
  const availableStates = extractStatesFromPrograms(programs);
  const currentCountry = COUNTRIES[selectedCountry];

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
          // In state-local mode, add state-specific versions only
          else if (filterMode === 'state-local') {
            // Add state-specific versions of the program
            program.stateImplementations.forEach(stateImpl => {
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
  }, [programs, selectedStatus, filterMode, selectedAgency, selectedState, searchQuery]);

  return (
    <div style={{ backgroundColor: colors.background.secondary, minHeight: '100vh' }}>
      <header
        style={{
          backgroundColor: colors.white,
          boxShadow: spacing.shadow.sm,
          padding: `${spacing['2xl']} 0`,
          marginBottom: spacing['3xl'],
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `0 ${spacing['2xl']}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xl }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl }}>
              <img
                src={`${process.env.PUBLIC_URL}/policyengine.png`}
                alt="PolicyEngine Logo"
                style={{
                  height: '50px',
                  width: 'auto'
                }}
              />
              <div>
                <h1 style={{
                  margin: 0,
                  color: colors.secondary[900],
                  fontSize: typography.fontSize['4xl'],
                  fontWeight: typography.fontWeight.bold,
                  fontFamily: typography.fontFamily.primary
                }}>
                  PolicyEngine Coverage Tracker
                </h1>
                <p style={{
                  margin: `${spacing.sm} 0 0`,
                  color: colors.text.secondary,
                  fontSize: typography.fontSize.base,
                  fontFamily: typography.fontFamily.body
                }}>
                  Track the implementation status of government programs in PolicyEngine {currentCountry.name}
                </p>
              </div>
            </div>
            <CountrySelector
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />
          </div>
        </div>
      </header>

      {/* Executive Summary Section */}
      <div style={{ backgroundColor: colors.background.secondary, paddingTop: spacing.lg, paddingBottom: spacing['3xl'] }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `0 ${spacing['2xl']}` }}>
          <ExecutiveSummary
            programs={programs}
            statusCounts={statusCounts}
            totalPrograms={programs.length}
          />
        </div>
      </div>

      {/* View Mode Toggle */}
      <div style={{
        backgroundColor: colors.background.secondary,
        paddingBottom: spacing.xl,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: `0 ${spacing['2xl']}`,
        }}>
          <div style={{
            backgroundColor: colors.white,
            borderRadius: spacing.radius.lg,
            boxShadow: spacing.shadow.md,
            border: `1px solid ${colors.border.light}`,
            borderBottom: `2px solid ${colors.gray[200]}`,
            overflow: 'hidden',
            display: 'flex',
            gap: spacing.md,
            padding: `0 ${spacing.lg}`,
          }}>
          <button
            onClick={() => setDisplayMode('overview')}
            style={{
              padding: `${spacing.lg} ${spacing.xl}`,
              border: 'none',
              backgroundColor: 'transparent',
              color: displayMode === 'overview' ? colors.primary[600] : colors.text.secondary,
              borderBottom: displayMode === 'overview' ? `3px solid ${colors.primary[600]}` : '3px solid transparent',
              fontSize: typography.fontSize.base,
              fontWeight: displayMode === 'overview' ? typography.fontWeight.bold : typography.fontWeight.medium,
              cursor: 'pointer',
              fontFamily: typography.fontFamily.primary,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (displayMode !== 'overview') {
                e.currentTarget.style.color = colors.primary[600];
              }
            }}
            onMouseLeave={(e) => {
              if (displayMode !== 'overview') {
                e.currentTarget.style.color = colors.text.secondary;
              }
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setDisplayMode('developer')}
            style={{
              padding: `${spacing.lg} ${spacing.xl}`,
              border: 'none',
              backgroundColor: 'transparent',
              color: displayMode === 'developer' ? colors.primary[600] : colors.text.secondary,
              borderBottom: displayMode === 'developer' ? `3px solid ${colors.primary[600]}` : '3px solid transparent',
              fontSize: typography.fontSize.base,
              fontWeight: displayMode === 'developer' ? typography.fontWeight.bold : typography.fontWeight.medium,
              cursor: 'pointer',
              fontFamily: typography.fontFamily.primary,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (displayMode !== 'developer') {
                e.currentTarget.style.color = colors.primary[600];
              }
            }}
            onMouseLeave={(e) => {
              if (displayMode !== 'developer') {
                e.currentTarget.style.color = colors.text.secondary;
              }
            }}
          >
            Program Details
          </button>
          </div>
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
            country={currentCountry}
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
                    borderRadius: spacing.radius.md,
                    padding: '2px',
                    boxShadow: spacing.shadow.sm,
                  }}
                >
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: `${spacing.sm} ${spacing.md}`,
                      border: 'none',
                      backgroundColor: viewMode === 'grid' ? colors.primary[600] : 'transparent',
                      color: viewMode === 'grid' ? colors.white : colors.text.secondary,
                      borderRadius: spacing.radius.sm,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1" y="1" width="6" height="6" />
                      <rect x="9" y="1" width="6" height="6" />
                      <rect x="1" y="9" width="6" height="6" />
                      <rect x="9" y="9" width="6" height="6" />
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
                      borderRadius: spacing.radius.sm,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1" y="2" width="14" height="2" />
                      <rect x="1" y="7" width="14" height="2" />
                      <rect x="1" y="12" width="14" height="2" />
                    </svg>
                    List
                  </button>
                </div>

                <a
                  href="https://github.com/PolicyEngine/policyengine-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: `${spacing.md} ${spacing.xl}`,
                    backgroundColor: colors.primary[600],
                    color: colors.white,
                    textDecoration: 'none',
                    borderRadius: spacing.radius.md,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary[700];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary[600];
                  }}
                >
                  <svg
                    width="20"
                    height="20"
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
              style={{
                backgroundColor: colors.white,
                padding: spacing['4xl'],
                borderRadius: spacing.radius.lg,
                textAlign: 'center',
                color: colors.text.secondary,
                boxShadow: spacing.shadow.xs,
              }}
            >
              <p style={{
                fontSize: typography.fontSize.lg,
                margin: 0,
                fontFamily: typography.fontFamily.body
              }}>No programs found matching your filters.</p>
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
            <MatrixView programs={programs} country={currentCountry} />
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
                        {currentCountry.regionalLabel} Programs ({statePrograms.length})
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

      <footer
        style={{
          backgroundColor: colors.secondary[900],
          color: colors.white,
          padding: `${spacing['3xl']} 0`,
          marginTop: spacing['5xl'],
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: `0 ${spacing['2xl']}`,
          textAlign: 'center'
        }}>
          <p style={{
            margin: `0 0 ${spacing.sm}`,
            fontSize: typography.fontSize.sm,
            fontFamily: typography.fontFamily.body
          }}>
            © {new Date().getFullYear()} PolicyEngine. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: spacing['2xl'],
            marginTop: spacing.lg
          }}>
            <a
              href="https://policyengine.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: colors.primary[200],
                textDecoration: 'none',
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily.body
              }}
            >
              PolicyEngine.org
            </a>
            <a
              href="https://github.com/PolicyEngine"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: colors.primary[200],
                textDecoration: 'none',
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily.body
              }}
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/ThePolicyEngine"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: colors.primary[200],
                textDecoration: 'none',
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily.body
              }}
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