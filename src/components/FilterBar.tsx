import React from 'react';
import { CoverageStatus } from '../types/Program';
import { statusColors, colors, typography, spacing } from '../designTokens';

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
    <div
      className="animate-fade-in-up"
      style={{
        backgroundColor: colors.white,
        padding: spacing.xl,
        borderRadius: '16px',
        marginBottom: spacing.xl,
        boxShadow: 'var(--shadow-elevation-low)',
        border: `1px solid ${colors.border.light}`,
      }}
    >
      {/* Search bar - always visible */}
      <div style={{ marginBottom: spacing.lg }}>
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.gray[400]}
            strokeWidth="2"
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search programs by name, description, or coverage..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
            style={{
              width: '100%',
              padding: '12px 14px 12px 44px',
              fontSize: typography.fontSize.sm,
              border: `2px solid ${colors.border.light}`,
              borderRadius: '10px',
              outline: 'none',
              fontFamily: typography.fontFamily.body,
              backgroundColor: colors.background.secondary,
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = `2px solid ${colors.primary[500]}`;
              e.currentTarget.style.backgroundColor = colors.white;
              e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primary[50]}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = `2px solid ${colors.border.light}`;
              e.currentTarget.style.backgroundColor = colors.background.secondary;
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Advanced Filters and Reset button */}
      <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center', marginBottom: isExpanded ? spacing.lg : '0' }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xs,
            padding: '10px 16px',
            backgroundColor: isExpanded ? colors.primary[50] : colors.background.secondary,
            border: `1px solid ${isExpanded ? colors.primary[200] : colors.border.light}`,
            borderRadius: '10px',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: isExpanded ? colors.primary[700] : colors.secondary[900],
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            fontFamily: typography.fontFamily.primary,
          }}
          onMouseEnter={(e) => {
            if (!isExpanded) {
              e.currentTarget.style.backgroundColor = colors.gray[100];
              e.currentTarget.style.borderColor = colors.gray[300];
            }
          }}
          onMouseLeave={(e) => {
            if (!isExpanded) {
              e.currentTarget.style.backgroundColor = colors.background.secondary;
              e.currentTarget.style.borderColor = colors.border.light;
            }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 4h12M4 8h8M6 12h4" strokeLinecap="round" />
          </svg>
          <span>Filters</span>
          <span style={{
            fontSize: typography.fontSize.xs,
            transition: 'transform 0.2s ease',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}>
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
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              border: 'none',
              borderRadius: '10px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: colors.white,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              fontFamily: typography.fontFamily.primary,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
            </svg>
            Reset
          </button>
        )}
      </div>

      {/* Collapsible filters section */}
      {isExpanded && (
        <div
          className="animate-fade-in"
          style={{
            overflow: 'hidden',
            paddingTop: spacing.md,
            borderTop: `1px solid ${colors.border.light}`,
          }}
        >

          <div style={{ marginBottom: spacing.lg }}>
            <label style={{
              display: 'block',
              marginBottom: spacing.sm,
              color: colors.text.secondary,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
              fontFamily: typography.fontFamily.primary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Filter by Status
            </label>
            <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
              {statusOptions.map((option) => {
                const isSelected = selectedStatus === option.value;
                const statusColor = option.value === 'all' ? colors.secondary[700] : statusColors[option.value as CoverageStatus];

                return (
                  <button
                    key={option.value}
                    onClick={() => onStatusChange(option.value)}
                    style={{
                      padding: '8px 14px',
                      border: isSelected ? `2px solid ${statusColor}` : `1px solid ${colors.border.light}`,
                      backgroundColor: isSelected ? `${statusColor}12` : colors.white,
                      color: isSelected ? statusColor : colors.text.secondary,
                      borderRadius: '20px',
                      fontSize: typography.fontSize.sm,
                      fontWeight: isSelected ? typography.fontWeight.semibold : typography.fontWeight.medium,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                      fontFamily: typography.fontFamily.primary,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = colors.gray[50];
                        e.currentTarget.style.borderColor = colors.gray[300];
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
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        minWidth: '24px',
                        textAlign: 'center',
                      }}
                    >
                      {option.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: spacing.lg }}>
            <label style={{
              display: 'block',
              marginBottom: spacing.sm,
              color: colors.text.secondary,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
              fontFamily: typography.fontFamily.primary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Program Level
            </label>
            <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.md }}>
              {filterModeOptions.map((option) => {
                const isSelected = filterMode === option.value;
                const modeColor = option.value === 'federal' ? colors.blue[600] :
                                option.value === 'state-local' ? colors.primary[600] :
                                colors.secondary[700];

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
                      padding: '10px 20px',
                      border: isSelected ? `2px solid ${modeColor}` : `1px solid ${colors.border.light}`,
                      backgroundColor: isSelected ? `${modeColor}10` : colors.white,
                      color: isSelected ? modeColor : colors.text.secondary,
                      borderRadius: '10px',
                      fontSize: typography.fontSize.sm,
                      fontWeight: isSelected ? typography.fontWeight.semibold : typography.fontWeight.medium,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: typography.fontFamily.primary,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = colors.gray[50];
                        e.currentTarget.style.borderColor = colors.gray[300];
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
                  </button>
                );
              })}
            </div>

            {/* Federal Agency Filter */}
            {filterMode === 'federal' && (
              <div
                className="animate-fade-in"
                style={{
                  padding: spacing.md,
                  backgroundColor: colors.blue[50],
                  borderRadius: '12px',
                  border: `1px solid ${colors.blue[100]}`,
                }}
              >
                <label style={{
                  display: 'block',
                  marginBottom: spacing.sm,
                  color: colors.blue[700],
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  fontFamily: typography.fontFamily.primary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Select Federal Agency
                </label>
                <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onAgencyChange('All')}
                    style={{
                      padding: '6px 12px',
                      border: selectedAgency === 'All' ? `2px solid ${colors.blue[600]}` : `1px solid ${colors.blue[200]}`,
                      backgroundColor: selectedAgency === 'All' ? colors.blue[100] : colors.white,
                      color: selectedAgency === 'All' ? colors.blue[700] : colors.blue[600],
                      borderRadius: '8px',
                      fontSize: typography.fontSize.xs,
                      fontWeight: selectedAgency === 'All' ? typography.fontWeight.semibold : typography.fontWeight.medium,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: typography.fontFamily.primary,
                    }}
                    onMouseEnter={(e) => {
                      if (selectedAgency !== 'All') {
                        e.currentTarget.style.backgroundColor = colors.blue[50];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAgency !== 'All') {
                        e.currentTarget.style.backgroundColor = colors.white;
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
                          padding: '6px 12px',
                          border: isSelected ? `2px solid ${colors.blue[600]}` : `1px solid ${colors.blue[200]}`,
                          backgroundColor: isSelected ? colors.blue[100] : colors.white,
                          color: isSelected ? colors.blue[700] : colors.blue[600],
                          borderRadius: '8px',
                          fontSize: typography.fontSize.xs,
                          fontWeight: isSelected ? typography.fontWeight.semibold : typography.fontWeight.medium,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontFamily: typography.fontFamily.primary,
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = colors.blue[50];
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = colors.white;
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
              <div
                className="animate-fade-in"
                style={{
                  padding: spacing.md,
                  backgroundColor: colors.primary[50],
                  borderRadius: '12px',
                  border: `1px solid ${colors.primary[100]}`,
                }}
              >
                <label style={{
                  display: 'block',
                  marginBottom: spacing.sm,
                  color: colors.primary[700],
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  fontFamily: typography.fontFamily.primary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Select State
                </label>
                <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onStateChange('All')}
                    style={{
                      padding: '6px 12px',
                      border: selectedState === 'All' ? `2px solid ${colors.primary[600]}` : `1px solid ${colors.primary[200]}`,
                      backgroundColor: selectedState === 'All' ? colors.primary[100] : colors.white,
                      color: selectedState === 'All' ? colors.primary[700] : colors.primary[600],
                      borderRadius: '8px',
                      fontSize: typography.fontSize.xs,
                      fontWeight: selectedState === 'All' ? typography.fontWeight.semibold : typography.fontWeight.medium,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: typography.fontFamily.primary,
                    }}
                    onMouseEnter={(e) => {
                      if (selectedState !== 'All') {
                        e.currentTarget.style.backgroundColor = colors.primary[50];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedState !== 'All') {
                        e.currentTarget.style.backgroundColor = colors.white;
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
                          padding: '6px 12px',
                          border: isSelected ? `2px solid ${colors.primary[600]}` : `1px solid ${colors.primary[200]}`,
                          backgroundColor: isSelected ? colors.primary[100] : colors.white,
                          color: isSelected ? colors.primary[700] : colors.primary[600],
                          borderRadius: '8px',
                          fontSize: typography.fontSize.xs,
                          fontWeight: isSelected ? typography.fontWeight.semibold : typography.fontWeight.medium,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontFamily: typography.fontFamily.primary,
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = colors.primary[50];
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = colors.white;
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
