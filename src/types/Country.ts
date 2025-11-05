export type CountryCode = 'us' | 'canada' | 'uk';

export interface Jurisdiction {
  code: string;
  name: string;
}

export interface Country {
  code: CountryCode;
  name: string;
  fullName: string;
  repoName: string;
  githubBase: string;
  testsBase: string;
  jurisdictions: Jurisdiction[];
  federalLabel: string; // "Federal", "National", etc.
  regionalLabel: string; // "State", "Province", "Country"
  agencies: string[]; // Available agencies for filtering
}

export const COUNTRIES: Record<CountryCode, Country> = {
  us: {
    code: 'us',
    name: 'United States',
    fullName: 'United States',
    repoName: 'policyengine-us',
    githubBase: 'https://github.com/PolicyEngine/policyengine-us/tree/master/policyengine_us',
    testsBase: 'https://github.com/PolicyEngine/policyengine-us/tree/master/policyengine_us/tests',
    jurisdictions: [
      { code: 'AL', name: 'Alabama' },
      { code: 'AK', name: 'Alaska' },
      { code: 'AZ', name: 'Arizona' },
      { code: 'AR', name: 'Arkansas' },
      { code: 'CA', name: 'California' },
      { code: 'CO', name: 'Colorado' },
      { code: 'CT', name: 'Connecticut' },
      { code: 'DE', name: 'Delaware' },
      { code: 'DC', name: 'District of Columbia' },
      { code: 'FL', name: 'Florida' },
      { code: 'GA', name: 'Georgia' },
      { code: 'HI', name: 'Hawaii' },
      { code: 'ID', name: 'Idaho' },
      { code: 'IL', name: 'Illinois' },
      { code: 'IN', name: 'Indiana' },
      { code: 'IA', name: 'Iowa' },
      { code: 'KS', name: 'Kansas' },
      { code: 'KY', name: 'Kentucky' },
      { code: 'LA', name: 'Louisiana' },
      { code: 'ME', name: 'Maine' },
      { code: 'MD', name: 'Maryland' },
      { code: 'MA', name: 'Massachusetts' },
      { code: 'MI', name: 'Michigan' },
      { code: 'MN', name: 'Minnesota' },
      { code: 'MS', name: 'Mississippi' },
      { code: 'MO', name: 'Missouri' },
      { code: 'MT', name: 'Montana' },
      { code: 'NE', name: 'Nebraska' },
      { code: 'NV', name: 'Nevada' },
      { code: 'NH', name: 'New Hampshire' },
      { code: 'NJ', name: 'New Jersey' },
      { code: 'NM', name: 'New Mexico' },
      { code: 'NY', name: 'New York' },
      { code: 'NC', name: 'North Carolina' },
      { code: 'ND', name: 'North Dakota' },
      { code: 'OH', name: 'Ohio' },
      { code: 'OK', name: 'Oklahoma' },
      { code: 'OR', name: 'Oregon' },
      { code: 'PA', name: 'Pennsylvania' },
      { code: 'RI', name: 'Rhode Island' },
      { code: 'SC', name: 'South Carolina' },
      { code: 'SD', name: 'South Dakota' },
      { code: 'TN', name: 'Tennessee' },
      { code: 'TX', name: 'Texas' },
      { code: 'UT', name: 'Utah' },
      { code: 'VT', name: 'Vermont' },
      { code: 'VA', name: 'Virginia' },
      { code: 'WA', name: 'Washington' },
      { code: 'WV', name: 'West Virginia' },
      { code: 'WI', name: 'Wisconsin' },
      { code: 'WY', name: 'Wyoming' },
    ],
    federalLabel: 'Federal',
    regionalLabel: 'State',
    agencies: ['USDA', 'HHS', 'SSA', 'IRS', 'HUD', 'DOE', 'ED', 'DOL', 'FCC', 'ACA'],
  },
  canada: {
    code: 'canada',
    name: 'Canada',
    fullName: 'Canada',
    repoName: 'policyengine-canada',
    githubBase: 'https://github.com/PolicyEngine/policyengine-canada/tree/master/policyengine_canada',
    testsBase: 'https://github.com/PolicyEngine/policyengine-canada/tree/master/policyengine_canada/tests',
    jurisdictions: [
      { code: 'AB', name: 'Alberta' },
      { code: 'BC', name: 'British Columbia' },
      { code: 'MB', name: 'Manitoba' },
      { code: 'NB', name: 'New Brunswick' },
      { code: 'NL', name: 'Newfoundland and Labrador' },
      { code: 'NS', name: 'Nova Scotia' },
      { code: 'NT', name: 'Northwest Territories' },
      { code: 'NU', name: 'Nunavut' },
      { code: 'ON', name: 'Ontario' },
      { code: 'PE', name: 'Prince Edward Island' },
      { code: 'QC', name: 'Quebec' },
      { code: 'SK', name: 'Saskatchewan' },
      { code: 'YT', name: 'Yukon' },
    ],
    federalLabel: 'Federal',
    regionalLabel: 'Province',
    agencies: ['CRA', 'ESDC'],
  },
  uk: {
    code: 'uk',
    name: 'United Kingdom',
    fullName: 'United Kingdom',
    repoName: 'policyengine-uk',
    githubBase: 'https://github.com/PolicyEngine/policyengine-uk/tree/master/policyengine_uk',
    testsBase: 'https://github.com/PolicyEngine/policyengine-uk/tree/master/policyengine_uk/tests',
    jurisdictions: [
      { code: 'GB-ENG', name: 'England' },
      { code: 'GB-SCT', name: 'Scotland' },
      { code: 'GB-WLS', name: 'Wales' },
      { code: 'GB-NIR', name: 'Northern Ireland' },
    ],
    federalLabel: 'National',
    regionalLabel: 'Country',
    agencies: ['DWP', 'HMRC', 'DfE'],
  },
};
