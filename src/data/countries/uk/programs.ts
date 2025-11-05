import { Program, CoverageStatus } from '../../../types/Program';

const GITHUB_BASE = 'https://github.com/PolicyEngine/policyengine-uk/tree/master/policyengine_uk';
const TESTS_BASE = 'https://github.com/PolicyEngine/policyengine-uk/tree/master/policyengine_uk/tests';

export const ukPrograms: Program[] = [
  // DWP (Department for Work and Pensions) - National Programs
  {
    id: 'universal_credit',
    name: 'Universal Credit',
    fullName: 'Universal Credit',
    agency: 'DWP',
    status: 'complete',
    coverage: 'UK',
    variable: 'universal_credit',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/dwp/universal_credit`,
      variables: `${GITHUB_BASE}/variables/gov/dwp/universal_credit`,
      tests: `${TESTS_BASE}/policy/baseline/gov/dwp/universal_credit`,
    },
  },
  {
    id: 'pension_credit',
    name: 'Pension Credit',
    fullName: 'Pension Credit',
    agency: 'DWP',
    status: 'complete',
    coverage: 'UK',
    variable: 'pension_credit',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/dwp/pension_credit`,
      variables: `${GITHUB_BASE}/variables/gov/dwp/pension_credit`,
      tests: `${TESTS_BASE}/policy/baseline/gov/dwp/pension_credit`,
    },
  },
  {
    id: 'pip',
    name: 'PIP',
    fullName: 'Personal Independence Payment',
    agency: 'DWP',
    status: 'complete',
    coverage: 'UK',
    variable: 'pip',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/dwp/pip`,
      variables: `${GITHUB_BASE}/variables/gov/dwp/pip`,
      tests: `${TESTS_BASE}/policy/baseline/gov/dwp/pip`,
    },
  },
  {
    id: 'housing_benefit',
    name: 'Housing Benefit',
    fullName: 'Housing Benefit',
    agency: 'DWP',
    status: 'complete',
    coverage: 'UK',
    variable: 'housing_benefit',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/dwp/housing_benefit`,
      variables: `${GITHUB_BASE}/variables/gov/dwp/housing_benefit`,
      tests: `${TESTS_BASE}/policy/baseline/gov/dwp/housing_benefit`,
    },
  },
  {
    id: 'esa',
    name: 'ESA',
    fullName: 'Employment and Support Allowance',
    agency: 'DWP',
    status: 'complete',
    coverage: 'UK',
    variable: 'esa',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/dwp/esa`,
      variables: `${GITHUB_BASE}/variables/gov/dwp/esa`,
      tests: `${TESTS_BASE}/policy/baseline/gov/dwp/esa`,
    },
  },
  {
    id: 'jsa',
    name: 'JSA',
    fullName: 'Jobseeker\'s Allowance',
    agency: 'DWP',
    status: 'complete',
    coverage: 'UK',
    variable: 'jsa',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/dwp/jsa`,
      variables: `${GITHUB_BASE}/variables/gov/dwp/jsa`,
      tests: `${TESTS_BASE}/policy/baseline/gov/dwp/jsa`,
    },
  },
  {
    id: 'carers_allowance',
    name: 'Carer\'s Allowance',
    fullName: 'Carer\'s Allowance',
    agency: 'DWP',
    status: 'complete',
    coverage: 'UK',
    variable: 'carers_allowance',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/dwp/carers_allowance`,
      variables: `${GITHUB_BASE}/variables/gov/dwp/carers_allowance`,
      tests: `${TESTS_BASE}/policy/baseline/gov/dwp/carers_allowance`,
    },
  },

  // HMRC (Her Majesty's Revenue and Customs) - National Programs
  {
    id: 'income_tax',
    name: 'Income Tax',
    fullName: 'Income Tax',
    agency: 'HMRC',
    status: 'complete',
    coverage: 'UK',
    category: 'Taxes',
    variable: 'income_tax',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hmrc/income_tax`,
      variables: `${GITHUB_BASE}/variables/gov/hmrc/income_tax`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hmrc/income_tax`,
    },
  },
  {
    id: 'national_insurance',
    name: 'National Insurance',
    fullName: 'National Insurance',
    agency: 'HMRC',
    status: 'complete',
    coverage: 'UK',
    category: 'Taxes',
    variable: 'national_insurance',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hmrc/national_insurance`,
      variables: `${GITHUB_BASE}/variables/gov/hmrc/national_insurance`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hmrc/national_insurance`,
    },
  },
  {
    id: 'child_benefit',
    name: 'Child Benefit',
    fullName: 'Child Benefit',
    agency: 'HMRC',
    status: 'complete',
    coverage: 'UK',
    variable: 'child_benefit',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hmrc/child_benefit`,
      variables: `${GITHUB_BASE}/variables/gov/hmrc/child_benefit`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hmrc/child_benefit`,
    },
  },
  {
    id: 'working_tax_credit',
    name: 'Working Tax Credit',
    fullName: 'Working Tax Credit',
    agency: 'HMRC',
    status: 'complete',
    coverage: 'UK',
    variable: 'working_tax_credit',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hmrc/working_tax_credit`,
      variables: `${GITHUB_BASE}/variables/gov/hmrc/working_tax_credit`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hmrc/working_tax_credit`,
    },
  },
  {
    id: 'child_tax_credit',
    name: 'Child Tax Credit',
    fullName: 'Child Tax Credit',
    agency: 'HMRC',
    status: 'complete',
    coverage: 'UK',
    variable: 'child_tax_credit',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/hmrc/child_tax_credit`,
      variables: `${GITHUB_BASE}/variables/gov/hmrc/child_tax_credit`,
      tests: `${TESTS_BASE}/policy/baseline/gov/hmrc/child_tax_credit`,
    },
  },

  // DfE (Department for Education) - National Programs
  {
    id: 'free_school_meals',
    name: 'Free School Meals',
    fullName: 'Free School Meals',
    agency: 'DfE',
    status: 'complete',
    coverage: 'UK',
    variable: 'free_school_meals',
    githubLinks: {
      parameters: `${GITHUB_BASE}/parameters/gov/dfe/free_school_meals`,
      variables: `${GITHUB_BASE}/variables/gov/dfe/free_school_meals`,
      tests: `${TESTS_BASE}/policy/baseline/gov/dfe/free_school_meals`,
    },
  },

  // Scottish Social Security - Devolved Programs
  {
    id: 'scottish_child_payment',
    name: 'Scottish Child Payment',
    fullName: 'Scottish Child Payment',
    agency: 'Scottish Government',
    status: 'complete',
    coverage: 'GB-SCT',
    stateImplementations: [
      {
        state: 'GB-SCT',
        status: 'complete',
        name: 'Scottish Child Payment',
        fullName: 'Scottish Child Payment',
        variable: 'scottish_child_payment',
        githubLinks: {
          parameters: `${GITHUB_BASE}/parameters/gov/scotland/social_security/scottish_child_payment`,
          variables: `${GITHUB_BASE}/variables/gov/scotland/social_security/scottish_child_payment`,
          tests: `${TESTS_BASE}/policy/baseline/gov/scotland/social_security/scottish_child_payment`,
        },
      },
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

  ukPrograms.forEach((program) => {
    statusCount[program.status]++;
  });

  return statusCount;
}
