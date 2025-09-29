import { Program } from '../types/Program';

const GITHUB_BASE = 'https://github.com/PolicyEngine/policyengine-us/tree/master/policyengine_us';
const TESTS_BASE = 'https://github.com/PolicyEngine/policyengine-us/tree/master/tests';

export const programs: Program[] = [
  // Tax Programs
  {
    id: 'federal_income_tax',
    name: 'Federal Income Taxes',
    fullName: 'Federal income taxes (including credits)',
    category: 'Taxes',
    status: 'complete',
    coverage: 'US',
    notes: 'Validated against NBER TAXSIM',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/irs`,
      variables: `${GITHUB_BASE}/variables/gov/irs`,
      tests: `${TESTS_BASE}/policy/baseline/gov/irs`,
    },
  },
  {
    id: 'state_income_tax',
    name: 'State Income Taxes',
    fullName: 'State income taxes (including credits)',
    category: 'Taxes',
    status: 'complete',
    coverage: 'US',
    notes: 'Validated against NBER TAXSIM',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states`,
      variables: `${GITHUB_BASE}/variables/gov/states`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states`,
    },
  },
  {
    id: 'payroll_taxes',
    name: 'Payroll Taxes',
    fullName: 'Payroll Taxes',
    category: 'Taxes',
    status: 'complete',
    coverage: 'US',
    notes: 'Social Security and Medicare',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/irs/social_security`,
      variables: `${GITHUB_BASE}/variables/gov/irs/social_security`,
      tests: `${TESTS_BASE}/policy/baseline/gov/irs/social_security`,
    },
  },

  // USDA Programs
  {
    id: 'snap',
    name: 'SNAP',
    fullName: 'Supplemental Nutrition Assistance Program',
    agency: 'USDA',
    status: 'complete',
    coverage: 'US',
    hasStateVariation: true,
    notes: 'Needs some special deductions in AK, AZ, HI, NY, TN, VA',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/usda/snap`,
      variables: `${GITHUB_BASE}/variables/gov/usda/snap`,
      tests: `${TESTS_BASE}/policy/baseline/gov/usda/snap`,
    },
  },
  {
    id: 'wic',
    name: 'WIC',
    fullName: 'Women, Infants, and Children',
    agency: 'USDA',
    status: 'complete',
    coverage: 'US',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/usda/wic`,
      variables: `${GITHUB_BASE}/variables/gov/usda/wic`,
      tests: `${TESTS_BASE}/policy/baseline/gov/usda/wic`,
    },
  },
  {
    id: 'school_meals',
    name: 'School Meals',
    fullName: 'Free and reduced price school meals',
    agency: 'USDA',
    status: 'partial',
    coverage: 'US',
    notes: 'Nationwide rules; needs states with universal coverage',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/usda/school_meals`,
      variables: `${GITHUB_BASE}/variables/gov/usda/school_meals`,
      tests: `${TESTS_BASE}/policy/baseline/gov/usda/school_meals`,
    },
  },
  {
    id: 'summer_ebt',
    name: 'Summer EBT',
    fullName: 'Summer Electronic Benefit Transfer',
    agency: 'USDA',
    status: 'inProgress',
    coverage: 'US',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/usda/summer_ebt`,
      variables: `${GITHUB_BASE}/variables/gov/usda/summer_ebt`,
      tests: `${TESTS_BASE}/policy/baseline/gov/usda/summer_ebt`,
    },
  },

  // HHS Programs
  {
    id: 'medicaid',
    name: 'Medicaid',
    fullName: 'Medicaid',
    agency: 'HHS',
    status: 'complete',
    coverage: 'US',
    hasStateVariation: true,
    notes: '8 pathways',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hhs/medicaid`,
      variables: `${GITHUB_BASE}/variables/gov/hhs/medicaid`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hhs/medicaid`,
    },
  },
  {
    id: 'chip',
    name: 'CHIP',
    fullName: "Children's Health Insurance Program",
    agency: 'HHS',
    status: 'complete',
    coverage: 'US',
    hasStateVariation: true,
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hhs/chip`,
      variables: `${GITHUB_BASE}/variables/gov/hhs/chip`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hhs/chip`,
    },
  },
  {
    id: 'aca_subsidies',
    name: 'ACA Subsidies',
    fullName: 'ACA subsidies (premium tax credit)',
    agency: 'ACA',
    status: 'complete',
    coverage: 'US',
    hasStateVariation: true,
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/aca`,
      variables: `${GITHUB_BASE}/variables/gov/aca`,
      tests: `${TESTS_BASE}/policy/baseline/gov/aca`,
    },
  },
  {
    id: 'tanf',
    name: 'TANF',
    fullName: 'Temporary Assistance for Needy Families',
    agency: 'HHS',
    status: 'partial',
    coverage: 'CA, CO, DC, IL, NY, MA',
    stateImplementations: [
      {
        state: 'CA',
        status: 'complete',
        name: 'CalWORKs Cash Aid',
        fullName: 'CalWORKs Cash Aid Program',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ca/tanf`,
          variables: `${GITHUB_BASE}/variables/gov/states/ca/tanf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ca/tanf`,
        }
      },
      {
        state: 'CO',
        status: 'complete',
        name: 'Colorado Works',
        fullName: 'Colorado Works Program',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/co/tanf`,
          variables: `${GITHUB_BASE}/variables/gov/states/co/tanf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/co/tanf`,
        }
      },
      {
        state: 'DC',
        status: 'complete',
        name: 'TANF',
        fullName: 'DC Temporary Assistance for Needy Families',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/dc/tanf`,
          variables: `${GITHUB_BASE}/variables/gov/states/dc/tanf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/dc/tanf`,
        }
      },
      {
        state: 'IL',
        status: 'complete',
        name: 'TANF',
        fullName: 'Illinois Temporary Assistance for Needy Families',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/il/tanf`,
          variables: `${GITHUB_BASE}/variables/gov/states/il/tanf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/il/tanf`,
        }
      },
      {
        state: 'NY',
        status: 'complete',
        name: 'Family Assistance',
        fullName: 'New York Family Assistance Program',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ny/tanf`,
          variables: `${GITHUB_BASE}/variables/gov/states/ny/tanf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ny/tanf`,
        }
      },
      {
        state: 'MA',
        status: 'complete',
        name: 'TAFDC',
        fullName: 'Transitional Aid to Families with Dependent Children',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ma/tanf`,
          variables: `${GITHUB_BASE}/variables/gov/states/ma/tanf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ma/tanf`,
        }
      },
    ],
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hhs/tanf`,
      variables: `${GITHUB_BASE}/variables/gov/hhs/tanf`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hhs/tanf`,
    },
  },
  {
    id: 'ccdf',
    name: 'CCDF',
    fullName: 'Child Care and Development Fund',
    agency: 'HHS',
    status: 'partial',
    coverage: 'CA, CO, IL, MA, DC, NY',
    notes: 'CCCAP in CO, CalWORKS Childcare in CA',
    stateImplementations: [
      {
        state: 'CA',
        status: 'complete',
        name: 'CalWORKs Childcare',
        fullName: 'CalWORKs Child Care Program',
        notes: 'CalWORKS Childcare',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ca/ccdf`,
          variables: `${GITHUB_BASE}/variables/gov/states/ca/ccdf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ca/ccdf`,
        }
      },
      {
        state: 'CO',
        status: 'complete',
        name: 'CCCAP',
        fullName: 'Colorado Child Care Assistance Program',
        notes: 'CCCAP',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/co/ccdf`,
          variables: `${GITHUB_BASE}/variables/gov/states/co/ccdf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/co/ccdf`,
        }
      },
      {
        state: 'IL',
        status: 'complete',
        name: 'CCAP',
        fullName: 'Child Care Assistance Program (Illinois)',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/il/ccdf`,
          variables: `${GITHUB_BASE}/variables/gov/states/il/ccdf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/il/ccdf`,
        }
      },
      {
        state: 'MA',
        status: 'complete',
        name: 'Child Care Financial Assistance',
        fullName: 'Massachusetts Child Care Financial Assistance Program',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ma/ccdf`,
          variables: `${GITHUB_BASE}/variables/gov/states/ma/ccdf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ma/ccdf`,
        }
      },
      {
        state: 'DC',
        status: 'complete',
        name: 'DC Child Care Subsidy Program (CCSP)',
        fullName: 'DC Child Care Subsidy Program',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/dc/ccdf`,
          variables: `${GITHUB_BASE}/variables/gov/states/dc/ccdf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/dc/ccdf`,
        }
      },
      {
        state: 'NY',
        status: 'complete',
        name: 'Child Care Assistance Program',
        fullName: 'New York Child Care Assistance Program',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ny/ccdf`,
          variables: `${GITHUB_BASE}/variables/gov/states/ny/ccdf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ny/ccdf`,
        }
      },
    ],
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hhs/ccdf`,
      variables: `${GITHUB_BASE}/variables/gov/hhs/ccdf`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hhs/ccdf`,
    },
  },
  {
    id: 'head_start',
    name: 'Head Start',
    fullName: 'Head Start / Early Head Start',
    agency: 'HHS',
    status: 'partial',
    coverage: 'US',
    notes: 'Currently adding immigration rules',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hhs/head_start`,
      variables: `${GITHUB_BASE}/variables/gov/hhs/head_start`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hhs/head_start`,
    },
  },
  {
    id: 'liheap',
    name: 'LIHEAP',
    fullName: 'Low Income Home Energy Assistance Program',
    agency: 'HHS',
    status: 'partial',
    coverage: 'OR, DC, Riverside County, MA, IL',
    stateImplementations: [
      {
        state: 'OR',
        status: 'inProgress',
        name: 'LIHEAP',
        fullName: 'Low Income Home Energy Assistance Program (Oregon)',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/or/liheap`,
          variables: `${GITHUB_BASE}/variables/gov/states/or/liheap`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/or/liheap`,
        }
      },
      {
        state: 'DC',
        status: 'inProgress',
        name: 'LIHEAP',
        fullName: 'Low Income Home Energy Assistance Program (DC)',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/dc/liheap`,
          variables: `${GITHUB_BASE}/variables/gov/states/dc/liheap`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/dc/liheap`,
        }
      },
      {
        state: 'MA',
        status: 'inProgress',
        name: 'LIHEAP',
        fullName: 'Low Income Home Energy Assistance Program (Massachusetts)',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ma/liheap`,
          variables: `${GITHUB_BASE}/variables/gov/states/ma/liheap`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ma/liheap`,
        }
      },
      {
        state: 'IL',
        status: 'inProgress',
        name: 'LIHEAP',
        fullName: 'Low Income Home Energy Assistance Program (Illinois)',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/il/liheap`,
          variables: `${GITHUB_BASE}/variables/gov/states/il/liheap`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/il/liheap`,
        }
      },
      {
        state: 'CA',
        status: 'inProgress',
        name: 'LIHEAP',
        fullName: 'Low Income Home Energy Assistance Program (Riverside County)',
        notes: 'Riverside County only',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/local/riverside/liheap`,
          variables: `${GITHUB_BASE}/variables/gov/local/riverside/liheap`,
          tests: `${TESTS_BASE}/policy/baseline/gov/local/riverside/liheap`,
        }
      },
    ],
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hhs/liheap`,
      variables: `${GITHUB_BASE}/variables/gov/hhs/liheap`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hhs/liheap`,
    },
  },

  // SSA Programs
  {
    id: 'ssi',
    name: 'SSI',
    fullName: 'Supplemental Security Income',
    agency: 'SSA',
    status: 'complete',
    coverage: 'US',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/ssa/ssi`,
      variables: `${GITHUB_BASE}/variables/gov/ssa/ssi`,
      tests: `${TESTS_BASE}/policy/baseline/gov/ssa/ssi`,
    },
  },
  {
    id: 'ssi_state_supplement',
    name: 'SSI State Supplement',
    fullName: 'SSI State Supplement',
    agency: 'SSA',
    status: 'partial',
    coverage: 'CA, CO, MA',
    stateImplementations: [
      { state: 'CA', status: 'complete' },
      { state: 'CO', status: 'complete' },
      { state: 'MA', status: 'complete' },
    ],
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states`,
      variables: `${GITHUB_BASE}/variables/gov/states`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ssi_supplement`,
    },
  },

  // HUD Programs
  {
    id: 'section_8',
    name: 'Section 8',
    fullName: 'Housing Choice Voucher Program',
    agency: 'HUD',
    status: 'partial',
    coverage: 'Los Angeles County, CO',
    notes: 'National rules; only have AMI for LA County. IL, MA in progress',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hud/section_8`,
      variables: `${GITHUB_BASE}/variables/gov/hud/section_8`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hud/section_8`,
    },
  },

  // FCC Programs
  {
    id: 'lifeline',
    name: 'Lifeline',
    fullName: 'Lifeline Program',
    agency: 'FCC',
    status: 'complete',
    coverage: 'US',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/fcc/lifeline`,
      variables: `${GITHUB_BASE}/variables/gov/fcc/lifeline`,
      tests: `${TESTS_BASE}/policy/baseline/gov/fcc/lifeline`,
    },
  },

  // ED Programs
  {
    id: 'pell_grant',
    name: 'Pell Grant',
    fullName: 'Federal Pell Grant',
    agency: 'ED',
    status: 'complete',
    coverage: 'US',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/ed/pell_grant`,
      variables: `${GITHUB_BASE}/variables/gov/ed/pell_grant`,
      tests: `${TESTS_BASE}/policy/baseline/gov/ed/pell_grant`,
    },
  },

  // IRA Programs
  {
    id: 'ira_tax_credits',
    name: 'IRA Tax Credits',
    fullName: 'Inflation Reduction Act Tax Credits',
    category: 'Energy',
    status: 'complete',
    coverage: 'US',
    notes: 'High efficiency electric home rebate, residential efficiency electrification rebate',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/irs/credits/ira`,
      variables: `${GITHUB_BASE}/variables/gov/irs/credits/ira`,
      tests: `${TESTS_BASE}/policy/baseline/gov/irs/credits/ira`,
    },
  },

  // State Programs
  {
    id: 'co_oap',
    name: 'Colorado OAP',
    fullName: 'Colorado Old Age Pension',
    agency: 'State',
    status: 'complete',
    coverage: 'CO',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/co/oap`,
      variables: `${GITHUB_BASE}/variables/gov/states/co/oap`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/co/oap`,
    },
  },
  {
    id: 'ca_cvrp',
    name: 'California CVRP',
    fullName: 'California Clean Vehicle Rebate Project',
    agency: 'State',
    status: 'complete',
    coverage: 'CA',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/ca/cvrp`,
      variables: `${GITHUB_BASE}/variables/gov/states/ca/cvrp`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ca/cvrp`,
    },
  },
  {
    id: 'care',
    name: 'CARE',
    fullName: 'California Alternate Rates for Energy',
    agency: 'State',
    status: 'complete',
    coverage: 'CA',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/ca/care`,
      variables: `${GITHUB_BASE}/variables/gov/states/ca/care`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ca/care`,
    },
  },
  {
    id: 'fera',
    name: 'FERA',
    fullName: 'Family Electric Rate Assistance',
    agency: 'State',
    status: 'complete',
    coverage: 'CA',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/ca/fera`,
      variables: `${GITHUB_BASE}/variables/gov/states/ca/fera`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ca/fera`,
    },
  },
  {
    id: 'ne_childcare',
    name: 'Nebraska Child Care',
    fullName: 'Nebraska Child Care Subsidy',
    agency: 'State',
    status: 'complete',
    coverage: 'NE',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/ne/childcare`,
      variables: `${GITHUB_BASE}/variables/gov/states/ne/childcare`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ne/childcare`,
    },
  },
  {
    id: 'dc_childcare',
    name: 'DC Childcare',
    fullName: 'DC Childcare Subsidy Program',
    agency: 'State',
    status: 'inProgress',
    coverage: 'DC',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/dc/childcare`,
      variables: `${GITHUB_BASE}/variables/gov/states/dc/childcare`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/dc/childcare`,
    },
  },
  {
    id: 'mbta_reduced_fare',
    name: 'MBTA Reduced Fare',
    fullName: 'Massachusetts Bay Transportation Authority Reduced Fare Program',
    agency: 'State',
    status: 'complete',
    coverage: 'MA',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/ma/mbta`,
      variables: `${GITHUB_BASE}/variables/gov/states/ma/mbta`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ma/mbta`,
    },
  },

  // Local Programs
  {
    id: 'ez_save',
    name: 'EZ Save',
    fullName: 'EZ Save',
    agency: 'Local',
    status: 'complete',
    coverage: 'Los Angeles',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/la/ez_save`,
      variables: `${GITHUB_BASE}/variables/gov/local/la/ez_save`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/la/ez_save`,
    },
  },
  {
    id: 'la_infant_supplement',
    name: 'LA Infant Supplement',
    fullName: 'Los Angeles Infant Supplement',
    agency: 'Local',
    status: 'complete',
    coverage: 'Los Angeles',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/la/infant_supplement`,
      variables: `${GITHUB_BASE}/variables/gov/local/la/infant_supplement`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/la/infant_supplement`,
    },
  },
  {
    id: 'la_expectant_parent',
    name: 'LA Expectant Parent',
    fullName: 'Los Angeles Expectant Parent Payment',
    agency: 'Local',
    status: 'complete',
    coverage: 'Los Angeles',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/la/expectant_parent`,
      variables: `${GITHUB_BASE}/variables/gov/local/la/expectant_parent`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/la/expectant_parent`,
    },
  },
  {
    id: 'la_general_relief',
    name: 'LA General Relief',
    fullName: 'Los Angeles General Relief',
    agency: 'Local',
    status: 'complete',
    coverage: 'Los Angeles',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/la/general_relief`,
      variables: `${GITHUB_BASE}/variables/gov/local/la/general_relief`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/la/general_relief`,
    },
  },
  {
    id: 'share',
    name: 'SHARE',
    fullName: 'SHARE Program',
    agency: 'Local',
    status: 'complete',
    coverage: 'Riverside County',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/riverside/share`,
      variables: `${GITHUB_BASE}/variables/gov/local/riverside/share`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/riverside/share`,
    },
  },

  // Other Programs
  {
    id: 'chapter_7_bankruptcy',
    name: 'Chapter 7 Bankruptcy',
    fullName: 'Chapter 7 Bankruptcy',
    category: 'Legal',
    status: 'inProgress',
    coverage: 'US',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/bankruptcy`,
      variables: `${GITHUB_BASE}/variables/gov/bankruptcy`,
      tests: `${TESTS_BASE}/policy/baseline/gov/bankruptcy`,
    },
  },
];

export const getStatusCount = () => {
  const counts = {
    complete: 0,
    partial: 0,
    inProgress: 0,
    notStarted: 0,
  };

  programs.forEach((program) => {
    counts[program.status]++;
  });

  return counts;
};

export const getAgencyPrograms = (agency: string) => {
  return programs.filter((program) => program.agency === agency);
};

export const getCategoryPrograms = (category: string) => {
  return programs.filter((program) => program.category === category);
};