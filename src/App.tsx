import React, { useState, useMemo } from 'react';
import './App.css';
import FilterBar from './components/FilterBar';
import ProgramCard from './components/ProgramCard';
import ProgramGrid from './components/ProgramGrid';
import StatsOverview from './components/StatsOverview';
import { programs, getStatusCount } from './data/programs';
import { CoverageStatus, Program } from './types/Program';
import { colors } from './constants/colors';
import { extractStatesFromPrograms } from './utils/extractStates';

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'federal' | 'state-local';

function App() {
  const [selectedStatus, setSelectedStatus] = useState<CoverageStatus | 'all'>('all');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedAgency, setSelectedAgency] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

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
          // Only add the general program if NOT in state-local mode
          if (filterMode !== 'state-local') {
            expandedPrograms.push(program);
          }

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
              githubLinks: stateImpl.githubLinks || program.githubLinks,
              stateImplementations: undefined,
            };
            expandedPrograms.push(stateSpecificProgram);
          });
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
      // Show only federal agency programs (exclude State and Local) and only general cards (not state-specific)
      filtered = filtered.filter((program) =>
        program.agency && program.agency !== 'State' && program.agency !== 'Local' &&
        !program.id.includes('_') // Exclude state-specific versions
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

          // Check for local county programs first
          if (selectedState === 'CA') {
            if (program.coverage.includes('Los Angeles County') ||
                program.coverage.includes('Riverside County') ||
                program.coverage.includes('Alameda County') ||
                program.coverage === 'Los Angeles' ||
                program.coverage === 'Riverside County') {
              return true;
            }
          }

          if (selectedState === 'TX' && program.coverage.includes('Dallas County')) {
            return true;
          }

          if (selectedState === 'IL' && program.coverage.includes('Chicago')) {
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
    <div style={{ backgroundColor: colors.BLUE_98, minHeight: '100vh' }}>
      <header
        style={{
          backgroundColor: colors.WHITE,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          padding: '24px 0',
          marginBottom: '32px',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img
              src={`${process.env.PUBLIC_URL}/policyengine.png`}
              alt="PolicyEngine Logo"
              style={{
                height: '50px',
                width: 'auto'
              }}
            />
            <div>
              <h1 style={{ margin: 0, color: colors.DARKEST_BLUE, fontSize: '32px', fontWeight: 700 }}>
                PolicyEngine Coverage Tracker
              </h1>
              <p style={{ margin: '8px 0 0', color: colors.DARK_GRAY, fontSize: '16px' }}>
                Track the implementation status of government programs in PolicyEngine US
              </p>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 48px' }}>
        <StatsOverview statusCounts={statusCounts} totalPrograms={programs.length} />

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

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h2 style={{ margin: 0, color: colors.DARKEST_BLUE, fontSize: '24px' }}>
              Programs ({filteredPrograms.length})
            </h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* View mode toggle */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: colors.WHITE,
                  borderRadius: '6px',
                  padding: '2px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    backgroundColor: viewMode === 'grid' ? colors.BLUE_PRIMARY : 'transparent',
                    color: viewMode === 'grid' ? colors.WHITE : colors.DARK_GRAY,
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
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
                    padding: '6px 12px',
                    border: 'none',
                    backgroundColor: viewMode === 'list' ? colors.BLUE_PRIMARY : 'transparent',
                    color: viewMode === 'list' ? colors.WHITE : colors.DARK_GRAY,
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
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
                  padding: '10px 20px',
                  backgroundColor: colors.BLUE_PRIMARY,
                  color: colors.WHITE,
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.DARK_BLUE_HOVER;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.BLUE_PRIMARY;
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

          {filteredPrograms.length === 0 ? (
            <div
              style={{
                backgroundColor: colors.WHITE,
                padding: '48px',
                borderRadius: '8px',
                textAlign: 'center',
                color: colors.DARK_GRAY,
              }}
            >
              <p style={{ fontSize: '18px', margin: 0 }}>No programs found matching your filters.</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <ProgramGrid programs={filteredPrograms} selectedState={selectedState} onStateSelect={handleStateSelect} />
          ) : (
            <div>
              {filteredPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} selectedState={selectedState} onStateSelect={handleStateSelect} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer
        style={{
          backgroundColor: colors.DARKEST_BLUE,
          color: colors.WHITE,
          padding: '32px 0',
          marginTop: '64px',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px', fontSize: '14px' }}>
            © {new Date().getFullYear()} PolicyEngine. All rights reserved.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
            <a
              href="https://policyengine.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.BLUE_LIGHT, textDecoration: 'none', fontSize: '14px' }}
            >
              PolicyEngine.org
            </a>
            <a
              href="https://github.com/PolicyEngine"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.BLUE_LIGHT, textDecoration: 'none', fontSize: '14px' }}
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/ThePolicyEngine"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.BLUE_LIGHT, textDecoration: 'none', fontSize: '14px' }}
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