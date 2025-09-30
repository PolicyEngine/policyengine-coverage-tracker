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
    variable: 'income_tax',
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
    hasStateVariation: true,
    variable: 'state_income_tax',
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
    variable: 'employee_payroll_tax',
    notes: 'Social Security and Medicare',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/irs/payroll`,
      variables: `${GITHUB_BASE}/variables/gov/irs/payroll`,
      tests: `${TESTS_BASE}/policy/baseline/gov/irs/payroll`,
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
    variable: 'snap',
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
    variable: 'wic',
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
    variable: 'free_school_meals',
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
    githubLinks: {},
  },

  // HHS Programs
  {
    id: 'medicaid',
    name: 'Medicaid',
    fullName: '',
    agency: 'HHS',
    status: 'complete',
    coverage: 'US',
    hasStateVariation: true,
    variable: 'medicaid',
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
    variable: 'chip',
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
    variable: 'aca_ptc',
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
    coverage: 'CA, CO, DC, IL, NY, MA, NC, NJ, MT, TX',
    stateImplementations: [
      {
        state: 'CA',
        status: 'complete',
        name: 'CalWORKs Cash Benefit',
        fullName: 'California CalWORKs Cash Benefit',
        variable: 'ca_tanf',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ca/cdss/tanf/cash`,
          variables: `${GITHUB_BASE}/variables/gov/states/ca/cdss/tanf/cash`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ca/cdss/tanf/cash`,
        }
      },
      {
        state: 'CO',
        status: 'complete',
        name: 'Colorado TANF',
        fullName: 'Colorado Works Program',
        variable: 'co_tanf',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/co/cdhs/tanf`,
          variables: `${GITHUB_BASE}/variables/gov/states/co/cdhs/tanf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/co/cdhs/tanf`,
        }
      },
      {
        state: 'DC',
        status: 'complete',
        name: 'DC TANF',
        fullName: 'DC Temporary Assistance for Needy Families',
        variable: 'dc_tanf',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/dc/dhs/tanf`,
          variables: `${GITHUB_BASE}/variables/gov/states/dc/dhs/tanf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/dc/dhs/tanf`,
        }
      },
      {
        state: 'IL',
        status: 'complete',
        name: 'Illinois TANF',
        fullName: 'Illinois Temporary Assistance for Needy Families',
        variable: 'il_tanf',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/il/dhs/tanf`,
          variables: `${GITHUB_BASE}/variables/gov/states/il/dhs/tanf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/il/dhs/tanf`,
        }
      },
      {
        state: 'NY',
        status: 'complete',
        name: 'NY TANF',
        fullName: 'New York Temporary Assistance for Needy Families',
        variable: 'ny_tanf',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ny/otda/tanf`,
          variables: `${GITHUB_BASE}/variables/gov/states/ny/otda/tanf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ny/otda/tanf`,
        }
      },
      {
        state: 'MA',
        status: 'complete',
        name: 'Massachusets TAFDC',
        fullName: 'Transitional Aid to Families with Dependent Children',
        variable: 'ma_tafdc',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ma/dta/tcap/tafdc`,
          variables: `${GITHUB_BASE}/variables/gov/states/ma/dta/tcap/tafdc`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ma/dta/tcap/tafdc`,
        }
      },
      {
        state: 'MT',
        status: 'inProgress',
        name: 'Montana TANF',
        fullName: 'Montana Temporary Assistance for Needy Families',
        githubLinks: {}
      },
      {
        state: 'NC',
        status: 'complete',
        name: 'North Carolina TANF',
        fullName: 'North Carolina Work First',
        variable: 'nc_tanf',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/nc/ncdhhs/tanf`,
          variables: `${GITHUB_BASE}/variables/gov/states/nc/ncdhhs/tanf`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/nc/ncdhhs/tanf`,
        }
      },
      {
        state: 'NJ',
        status: 'inProgress',
        name: 'New Jersey TANF',
        fullName: 'New Jersey Work First',
        githubLinks: {}
      },
      {
        state: 'TX',
        status: 'inProgress',
        name: 'Texas TANF',
        fullName: 'Texas Temporary Assistance for Needy Families',
        githubLinks: {}
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
    coverage: 'CA, CO, IL, MA, DC, NC',
    stateImplementations: [
      {
        state: 'CA',
        status: 'complete',
        name: 'CalWORKs Childcare',
        fullName: 'California CalWORKs Child Care',
        variable: 'ca_calworks_child_care',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ca/cdss/tanf/child_care`,
          variables: `${GITHUB_BASE}/variables/gov/states/ca/cdss/tanf/child_care`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ca/cdss/tanf/child_care`,
        }
      },
      {
        state: 'CO',
        status: 'complete',
        name: 'CCAP',
        fullName: 'Colorado Child Care Assistance Program',
        notes: 'CCCAP',
        variable: 'co_ccap_subsidy',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/co/ccap`,
          variables: `${GITHUB_BASE}/variables/gov/states/co/ccap`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/co/ccap`,
        }
      },
      {
        state: 'IL',
        status: 'complete',
        name: 'CCAP',
        fullName: 'Child Care Assistance Program (Illinois)',
        notes: 'Only includes eligibility rules',
        variable: 'il_ccap_eligible',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/il/dhs/ccap`,
          variables: `${GITHUB_BASE}/variables/gov/states/il/dhs/ccap`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/il/dhs/ccap`,
        }
      },
      {
        state: 'MA',
        status: 'inProgress',
        name: 'Massachusetts CCFA',
        fullName: 'Massachusetts Child Care Financial Assistance',
        githubLinks: {},
      },
      {
        state: 'DC',
        status: 'complete',
        name: 'DC CCSP',
        fullName: 'DC Child Care Subsidy Program',
        variable: 'dc_ccsp',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/dc/dhs/ccsp`,
          variables: `${GITHUB_BASE}/variables/gov/states/dc/dhs/ccsp`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/dc/dhs/ccsp`,
        }
      },
      {
        state: 'NC',
        status: 'complete',
        name: 'North Carolina SCCA',
        fullName: 'North Carolina Subsidized Child Care Assistance',
        variable: 'nc_scca',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/nc/ncdhhs/scca`,
          variables: `${GITHUB_BASE}/variables/gov/states/nc/ncdhhs/scca`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/nc/ncdhhs/scca`,
        }
      },
    ],
    githubLinks: {},
  },
  {
    id: 'head_start',
    name: 'Head Start',
    fullName: 'Head Start / Early Head Start',
    agency: 'HHS',
    status: 'partial',
    coverage: 'US',
    notes: 'Currently adding immigration rules',
    variable: 'head_start',
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
        githubLinks: {},
      },
      {
        state: 'DC',
        status: 'complete',
        name: 'DC LIHEAP',
        fullName: 'DC Low Income Home Energy Assistance Program',
        variable: 'dc_liheap',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/dc/doee/liheap`,
          variables: `${GITHUB_BASE}/variables/gov/states/dc/doee/liheap`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/dc/doee/liheap`,
        }
      },
      {
        state: 'MA',
        status: 'complete',
        name: 'Massachusetts LIHEAP',
        fullName: 'Massachusetts Low Income Home Energy Assistance Program',
        variable: 'ma_liheap',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ma/doer/liheap`,
          variables: `${GITHUB_BASE}/variables/gov/states/ma/doer/liheap`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ma/doer/liheap`,
        }
      },
      {
        state: 'IL',
        status: 'inProgress',
        name: 'Illinois LIHEAP',
        fullName: 'Illinois Low Income Home Energy Assistance Program',
        variable: 'il_liheap',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/il/dceo/liheap`,
          variables: `${GITHUB_BASE}/variables/gov/states/il/dceo/liheap`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/il/dceo/liheap`,
        }
      },
    ],
    githubLinks: {},
  },

  // SSA Programs
  {
    id: 'ssi',
    name: 'SSI',
    fullName: 'Supplemental Security Income',
    agency: 'SSA',
    status: 'complete',
    coverage: 'US',
    variable: 'ssi',
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
    coverage: 'CA, CO, MA, IL',
    stateImplementations: [
      {
        state: 'CA',
        status: 'complete',
        name: 'California SSP',
        fullName: 'California State Supplementary Payment',
        variable: 'ca_state_supplement',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ca/cdss/state_supplement`,
          variables: `${GITHUB_BASE}/variables/gov/states/ca/cdss/state_supplement`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ca/cdss/state_supplement`,
        }
      },
      {
        state: 'CO',
        status: 'complete',
        name: 'Colorado SSP',
        fullName: 'Colorado State Supplementary Payment',
        variable: 'co_state_supplement',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/co/ssa/state_supplement`,
          variables: `${GITHUB_BASE}/variables/gov/states/co/ssa/state_supplement`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/co/ssa/state_supplement`,
        }
      },
      {
        state: 'MA',
        status: 'complete',
        name: 'Massachusetts SSP',
        fullName: 'Massachusetts State Supplementary Payment',
        variable: 'ma_state_supplement',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/ma/dta/ssp`,
          variables: `${GITHUB_BASE}/variables/gov/states/ma/dta/ssp`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/ma/dta/ssp`,
        }
      },
      {
        state: 'IL',
        status: 'complete',
        name: 'Illinois AABD',
        fullName: 'Illinois Aid to the Aged, Blind or Disabled',
        variable: 'il_aabd',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/states/il/dhs/aabd`,
          variables: `${GITHUB_BASE}/variables/gov/states/il/dhs/aabd`,
          tests: `${TESTS_BASE}/policy/baseline/gov/states/il/dhs/aabd`,
        }
      },
    ],
    githubLinks: {},
  },

  // HUD Programs
  {
    id: 'section_8',
    name: 'Section 8',
    fullName: 'Housing Choice Voucher Program',
    agency: 'HUD',
    status: 'inProgress',
    variable: 'hud_hap',
    notes: 'National rules; only have AMI for Los Angeles County and Colorado. Illinois, Massachusetts in progress',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hud`,
      variables: `${GITHUB_BASE}/variables/gov/hud`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hud`,
    },
  },

  // FCC Programs
  {
    id: 'lifeline',
    name: 'Lifeline',
    fullName: '',
    agency: 'FCC',
    status: 'complete',
    coverage: 'US',
    variable: 'lifeline',
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
    variable: 'pell_grant',
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
    variable: 'energy_efficient_home_improvement_credit',
    notes: 'High efficiency electric home rebate, residential efficiency electrification rebate',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/irs/credits`,
      variables: `${GITHUB_BASE}/variables/gov/irs/credits`,
      tests: `${TESTS_BASE}/policy/baseline/gov/irs/credits`,
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
    variable: 'co_oap',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/co/ssa/oap`,
      variables: `${GITHUB_BASE}/variables/gov/states/co/ssa/oap`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/co/ssa/oap`,
    },
  },
  {
    id: 'co_chp',
    name: 'Colorado CHP',
    fullName: 'Colorado Child Health Plan Plus',
    agency: 'State',
    status: 'complete',
    coverage: 'CO',
    variable: 'co_chp',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/co/hcpf/chp`,
      variables: `${GITHUB_BASE}/variables/gov/states/co/hcpf/chp`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/co/hcpf/chp`,
    },
  },
  {
    id: 'dc_power',
    name: 'DC Power',
    fullName: 'DC Program on Work, Employment, and Responsibility',
    agency: 'State',
    status: 'complete',
    coverage: 'DC',
    variable: 'dc_power',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/dc/dhc/power`,
      variables: `${GITHUB_BASE}/variables/gov/states/dc/dhc/power`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/dc/dhc/power`,
    },
  },
  {
    id: 'dc_gac',
    name: 'DC GAC',
    fullName: 'DC General Assistance for Children',
    agency: 'State',
    status: 'complete',
    coverage: 'DC',
    variable: 'dc_gac',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/dc/dhc/gac`,
      variables: `${GITHUB_BASE}/variables/gov/states/dc/dhc/gac`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/dc/dhc/gac`,
    },
  },
  {
    id: 'ca_cvrp',
    name: 'California CVRP',
    fullName: 'California Clean Vehicle Rebate Project',
    agency: 'State',
    status: 'complete',
    coverage: 'CA',
    variable: 'ca_cvrp',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/ca/calepa/carb/cvrp`,
      variables: `${GITHUB_BASE}/variables/gov/states/ca/calepa/carb/cvrp`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ca/calepa/carb/cvrp`,
    },
  },
  {
    id: 'ca_capi',
    name: 'California CAPI',
    fullName: 'California Cash Assistance Program for Immigrants',
    agency: 'State',
    status: 'complete',
    coverage: 'CA',
    variable: 'ca_capi',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/ca/cdss/capi`,
      variables: `${GITHUB_BASE}/variables/gov/states/ca/cdss/capi`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ca/cdss/capi`,
    },
  },
  {
    id: 'care',
    name: 'California CARE',
    fullName: 'California Alternate Rates for Energy',
    agency: 'State',
    status: 'complete',
    coverage: 'CA',
    variable: 'ca_care',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/ca/cpuc/care`,
      variables: `${GITHUB_BASE}/variables/gov/states/ca/cpuc/care`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ca/cpuc/care`,
    },
  },
  {
    id: 'fera',
    name: 'California FERA',
    fullName: 'Family Electric Rate Assistance Program',
    agency: 'State',
    status: 'complete',
    coverage: 'CA',
    variable: 'ca_fera',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/ca/cpuc/fera`,
      variables: `${GITHUB_BASE}/variables/gov/states/ca/cpuc/fera`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ca/cpuc/fera`,
    },
  },
  {
    id: 'il_bap',
    name: 'Illinois BAP',
    fullName: 'Illinois Chicago Department of Aging Benefit Access Program',
    agency: 'Local',
    status: 'complete',
    coverage: 'Chicago',
    variable: 'il_bap_eligible',
    notes: 'Only includes eligibility rules',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/il/idoa/bap`,
      variables: `${GITHUB_BASE}/variables/gov/states/il/idoa/bap`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/il/idoa/bap`,
    },
  },
  {
    id: 'il_cta_benefit',
    name: 'Illinois CTA Benefit',
    fullName: 'Illinois Chicago Transit Authority Benefit',
    agency: 'Local',
    status: 'complete',
    coverage: 'Chicago',
    variable: 'il_cta_benefit',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/il/rta/cta`,
      variables: `${GITHUB_BASE}/variables/gov/states/il/rta/cta`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/il/rta/cta`,
    },
  },
  {
    id: 'ne_childcare',
    name: 'Nebraska Child Care Subsidy',
    fullName: '',
    agency: 'State',
    status: 'complete',
    coverage: 'NE',
    variable: 'ne_child_care_subsidy',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/ne/dhhs/child_care_subsidy`,
      variables: `${GITHUB_BASE}/variables/gov/states/ne/dhhs/child_care_subsidy`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ne/dhhs/child_care_subsidy`,
    },
  },
  {
    id: 'mbta_reduced_fare',
    name: 'MBTA Reduced Fare',
    fullName: 'Massachusetts Bay Transportation Authority Reduced Fare Program',
    agency: 'State',
    status: 'complete',
    notes: 'Includes eligiblity rules for the Reduced Fares, Tap Charlie Card, and Senior Charlie Card Program',
    coverage: 'MA',
    variable: 'ma_mbta_income_eligible_reduced_fare_eligible',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/ma/dot/mbta`,
      variables: `${GITHUB_BASE}/variables/gov/states/ma/dot/mbta`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ma/dot/mbta`,
    },
  },
  {
    id: 'ny_drive_clean_rebate',
    name: 'NY Drive Clean Rebate',
    fullName: '',
    agency: 'State',
    status: 'complete',
    coverage: 'NY',
    variable: 'ny_drive_clean_rebate',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/ny/nyserda/drive_clean`,
      variables: `${GITHUB_BASE}/variables/gov/states/ny/nyserda/drive_clean`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/ny/nyserda/drive_clean`,
    },
  },
  {
    id: 'tx_dart_benefit',
    name: 'Texas DART',
    fullName: '',
    agency: 'Local',
    status: 'complete',
    coverage: 'Dallas County',
    variable: 'tx_dart_benefit_person',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/states/tx/dart`,
      variables: `${GITHUB_BASE}/variables/gov/states/tx/dart`,
      tests: `${TESTS_BASE}/policy/baseline/gov/states/tx/dart`,
    },
  },

  // Local Programs
  {
    id: 'ez_save',
    name: 'Los Angeles County EZ Save',
    fullName: '',
    agency: 'Local',
    status: 'complete',
    coverage: 'Los Angeles County',
    variable: 'ca_la_ez_save',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/ca/la/dwp/ez_save`,
      variables: `${GITHUB_BASE}/variables/gov/local/ca/la/dwp/ez_save`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/ca/la/dwp/ez_save`,
    },
  },
  {
    id: 'la_infant_supplement',
    name: 'Los Angeles County Infant Supplement',
    fullName: '',
    agency: 'Local',
    status: 'complete',
    coverage: 'Los Angeles County',
    variable: 'ca_la_infant_supplement',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/ca/la/dss/infant_supplement`,
      variables: `${GITHUB_BASE}/variables/gov/local/ca/la/dss/infant_supplement`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/ca/la/dss/infant_supplement`,
    },
  },
  {
    id: 'la_expectant_parent',
    name: 'Los Angeles County expectant parent payment',
    fullName: '',
    agency: 'Local',
    status: 'complete',
    coverage: 'Los Angeles County',
    variable: 'ca_la_expectant_parent_payment',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/ca/la/dss/expectant_parent`,
      variables: `${GITHUB_BASE}/variables/gov/local/ca/la/dss/expectant_parent`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/ca/la/dss/expectant_parent`,
    },
  },
  {
    id: 'la_general_relief',
    name: 'Los Angeles County General Relief',
    fullName: '',
    agency: 'Local',
    status: 'complete',
    coverage: 'Los Angeles County',
    variable: 'la_general_relief',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/ca/la/general_relief`,
      variables: `${GITHUB_BASE}/variables/gov/local/ca/la/general_relief`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/ca/la/general_relief`,
    },
  },
  {
    id: 'ca_riv_general_relief',
    name: 'Riverside County General Relief',
    fullName: '',
    agency: 'Local',
    status: 'complete',
    coverage: 'Riverside County',
    variable: 'ca_riv_general_relief',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/ca/riv/general_relief`,
      variables: `${GITHUB_BASE}/variables/gov/local/ca/riv/general_relief`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/ca/riv/general_relief`,
    },
  },
  {
    id: 'ca_riv_liheap',
    name: 'Riverside County LIHEAP',
    fullName: '',
    agency: 'Local',
    status: 'complete',
    coverage: 'Riverside County',
    notes: 'Only includes eligibility rules',
    variable: 'ca_riv_liheap_eligible',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/ca/riv/liheap`,
      variables: `${GITHUB_BASE}/variables/gov/local/ca/riv/liheap`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/ca/riv/liheap`,
    },
  },
  {
    id: 'share',
    name: 'Riverside County SHARE',
    fullName: 'Riverside County Sharing Households Assist Riverside Energy program',
    agency: 'Local',
    status: 'complete',
    coverage: 'Riverside County',
    variable: 'ca_riv_share_payment',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/ca/riv/share`,
      variables: `${GITHUB_BASE}/variables/gov/local/ca/riv/share`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/ca/riv/share`,
    },
  },
  {
    id: 'ca_ala_general_assistance',
    name: 'Alameda County General Assistance',
    fullName: '',
    agency: 'Local',
    status: 'complete',
    coverage: 'Alameda County',
    variable: 'ca_ala_general_assistance',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/local/ca/ala/ga`,
      variables: `${GITHUB_BASE}/variables/gov/local/ca/ala/ga`,
      tests: `${TESTS_BASE}/policy/baseline/gov/local/ca/ala/ga`,
    },
  },

  // Other Programs
  {
    id: 'chapter_7_bankruptcy',
    name: 'Chapter 7 Bankruptcy',
    fullName: '',
    category: 'Legal',
    status: 'inProgress',
    coverage: 'US',
    githubLinks: {},
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