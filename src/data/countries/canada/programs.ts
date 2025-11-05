import { Program, CoverageStatus } from '../../../types/Program';

const GITHUB_BASE = 'https://github.com/PolicyEngine/policyengine-canada/tree/master/policyengine_canada';
const TESTS_BASE = 'https://github.com/PolicyEngine/policyengine-canada/tree/master/policyengine_canada/tests';

export const canadaPrograms: Program[] = [
  // Federal Programs - CRA (Canada Revenue Agency)
  {
    id: 'ccb',
    name: 'CCB',
    fullName: 'Canada Child Benefit',
    agency: 'CRA',
    status: 'complete',
    coverage: 'Canada',
    variable: 'ccb',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/cra/ccb`,
      variables: `${GITHUB_BASE}/variables/gov/cra/ccb`,
      tests: `${TESTS_BASE}/policy/baseline/gov/cra/ccb`,
    },
  },
  {
    id: 'cwb',
    name: 'CWB',
    fullName: 'Canada Workers Benefit',
    agency: 'CRA',
    status: 'complete',
    coverage: 'Canada',
    variable: 'cwb',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/cra/cwb`,
      variables: `${GITHUB_BASE}/variables/gov/cra/cwb`,
      tests: `${TESTS_BASE}/policy/baseline/gov/cra/cwb`,
    },
  },
  {
    id: 'cdb',
    name: 'CDB',
    fullName: 'Child Disability Benefit',
    agency: 'CRA',
    status: 'complete',
    coverage: 'Canada',
    variable: 'cdb',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/cra/cdb`,
      variables: `${GITHUB_BASE}/variables/gov/cra/cdb`,
      tests: `${TESTS_BASE}/policy/baseline/gov/cra/cdb`,
    },
  },
  {
    id: 'gst_credit',
    name: 'GST Credit',
    fullName: 'Goods and Services Tax Credit',
    agency: 'CRA',
    status: 'complete',
    coverage: 'Canada',
    variable: 'gst_credit',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/cra/credits/gst`,
      variables: `${GITHUB_BASE}/variables/gov/cra/credits/gst`,
      tests: `${TESTS_BASE}/policy/baseline/gov/cra/credits/gst`,
    },
  },
  {
    id: 'federal_income_tax',
    name: 'Federal Income Tax',
    fullName: 'Federal Income Tax',
    agency: 'CRA',
    status: 'complete',
    coverage: 'Canada',
    category: 'Taxes',
    variable: 'federal_income_tax',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/cra/tax`,
      variables: `${GITHUB_BASE}/variables/gov/cra/tax`,
      tests: `${TESTS_BASE}/policy/baseline/gov/cra/tax`,
    },
  },

  // Federal Programs - ESDC (Employment and Social Development Canada)
  {
    id: 'oas',
    name: 'OAS',
    fullName: 'Old Age Security',
    agency: 'ESDC',
    status: 'complete',
    coverage: 'Canada',
    variable: 'oas',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/esdc/oas`,
      variables: `${GITHUB_BASE}/variables/gov/esdc/oas`,
      tests: `${TESTS_BASE}/policy/baseline/gov/esdc/oas`,
    },
  },
  {
    id: 'gis',
    name: 'GIS',
    fullName: 'Guaranteed Income Supplement',
    agency: 'ESDC',
    status: 'complete',
    coverage: 'Canada',
    variable: 'gis',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/esdc/gis`,
      variables: `${GITHUB_BASE}/variables/gov/esdc/gis`,
      tests: `${TESTS_BASE}/policy/baseline/gov/esdc/gis`,
    },
  },
  {
    id: 'cpp',
    name: 'CPP',
    fullName: 'Canada Pension Plan',
    agency: 'ESDC',
    status: 'partial',
    coverage: 'Canada',
    notes: 'Contributions implemented, benefits in progress',
    variable: 'cpp',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/esdc/cpp`,
      variables: `${GITHUB_BASE}/variables/gov/esdc/cpp`,
      tests: `${TESTS_BASE}/policy/baseline/gov/esdc/cpp`,
    },
  },
  {
    id: 'ei',
    name: 'EI',
    fullName: 'Employment Insurance',
    agency: 'ESDC',
    status: 'partial',
    coverage: 'Canada',
    notes: 'Premiums implemented, benefits in progress',
    variable: 'ei',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/esdc/ei`,
      variables: `${GITHUB_BASE}/variables/gov/esdc/ei`,
      tests: `${TESTS_BASE}/policy/baseline/gov/esdc/ei`,
    },
  },

  // Provincial Programs - Alberta
  {
    id: 'ab_cfb',
    name: 'Alberta CFB',
    fullName: 'Alberta Child and Family Benefit',
    agency: 'Province',
    status: 'complete',
    coverage: 'AB',
    stateImplementations: [
      {
        state: 'AB',
        status: 'complete',
        name: 'Alberta CFB',
        fullName: 'Alberta Child and Family Benefit',
        variable: 'ab_cfb',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/provinces/ab/cfb`,
          variables: `${GITHUB_BASE}/variables/gov/provinces/ab/cfb`,
          tests: `${TESTS_BASE}/policy/baseline/gov/provinces/ab/cfb`,
        },
      },
    ],
    githubLinks: {},
  },

  // Provincial Programs - British Columbia
  {
    id: 'bc_fb',
    name: 'BC Family Benefit',
    fullName: 'British Columbia Family Benefit',
    agency: 'Province',
    status: 'complete',
    coverage: 'BC',
    stateImplementations: [
      {
        state: 'BC',
        status: 'complete',
        name: 'BC Family Benefit',
        fullName: 'British Columbia Family Benefit',
        variable: 'bc_fb',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/provinces/bc/fb`,
          variables: `${GITHUB_BASE}/variables/gov/provinces/bc/fb`,
          tests: `${TESTS_BASE}/policy/baseline/gov/provinces/bc/fb`,
        },
      },
    ],
    githubLinks: {},
  },

  // Provincial Programs - Ontario
  {
    id: 'on_cb',
    name: 'Ontario Child Benefit',
    fullName: 'Ontario Child Benefit',
    agency: 'Province',
    status: 'complete',
    coverage: 'ON',
    stateImplementations: [
      {
        state: 'ON',
        status: 'complete',
        name: 'Ontario Child Benefit',
        fullName: 'Ontario Child Benefit',
        variable: 'on_cb',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/provinces/on/cb`,
          variables: `${GITHUB_BASE}/variables/gov/provinces/on/cb`,
          tests: `${TESTS_BASE}/policy/baseline/gov/provinces/on/cb`,
        },
      },
    ],
    githubLinks: {},
  },
  {
    id: 'on_trillium',
    name: 'Ontario Trillium Benefit',
    fullName: 'Ontario Trillium Benefit',
    agency: 'Province',
    status: 'complete',
    coverage: 'ON',
    stateImplementations: [
      {
        state: 'ON',
        status: 'complete',
        name: 'Ontario Trillium Benefit',
        fullName: 'Ontario Trillium Benefit',
        variable: 'on_trillium',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/provinces/on/trillium`,
          variables: `${GITHUB_BASE}/variables/gov/provinces/on/trillium`,
          tests: `${TESTS_BASE}/policy/baseline/gov/provinces/on/trillium`,
        },
      },
    ],
    githubLinks: {},
  },

  // Provincial Programs - Quebec
  {
    id: 'qc_solidarity_tax_credit',
    name: 'Quebec Solidarity Tax Credit',
    fullName: 'Quebec Solidarity Tax Credit',
    agency: 'Province',
    status: 'partial',
    coverage: 'QC',
    stateImplementations: [
      {
        state: 'QC',
        status: 'partial',
        name: 'Quebec Solidarity Tax Credit',
        fullName: 'Quebec Solidarity Tax Credit',
        variable: 'qc_solidarity_tax_credit',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/provinces/qc/solidarity_tax_credit`,
          variables: `${GITHUB_BASE}/variables/gov/provinces/qc/solidarity_tax_credit`,
          tests: `${TESTS_BASE}/policy/baseline/gov/provinces/qc/solidarity_tax_credit`,
        },
      },
    ],
    githubLinks: {},
  },

  // Provincial Programs - Saskatchewan
  {
    id: 'sk_affordability',
    name: 'Saskatchewan Affordability Fund',
    fullName: 'Saskatchewan Affordability Fund',
    agency: 'Province',
    status: 'complete',
    coverage: 'SK',
    stateImplementations: [
      {
        state: 'SK',
        status: 'complete',
        name: 'Saskatchewan Affordability Fund',
        fullName: 'Saskatchewan Affordability Fund',
        variable: 'sk_affordability',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/provinces/sk/affordability`,
          variables: `${GITHUB_BASE}/variables/gov/provinces/sk/affordability`,
          tests: `${TESTS_BASE}/policy/baseline/gov/provinces/sk/affordability`,
        },
      },
    ],
    githubLinks: {},
  },

  // Provincial Programs - Manitoba
  {
    id: 'mb_cb',
    name: 'Manitoba Child Benefit',
    fullName: 'Manitoba Child Benefit',
    agency: 'Province',
    status: 'complete',
    coverage: 'MB',
    stateImplementations: [
      {
        state: 'MB',
        status: 'complete',
        name: 'Manitoba Child Benefit',
        fullName: 'Manitoba Child Benefit',
        variable: 'mb_cb',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/provinces/mb/cb`,
          variables: `${GITHUB_BASE}/variables/gov/provinces/mb/cb`,
          tests: `${TESTS_BASE}/policy/baseline/gov/provinces/mb/cb`,
        },
      },
    ],
    githubLinks: {},
  },

  // Provincial Programs - Nova Scotia
  {
    id: 'ns_afb',
    name: 'Nova Scotia Affordable Living Tax Credit',
    fullName: 'Nova Scotia Affordable Living Tax Credit',
    agency: 'Province',
    status: 'complete',
    coverage: 'NS',
    stateImplementations: [
      {
        state: 'NS',
        status: 'complete',
        name: 'Nova Scotia Affordable Living Tax Credit',
        fullName: 'Nova Scotia Affordable Living Tax Credit',
        variable: 'ns_afb',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/provinces/ns/afb`,
          variables: `${GITHUB_BASE}/variables/gov/provinces/ns/afb`,
          tests: `${TESTS_BASE}/policy/baseline/gov/provinces/ns/afb`,
        },
      },
    ],
    githubLinks: {},
  },

  // Provincial Programs - New Brunswick
  {
    id: 'nb_cwb_supplement',
    name: 'NB CWB Supplement',
    fullName: 'New Brunswick Workers Benefit Supplement',
    agency: 'Province',
    status: 'complete',
    coverage: 'NB',
    stateImplementations: [
      {
        state: 'NB',
        status: 'complete',
        name: 'NB CWB Supplement',
        fullName: 'New Brunswick Workers Benefit Supplement',
        variable: 'nb_cwb_supplement',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/provinces/nb/cwb_supplement`,
          variables: `${GITHUB_BASE}/variables/gov/provinces/nb/cwb_supplement`,
          tests: `${TESTS_BASE}/policy/baseline/gov/provinces/nb/cwb_supplement`,
        },
      },
    ],
    githubLinks: {},
  },

  // Provincial Income Taxes (all provinces)
  {
    id: 'provincial_income_tax',
    name: 'Provincial Income Tax',
    fullName: 'Provincial Income Tax',
    agency: 'Province',
    status: 'complete',
    coverage: 'All provinces',
    category: 'Taxes',
    stateImplementations: [
      { state: 'AB', status: 'complete', name: 'Alberta Income Tax', variable: 'ab_income_tax', githubLinks: {} },
      { state: 'BC', status: 'complete', name: 'BC Income Tax', variable: 'bc_income_tax', githubLinks: {} },
      { state: 'MB', status: 'complete', name: 'Manitoba Income Tax', variable: 'mb_income_tax', githubLinks: {} },
      { state: 'NB', status: 'complete', name: 'New Brunswick Income Tax', variable: 'nb_income_tax', githubLinks: {} },
      { state: 'NL', status: 'complete', name: 'Newfoundland Income Tax', variable: 'nl_income_tax', githubLinks: {} },
      { state: 'NS', status: 'complete', name: 'Nova Scotia Income Tax', variable: 'ns_income_tax', githubLinks: {} },
      { state: 'NT', status: 'complete', name: 'NWT Income Tax', variable: 'nt_income_tax', githubLinks: {} },
      { state: 'NU', status: 'complete', name: 'Nunavut Income Tax', variable: 'nu_income_tax', githubLinks: {} },
      { state: 'ON', status: 'complete', name: 'Ontario Income Tax', variable: 'on_income_tax', githubLinks: {} },
      { state: 'PE', status: 'complete', name: 'PEI Income Tax', variable: 'pe_income_tax', githubLinks: {} },
      { state: 'QC', status: 'complete', name: 'Quebec Income Tax', variable: 'qc_income_tax', githubLinks: {} },
      { state: 'SK', status: 'complete', name: 'Saskatchewan Income Tax', variable: 'sk_income_tax', githubLinks: {} },
      { state: 'YT', status: 'complete', name: 'Yukon Income Tax', variable: 'yt_income_tax', githubLinks: {} },
    ],
    githubLinks: {},
  },
];

export function getStatusCount() {
  const statusCount = {
    complete: 0,
    partial: 0,
    inProgress: 0,
    notStarted: 0,
  };

  canadaPrograms.forEach((program) => {
    statusCount[program.status]++;
  });

  return statusCount;
}
