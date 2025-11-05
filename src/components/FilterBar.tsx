import React from 'react';
import { CoverageStatus } from '../types/Program';
import { Country } from '../types/Country';
import { statusColors, colors } from '../designTokens';

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
  country: Country;
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
  country,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const federalAgencies = country.agencies;

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
    { value: 'federal', label: `${country.federalLabel} Agencies` },
    { value: 'state-local', label: `${country.regionalLabel} & Local` },
  ];

  return (
    <div style={{ backgroundColor: colors.white, padding: '24px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
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
            border: `2px solid ${colors.border.light}`,
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = `2px solid ${colors.blue[700]}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = `2px solid ${colors.border.light}`;
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
          backgroundColor: colors.blue[50],
          border: `1px solid ${colors.border.light}`,
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 500,
          color: colors.secondary[900],
          cursor: 'pointer',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.blue[100];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.blue[50];
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
              backgroundColor: colors.primary[400],
              border: `1px solid ${colors.primary[400]}`,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: colors.white,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary[700];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary[400];
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
        <label style={{ display: 'block', marginBottom: '8px', color: colors.text.secondary, fontSize: '14px', fontWeight: 500 }}>
          Filter by Status
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {statusOptions.map((option) => {
            const isSelected = selectedStatus === option.value;
            const statusColor = option.value === 'all' ? colors.secondary[900] : statusColors[option.value as CoverageStatus];

            return (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                style={{
                  padding: '8px 16px',
                  border: isSelected ? `2px solid ${statusColor}` : `1px solid ${colors.border.light}`,
                  backgroundColor: isSelected ? `${statusColor}15` : colors.white,
                  color: isSelected ? statusColor : colors.text.secondary,
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
                    e.currentTarget.style.backgroundColor = colors.blue[50];
                    e.currentTarget.style.borderColor = colors.blue[200];
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = colors.white;
                    e.currentTarget.style.borderColor = colors.border.light;
                  }
                }}
              >
                {option.label}
                <span
                  style={{
                    backgroundColor: isSelected ? statusColor : colors.gray[400],
                    color: colors.white,
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
        <label style={{ display: 'block', marginBottom: '8px', color: colors.text.secondary, fontSize: '14px', fontWeight: 500 }}>
          Program Level
        </label>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          {filterModeOptions.map((option) => {
            const isSelected = filterMode === option.value;
            const modeColor = option.value === 'federal' ? colors.blue[700] :
                            option.value === 'state-local' ? colors.primary[400] :
                            colors.secondary[900];

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
                  border: isSelected ? `2px solid ${modeColor}` : `1px solid ${colors.border.light}`,
                  backgroundColor: isSelected ?
                    (option.value === 'federal' ? colors.blue[100] :
                     option.value === 'state-local' ? colors.primary[50] :
                     colors.border.light) : colors.white,
                  color: isSelected ? modeColor : colors.text.secondary,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor =
                      option.value === 'federal' ? colors.blue[50] :
                      option.value === 'state-local' ? colors.primary[50] :
                      colors.border.light;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = colors.white;
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
            <label style={{ display: 'block', marginBottom: '8px', color: colors.text.secondary, fontSize: '13px', fontWeight: 500 }}>
              Select {country.federalLabel} Agency
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onAgencyChange('All')}
                style={{
                  padding: '6px 14px',
                  border: selectedAgency === 'All' ? `2px solid ${colors.blue[700]}` : `1px solid ${colors.border.light}`,
                  backgroundColor: selectedAgency === 'All' ? colors.blue[100] : colors.white,
                  color: selectedAgency === 'All' ? colors.blue[700] : colors.text.secondary,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: selectedAgency === 'All' ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedAgency !== 'All') {
                    e.currentTarget.style.backgroundColor = colors.blue[50];
                    e.currentTarget.style.borderColor = colors.blue[200];
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAgency !== 'All') {
                    e.currentTarget.style.backgroundColor = colors.white;
                    e.currentTarget.style.borderColor = colors.border.light;
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
                      border: isSelected ? `2px solid ${colors.blue[700]}` : `1px solid ${colors.border.light}`,
                      backgroundColor: isSelected ? colors.blue[100] : colors.white,
                      color: isSelected ? colors.blue[700] : colors.text.secondary,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = colors.blue[50];
                        e.currentTarget.style.borderColor = colors.blue[200];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = colors.white;
                        e.currentTarget.style.borderColor = colors.border.light;
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
            <label style={{ display: 'block', marginBottom: '8px', color: colors.text.secondary, fontSize: '13px', fontWeight: 500 }}>
              Select {country.regionalLabel}
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onStateChange('All')}
                style={{
                  padding: '6px 14px',
                  border: selectedState === 'All' ? `2px solid ${colors.primary[400]}` : `1px solid ${colors.border.light}`,
                  backgroundColor: selectedState === 'All' ? colors.primary[50] : colors.white,
                  color: selectedState === 'All' ? colors.primary[700] : colors.text.secondary,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: selectedState === 'All' ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedState !== 'All') {
                    e.currentTarget.style.backgroundColor = colors.primary[50];
                    e.currentTarget.style.borderColor = colors.primary[400];
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedState !== 'All') {
                    e.currentTarget.style.backgroundColor = colors.white;
                    e.currentTarget.style.borderColor = colors.border.light;
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
                      border: isSelected ? `2px solid ${colors.primary[400]}` : `1px solid ${colors.border.light}`,
                      backgroundColor: isSelected ? colors.primary[50] : colors.white,
                      color: isSelected ? colors.primary[700] : colors.text.secondary,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = colors.primary[50];
                        e.currentTarget.style.borderColor = colors.primary[400];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = colors.white;
                        e.currentTarget.style.borderColor = colors.border.light;
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