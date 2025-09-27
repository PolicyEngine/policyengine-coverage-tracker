export type CoverageStatus = 'complete' | 'partial' | 'inProgress' | 'notStarted';
export type Agency = 'USDA' | 'HHS' | 'SSA' | 'IRS' | 'HUD' | 'DOE' | 'ED' | 'DOL' | 'FCC' | 'ACA' | 'State' | 'Local';

export interface StateImplementation {
  state: string;
  status: CoverageStatus;
  notes?: string;
  name?: string; // State-specific program name
  fullName?: string; // State-specific full name
  githubLinks?: {
    parameters?: string;
    variables?: string;
    tests?: string;
  };
}

export interface Program {
  id: string;
  name: string;
  fullName: string;
  agency?: Agency;
  category?: string;
  status: CoverageStatus;
  coverage?: string;
  hasFederalRules?: boolean;
  description?: string;
  stateImplementations?: StateImplementation[];
  githubLinks: {
    parameters?: string;
    variables?: string;
    tests?: string;
  };
  notes?: string;
  lastUpdated?: string;
}