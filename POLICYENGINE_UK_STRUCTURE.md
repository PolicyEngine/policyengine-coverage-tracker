# PolicyEngine UK Repository Exploration

## 1. Overall Directory Structure

```
policyengine-uk/
├── policyengine_uk/              # Main package directory
│   ├── entities.py               # Defines: State, Household, BenUnit, Person
│   ├── system.py                 # TaxBenefitSystem configuration
│   ├── model_api.py              # Core API exports
│   ├── parameters/               # All tax-benefit system parameters (YAML)
│   ├── variables/                # All calculated variables (Python formulas)
│   ├── reforms/                  # Policy reform definitions
│   ├── tests/                    # Test suite
│   └── utils/                    # Utility functions
├── docs/                         # Documentation
├── setup.py                      # Package setup
└── CHANGELOG.md                  # Version history
```

## 2. Regional/Jurisdictional Breakdown

The UK system recognizes **4 countries** plus **9 English regions**:

### Hierarchy
```
Region (Enum - 13 values)
├── UNKNOWN
├── NORTH_EAST (England)
├── NORTH_WEST (England)
├── YORKSHIRE (England)
├── EAST_MIDLANDS (England)
├── WEST_MIDLANDS (England)
├── EAST_OF_ENGLAND (England)
├── LONDON (England)
├── SOUTH_EAST (England)
├── SOUTH_WEST (England)
├── WALES
├── SCOTLAND
└── NORTHERN_IRELAND
```

### Implementation Pattern
- **Location**: `/variables/household/demographic/geography.py` (Region enum)
- **Location**: `/variables/household/demographic/country.py` (Country derived variable)
- **Derived Country Enum** (ENGLAND, SCOTLAND, WALES, NORTHERN_IRELAND, UNKNOWN)
  - Calculated from region using a select formula
- **BRMA** (Broad Rental Market Area): Additional geographic level for housing benefit
  - Location: `/variables/household/demographic/locations.py` (20KB file with detailed mappings)

### Regional Implementation Examples
```python
# Winter Fuel Allowance (DWP)
in_scotland = (country == "SCOTLAND")
in_england_or_wales = (country == "ENGLAND") | (country == "WALES")

# Scottish Specific Benefits
- Social Security Scotland: pawhp.py (Parent and Widow Housing Payment)
- Revenue Scotland: LBTT taxes (Land and Buildings Transaction Tax)
```

**Key Note**: UK is primarily **national-level** for most benefits with Scotland/Wales/Northern Ireland having devolved specific programs. NOT state-by-state like the US.

## 3. Major Programs/Benefits Implemented

### Department for Work and Pensions (DWP) - 20 Benefits
Located: `/parameters/gov/dwp/` and `/variables/gov/dwp/`

**Major Income Support Benefits:**
1. **Universal Credit** - Primary working-age benefit
   - Files: Multiple sub-modules (standard_allowance, elements/childcare, etc.)
   - Parameters: 15+ parameter files (takeup, rollout, means-tests)

2. **Pension Credit** - Means-tested support for pensioners
   - Parameter: `/parameters/gov/dwp/pension_credit/`

3. **Housing Benefit** - Support for renters (legacy system, being replaced by UC)
   - Local Housing Allowance (LHA) rates by region
   - Parameter: `/parameters/gov/dwp/housing_benefit/`

**Disability & Caring Benefits:**
4. **Personal Independence Payment (PIP)** - Disability support
5. **Disability Living Allowance (DLA)** - Legacy disability benefit
6. **Attendance Allowance** - Support for disabled pensioners
7. **Carers Allowance** - Support for unpaid carers
8. **Severe Disablement Allowance (SDA)** - Legacy benefit

**Employment Benefits:**
9. **Employment Support Allowance (ESA)** - Support for sick/disabled not working
10. **Job Seeker's Allowance (JSA)** - Unemployment support
11. **Income Support (IS)** - Means-tested support for non-working

**Social Protection:**
12. **State Pension** - Basic state pension (with triple-lock uprating)
13. **Constant Attendance Allowance (CAA)** - For severely disabled
14. **Industrial Injuries Disablement Benefit (IIDB)** - Work injuries

**Child Support:**
15. **Child Tax Credit (CTC)** - Legacy child support (replaced by UC child elements)
16. **Working Tax Credit (WTC)** - Legacy work incentive (replaced by UC)

**Winter Support:**
17. **Winter Fuel Payment/Allowance** - Heating cost support
18. **Tax Credits** - Family tax support

**Other Benefits:**
19. **Disability Premium, Carer Premium, etc.** - Means-test add-ons
20. **Benefit Cap** - Benefit aggregation limit

### Her Majesty's Revenue & Customs (HMRC) - Taxes
Located: `/parameters/gov/hmrc/` and `/variables/gov/hmrc/`

**Key Taxes:**
1. **Income Tax** - Progressive income taxation
2. **National Insurance** - Social security contributions
3. **Child Benefit** - Universal support for families with children
4. **VAT** - Value Added Tax (not fully modeled)
5. **Stamp Duty** - Transaction taxes
6. **Capital Gains Tax (CGT)**
7. **Business Rates** - Commercial property tax
8. **Tax-Free Childcare** - Support for childcare costs (limited modeling)

### Department for Education (DfE)
Located: `/parameters/gov/dfe/`

**Education Benefits:**
1. **Universal Childcare Entitlement** - 15-30 hours free childcare
2. **Extended Childcare Entitlement** - Additional hours
3. **Targeted Childcare Entitlement** - For eligible families
4. **Care to Learn** - Childcare for young parents in education

### Scottish-Specific Benefits
Located: `/parameters/gov/social_security_scotland/` and `/variables/gov/social_security_scotland/`

**Programs:**
1. **Parent & Widow(er) Housing Payment (PAWHP)** - Housing support for specific groups

### Other Government Departments
- **DfT** (Department for Transport): Fuel duty, transport support
- **DHSC** (Department of Health & Social Care): Health-related costs
- **WRA** (Welsh Revenue Authority): Wales-specific taxes
- **Revenue Scotland**: Scottish taxes
- **DCMS** (Department for Culture, Media & Sport): TV licence, arts funding
- **Local Authorities**: Council tax, rates

## 4. Parameters Folder Structure

### Organization Pattern
```
parameters/
├── gov/                           # Government-wide parameters
│   ├── dwp/                       # Department for Work & Pensions
│   │   ├── universal_credit/
│   │   │   ├── standard_allowance/
│   │   │   │   ├── amount.yaml
│   │   │   │   ├── claimant_type/
│   │   │   │   └── README.md
│   │   │   ├── elements/          # UC components (housing, childcare, etc.)
│   │   │   │   ├── housing/
│   │   │   │   ├── childcare/
│   │   │   │   ├── disabled/
│   │   │   │   └── child/
│   │   │   ├── takeup_rate.yaml
│   │   │   └── README.md
│   │   ├── pension_credit/
│   │   ├── housing_benefit/
│   │   ├── state_pension/
│   │   │   └── triple_lock/       # Special triple-lock uprating
│   │   ├── tax_credits/
│   │   ├── [18 other benefits]/
│   │   └── benefit_cap.yaml
│   │
│   ├── hmrc/                      # Tax system
│   │   ├── income_tax/
│   │   ├── national_insurance/
│   │   ├── child_benefit/
│   │   ├── stamp_duty/
│   │   ├── cgt/
│   │   ├── business_rates/
│   │   ├── fuel_duty/
│   │   ├── vat/
│   │   └── minimum_wage.yaml
│   │
│   ├── dfe/                       # Education
│   │   ├── universal_childcare_entitlement/
│   │   ├── extended_childcare_entitlement/
│   │   ├── targeted_childcare_entitlement/
│   │   └── care_to_learn/
│   │
│   ├── social_security_scotland/
│   ├── revenue_scotland/
│   ├── wra/                       # Welsh Revenue Authority
│   ├── dft/                       # Transport
│   ├── dhsc/                      # Health & Social Care
│   ├── dcms/                      # Culture & Media
│   ├── local_authorities/         # Council tax, rates
│   ├── treasury/                  # General economic parameters
│   ├── indices/                   # Inflation indices (CPI, RPI)
│   ├── ons/                       # Office for National Statistics
│   ├── obr/                       # Office for Budget Responsibility (forecasts)
│   ├── contrib/                   # Contribution-based benefits
│   └── simulation/                # Simulation-specific parameters
│
└── household/                     # Household-level parameters
    ├── consumption/
    ├── demographic/
    ├── poverty/
    └── wealth/
```

### Parameter File Structure (YAML)

**Simple Scalar Parameter:**
```yaml
# takeup_rate.yaml
description: Take-up rate of Universal Credit.
values:
  2015-01-01: 0.55
metadata:
  unit: /1
  label: Universal Credit take-up rate
```

**Complex Nested Parameter with Multiple Versions:**
```yaml
# standard_allowance/amount.yaml
description: Universal Credit standard allowance.
SINGLE_YOUNG:
  description: Standard allowance for single claimants under 25
  values:
    2015-04-01: 251.77
    2020-04-06: 344.00
    2021-10-06: 257.33
    2024-04-01: 
      value: 311.68
      reference:
        - title: Benefits Uprating 2024/25
          href: https://...
    2025-04-01: 316.98
  metadata:
    label: Universal Credit single amount (under 25)
    uprating: gov.benefit_uprating_cpi  # Links to uprating mechanism
    unit: currency-GBP
    period: month
SINGLE_OLD:
  # ... (similar structure)
COUPLE_YOUNG:
  # ... (similar structure)
COUPLE_OLD:
  # ... (similar structure)
metadata:
  unit: currency-GBP
  uprating: gov.benefit_uprating_cpi
  propagate_metadata_to_children: true  # Metadata inheritance
  reference:
    - https://www.legislation.gov.uk/uksi/2013/376/...
```

### Key Features of Parameter System
1. **Time-varying values**: Different values for different dates (uprating)
2. **Metadata inheritance**: `propagate_metadata_to_children: true` applies parent metadata to child nodes
3. **Structured hierarchies**: Parameters can be nested (e.g., `universal_credit/elements/childcare/cap.yaml`)
4. **Uprating mechanisms**: Links to inflation indices (CPI, RPI) for automatic uprating
5. **References**: Each parameter includes legislative/administrative references
6. **Categories/enum values**: Named categories (SINGLE_YOUNG, COUPLE_OLD) for flexibility

### Parameter Folders by Entity
- **gov.dwp**: Department for Work & Pensions (20+ benefits)
- **gov.hmrc**: Tax parameters
- **gov.dfe**: Education parameters
- **gov.indices**: Inflation and indexation
- **gov.obr**: Office for Budget Responsibility (demographic forecasts)
- **household**: Household parameters (not government policies)

## 5. Variables Folder Structure

### Organization by Type
```
variables/
├── gov/                           # Government-controlled programs
│   ├── dwp/                       # Benefit calculations
│   │   ├── universal_credit/      # 8 calculation modules
│   │   │   ├── universal_credit.py (main calculation)
│   │   │   ├── universal_credit_pre_benefit_cap.py
│   │   │   ├── uc_maximum_amount.py
│   │   │   ├── is_uc_eligible.py
│   │   │   ├── would_claim_uc.py
│   │   │   ├── universal_credit_reported.py
│   │   │   └── [more modules]
│   │   ├── pension_credit/
│   │   ├── housing_benefit/
│   │   ├── pip/
│   │   ├── dla/
│   │   ├── attendance_allowance.py
│   │   ├── carers_allowance.py
│   │   ├── state_pension/
│   │   ├── tax_credits/
│   │   ├── [18+ benefit modules]
│   │   └── [100+ supporting calculations]
│   │
│   ├── hmrc/                      # Tax calculations (50+ modules)
│   │   ├── income_tax/
│   │   ├── national_insurance/
│   │   ├── child_benefit.py
│   │   ├── stamp_duty/
│   │   └── [more tax modules]
│   │
│   ├── dfe/                       # Education benefits
│   ├── social_security_scotland/  # Scottish benefits
│   ├── revenue_scotland/          # Scottish taxes
│   ├── [other departments]
│   │
│   └── simulation/                # Simulation utilities
│
├── household/                     # Household characteristics
│   ├── demographic/               # 95+ demographic variables
│   │   ├── country.py            # Derived from region
│   │   ├── benunit_region.py     # Benefit unit region
│   │   ├── geography.py          # Region definitions
│   │   ├── age_under_18.py
│   │   ├── is_adult.py
│   │   ├── is_disabled_for_benefits.py
│   │   ├── family_type.py
│   │   ├── [50+ more demographic]
│   │   └── locations.py          # 20KB BRMA mappings
│   │
│   ├── benefits/                 # Benefit aggregations
│   │   └── total_benefits.py
│   │
│   ├── income/                   # Income calculations
│   │   ├── total_income.py
│   │   └── [income components]
│   │
│   ├── consumption/              # Consumer behavior
│   ├── wealth/                   # Asset calculations
│   └── [other categories]
│
├── input/                        # Input variables (user-provided)
│   ├── consumption/
│   └── [input-specific]
│
├── contrib/                      # Contributed variables (external orgs)
│   ├── labour/
│   ├── policyengine/
│   ├── cec/
│   └── ubi_center/
│
└── misc/                         # Miscellaneous
    └── categories/
```

### Variable File Pattern

**Simple Variable:**
```python
from policyengine_uk.model_api import *

class attendance_allowance(Variable):
    value_type = float
    entity = Person                    # Calculated at PERSON level
    label = "Attendance Allowance"
    definition_period = YEAR           # Annual calculation
    unit = GBP                         # Currency unit
    
    def formula(person, period, parameters):
        aa = parameters(period).gov.dwp.attendance_allowance
        category = person("aa_category", period)
        return select(
            [category == categories.HIGHER, category == categories.LOWER],
            [aa.higher, aa.lower],
            default=0,
        ) * WEEKS_IN_YEAR
```

**Complex Benefit Calculation:**
```python
class universal_credit(Variable):
    label = "Universal Credit"
    entity = BenUnit                    # Calculated at BENUNIT level
    definition_period = YEAR
    value_type = float
    unit = GBP
    defined_for = "would_claim_uc"      # Conditional on eligibility
    
    def formula(benunit, period, parameters):
        uc_max = benunit("universal_credit_pre_benefit_cap", period)
        cap_reduction = benunit("benefit_cap_reduction", period)
        return max_(uc_max - cap_reduction, 0)
```

## 6. Test Structure

```
tests/
├── code_health/          # Code quality & consistency tests
│   └── test_variables.py
├── policy/
│   ├── baseline/        # Baseline system tests
│   ├── integration/     # Full system integration tests
│   └── reforms/         # Policy reform tests
├── microsimulation/     # Dataset-based calculations
│   └── test_validity.py
└── test_parameter_metadata.py
```

## 7. Entities Structure

**Hierarchy** (from entities.py):
```
State (country-level)
│
├─ Household (buildings/residences)
│  │
│  └─ BenUnit (families, benefit units)
│     │
│     └─ Person (individuals)
│
└─ Person (directly in state)
```

Each entity has roles and relationships:
- **State** contains: Members (people)
- **Household** contains: Members (people), contains BenUnits
- **BenUnit** contains: Members (people), contained in Household & State
- **Person** has role: member (of state, household, or benunit)

## 8. Key Files for Reference

| File | Purpose |
|------|---------|
| `/entities.py` | Entity definitions (State, Household, BenUnit, Person) |
| `/system.py` | TaxBenefitSystem initialization & processing |
| `/parameters/` | YAML parameter definitions (rates, amounts, eligibility) |
| `/variables/` | Python calculation formulas for all benefits & taxes |
| `/variables/household/demographic/geography.py` | Region & Country enums |
| `/variables/household/demographic/locations.py` | BRMA detailed mappings |
| `/modelled_policies.yaml` | Overview of what's modeled vs. not |
| `/reforms/` | Policy reform specifications |

## 9. Key Differences from US System

| Aspect | UK | US |
|--------|----|----|
| **Jurisdictions** | National + 4 countries + 9 regions | 50+ states + DC + territories |
| **Benefit Coordination** | Unified benefit cap | State-level program variations |
| **Parameter Structure** | Nested YAML with uprating | Flat or state-specific |
| **Regional Logic** | Country-level (Scotland/Wales/NI) | State-level (all programs vary) |
| **Entities** | State, Household, BenUnit, Person | Household, Person (state variations) |
| **Variable Count** | ~154 government benefit/tax variables | [Need to check policyengine-us] |

## Key Learnings for Coverage Tracker Adaptation

1. **Region Mapping**: Need to support 13 regions, not just 4 countries
2. **Benefit Cap**: UK has a unified benefit cap that needs aggregation
3. **Parameter Uprating**: Automatic uprating from inflation indices (CPI)
4. **Department Organization**: Parameters/Variables organized by department, not benefit type
5. **Eligibility Cascades**: Many benefits have complex eligibility (UC eligible → would claim → actual amount)
6. **Regional Variations**: Only specific benefits differ by country (Scotland/Wales/NI), not all
7. **Metadata Propagation**: Parameter metadata can be inherited down hierarchies
8. **Time-varying**: All parameters must support multiple values over time
9. **Scale**: 154+ variables, 20+ benefits, 8+ tax types in single country package

