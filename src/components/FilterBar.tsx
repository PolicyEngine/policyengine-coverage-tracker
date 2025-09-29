import React from 'react';
import { CoverageStatus } from '../types/Program';
import { statusColors, colors } from '../constants/colors';

type FilterMode = 'all' | 'federal' | 'state-local';

interface FilterBarProps {
  selectedStatus: CoverageStatus | 'all';
  onStatusChange: (status: CoverageStatus | 'all') => void;
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;
  selectedAgency: string;
  onAgencyChange: (agency: string) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusCounts: Record<CoverageStatus, number>;
  totalPrograms: number;
  availableStates: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedStatus,
  onStatusChange,
  filterMode,
  onFilterModeChange,
  selectedAgency,
  onAgencyChange,
  selectedState,
  onStateChange,
  searchQuery,
  onSearchChange,
  statusCounts,
  totalPrograms,
  availableStates,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const federalAgencies = ['USDA', 'HHS', 'SSA', 'IRS', 'HUD', 'ED', 'DOL', 'FCC', 'ACA'];

  // Check if any filters are active (not in reset state)
  const filtersActive = selectedStatus !== 'all' ||
                       filterMode !== 'all' ||
                       selectedAgency !== 'All' ||
                       selectedState !== 'All' ||
                       searchQuery !== '';

  const statusOptions: Array<{ value: CoverageStatus | 'all'; label: string; count: number }> = [
    { value: 'all', label: 'All Programs', count: totalPrograms },
    { value: 'complete', label: 'Complete', count: statusCounts.complete },
    { value: 'partial', label: 'Partial', count: statusCounts.partial },
    { value: 'inProgress', label: 'In Progress', count: statusCounts.inProgress },
  ];

  const filterModeOptions: Array<{ value: FilterMode; label: string }> = [
    { value: 'all', label: 'All Programs' },
    { value: 'federal', label: 'Federal Agencies' },
    { value: 'state-local', label: 'State & Local' },
  ];

  return (
    <div style={{ backgroundColor: colors.WHITE, padding: '24px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
      {/* Search bar - always visible */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search programs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '8px 14px',
            fontSize: '13px',
            border: `2px solid ${colors.LIGHT_GRAY}`,
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = `2px solid ${colors.BLUE_PRIMARY}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = `2px solid ${colors.LIGHT_GRAY}`;
          }}
        />
      </div>

      {/* Advanced Filters and Reset button */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: isExpanded ? '20px' : '0' }}>
        <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '8px 14px',
          backgroundColor: colors.BLUE_98,
          border: `1px solid ${colors.LIGHT_GRAY}`,
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 500,
          color: colors.DARKEST_BLUE,
          cursor: 'pointer',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.BLUE_95;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.BLUE_98;
        }}
      >
        <span>Advanced Filters</span>
        <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '10px' }}>
          ▼
        </span>
      </button>

        {filtersActive && (
          <button
            onClick={() => {
              onStatusChange('all');
              onFilterModeChange('all');
              onAgencyChange('All');
              onStateChange('All');
              onSearchChange('');
            }}
            style={{
              padding: '8px 14px',
              backgroundColor: colors.TEAL_ACCENT,
              border: `1px solid ${colors.TEAL_ACCENT}`,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: colors.WHITE,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.TEAL_PRESSED;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.TEAL_ACCENT;
            }}
          >
            ✕ Reset Filters
          </button>
        )}
      </div>

      {/* Collapsible filters section */}
      {isExpanded && (
        <div style={{ overflow: 'hidden', transition: 'all 0.3s ease' }}>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: colors.DARK_GRAY, fontSize: '14px', fontWeight: 500 }}>
          Filter by Status
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {statusOptions.map((option) => {
            const isSelected = selectedStatus === option.value;
            const statusColor = option.value === 'all' ? colors.DARKEST_BLUE : statusColors[option.value as CoverageStatus];

            return (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                style={{
                  padding: '8px 16px',
                  border: isSelected ? `2px solid ${statusColor}` : `1px solid ${colors.LIGHT_GRAY}`,
                  backgroundColor: isSelected ? `${statusColor}15` : colors.WHITE,
                  color: isSelected ? statusColor : colors.DARK_GRAY,
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = colors.BLUE_98;
                    e.currentTarget.style.borderColor = colors.BLUE_LIGHT;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = colors.WHITE;
                    e.currentTarget.style.borderColor = colors.LIGHT_GRAY;
                  }
                }}
              >
                {option.label}
                <span
                  style={{
                    backgroundColor: isSelected ? statusColor : colors.MEDIUM_LIGHT_GRAY,
                    color: colors.WHITE,
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: colors.DARK_GRAY, fontSize: '14px', fontWeight: 500 }}>
          Program Level
        </label>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          {filterModeOptions.map((option) => {
            const isSelected = filterMode === option.value;
            const modeColor = option.value === 'federal' ? colors.BLUE_PRIMARY :
                            option.value === 'state-local' ? colors.TEAL_ACCENT :
                            colors.DARKEST_BLUE;

            return (
              <button
                key={option.value}
                onClick={() => {
                  onFilterModeChange(option.value);
                  // Reset agency/state selection when switching modes
                  if (option.value !== filterMode) {
                    onAgencyChange('All');
                    onStateChange('All');
                  }
                }}
                style={{
                  padding: '8px 20px',
                  border: isSelected ? `2px solid ${modeColor}` : `1px solid ${colors.LIGHT_GRAY}`,
                  backgroundColor: isSelected ?
                    (option.value === 'federal' ? colors.BLUE_95 :
                     option.value === 'state-local' ? colors.TEAL_LIGHT :
                     colors.LIGHT_GRAY) : colors.WHITE,
                  color: isSelected ? modeColor : colors.DARK_GRAY,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor =
                      option.value === 'federal' ? colors.BLUE_98 :
                      option.value === 'state-local' ? colors.TEAL_LIGHT :
                      colors.LIGHT_GRAY;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = colors.WHITE;
                  }
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Federal Agency Filter */}
        {filterMode === 'federal' && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: colors.DARK_GRAY, fontSize: '13px', fontWeight: 500 }}>
              Select Federal Agency
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onAgencyChange('All')}
                style={{
                  padding: '6px 14px',
                  border: selectedAgency === 'All' ? `2px solid ${colors.BLUE_PRIMARY}` : `1px solid ${colors.LIGHT_GRAY}`,
                  backgroundColor: selectedAgency === 'All' ? colors.BLUE_95 : colors.WHITE,
                  color: selectedAgency === 'All' ? colors.BLUE_PRIMARY : colors.DARK_GRAY,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: selectedAgency === 'All' ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedAgency !== 'All') {
                    e.currentTarget.style.backgroundColor = colors.BLUE_98;
                    e.currentTarget.style.borderColor = colors.BLUE_LIGHT;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAgency !== 'All') {
                    e.currentTarget.style.backgroundColor = colors.WHITE;
                    e.currentTarget.style.borderColor = colors.LIGHT_GRAY;
                  }
                }}
              >
                All Agencies
              </button>
              {federalAgencies.map((agency) => {
                const isSelected = selectedAgency === agency;

                return (
                  <button
                    key={agency}
                    onClick={() => onAgencyChange(agency)}
                    style={{
                      padding: '6px 14px',
                      border: isSelected ? `2px solid ${colors.BLUE_PRIMARY}` : `1px solid ${colors.LIGHT_GRAY}`,
                      backgroundColor: isSelected ? colors.BLUE_95 : colors.WHITE,
                      color: isSelected ? colors.BLUE_PRIMARY : colors.DARK_GRAY,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = colors.BLUE_98;
                        e.currentTarget.style.borderColor = colors.BLUE_LIGHT;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = colors.WHITE;
                        e.currentTarget.style.borderColor = colors.LIGHT_GRAY;
                      }
                    }}
                  >
                    {agency}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* State/Local Filter */}
        {filterMode === 'state-local' && availableStates.length > 0 && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: colors.DARK_GRAY, fontSize: '13px', fontWeight: 500 }}>
              Select State
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onStateChange('All')}
                style={{
                  padding: '6px 14px',
                  border: selectedState === 'All' ? `2px solid ${colors.TEAL_ACCENT}` : `1px solid ${colors.LIGHT_GRAY}`,
                  backgroundColor: selectedState === 'All' ? colors.TEAL_LIGHT : colors.WHITE,
                  color: selectedState === 'All' ? colors.TEAL_PRESSED : colors.DARK_GRAY,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: selectedState === 'All' ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedState !== 'All') {
                    e.currentTarget.style.backgroundColor = colors.TEAL_LIGHT;
                    e.currentTarget.style.borderColor = colors.TEAL_ACCENT;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedState !== 'All') {
                    e.currentTarget.style.backgroundColor = colors.WHITE;
                    e.currentTarget.style.borderColor = colors.LIGHT_GRAY;
                  }
                }}
              >
                All States
              </button>
              {availableStates.map((state) => {
                const isSelected = selectedState === state;

                return (
                  <button
                    key={state}
                    onClick={() => onStateChange(state)}
                    style={{
                      padding: '6px 14px',
                      border: isSelected ? `2px solid ${colors.TEAL_ACCENT}` : `1px solid ${colors.LIGHT_GRAY}`,
                      backgroundColor: isSelected ? colors.TEAL_LIGHT : colors.WHITE,
                      color: isSelected ? colors.TEAL_PRESSED : colors.DARK_GRAY,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = colors.TEAL_LIGHT;
                        e.currentTarget.style.borderColor = colors.TEAL_ACCENT;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = colors.WHITE;
                        e.currentTarget.style.borderColor = colors.LIGHT_GRAY;
                      }
                    }}
                  >
                    {state}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;