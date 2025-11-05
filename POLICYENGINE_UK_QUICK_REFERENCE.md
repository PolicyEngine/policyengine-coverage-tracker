================================================================================
                     POLICYENGINE UK - QUICK REFERENCE
================================================================================

1. DIRECTORY STRUCTURE (High Level)
================================================================================
policyengine_uk/
  ├── parameters/        YAML files - all rates, amounts, eligibility thresholds
  ├── variables/         Python formulas - all calculations for benefits/taxes
  ├── reforms/           Policy change definitions
  ├── tests/             Test suite
  ├── entities.py        Defines: State, Household, BenUnit, Person
  └── system.py          TaxBenefitSystem initialization

2. JURISDICTIONS (13 Regions, NOT State-by-State)
================================================================================
Region (Enum):
  ENGLAND:
    - North East
    - North West
    - Yorkshire and the Humber
    - East Midlands
    - West Midlands
    - East of England
    - London
    - South East
    - South West
  SCOTLAND        (devolved - has Scottish Social Security programs)
  WALES           (devolved - some specific programs)
  NORTHERN_IRELAND (devolved - different rates for some programs)

Pattern: Derived Country -> used for conditional benefit eligibility
  country = ENGLAND | SCOTLAND | WALES | NORTHERN_IRELAND

3. MAJOR PROGRAMS (20 DWP Benefits + 8 Tax Types)
================================================================================

DWP (Department for Work & Pensions) - Social Security:
  Core Income Support:
    • Universal Credit (primary working-age benefit)
    • Pension Credit (means-tested for pensioners)
    • Housing Benefit (legacy, being replaced by UC)

  Disability/Caring:
    • Personal Independence Payment (PIP)
    • Disability Living Allowance (DLA)
    • Attendance Allowance
    • Carers Allowance
    • Severe Disablement Allowance (SDA)
    • Industrial Injuries Disablement Benefit (IIDB)
    • Constant Attendance Allowance (CAA)

  Employment Support:
    • Employment Support Allowance (ESA)
    • Job Seeker's Allowance (JSA)
    • Income Support (IS)

  Child Support (Legacy - mostly replaced by UC):
    • Child Tax Credit (CTC)
    • Working Tax Credit (WTC)

  Other:
    • State Pension
    • Winter Fuel Allowance
    • Benefit Cap (aggregated limit across all benefits)

HMRC (Her Majesty's Revenue & Customs) - Taxes:
  • Income Tax
  • National Insurance (social security contributions)
  • Child Benefit
  • Capital Gains Tax
  • Stamp Duty
  • VAT (limited modeling)
  • Business Rates
  • Fuel Duty

Education (DfE):
  • Universal Childcare Entitlement
  • Extended Childcare Entitlement
  • Targeted Childcare Entitlement
  • Care to Learn

Scotland-Specific:
  • Parent & Widow Housing Payment (PAWHP)
  • Scottish tax variations

4. PARAMETER ORGANIZATION (YAML Files)
================================================================================
parameters/gov/
├── dwp/                       (20+ benefits)
│   ├── universal_credit/
│   │   ├── standard_allowance/amount.yaml
│   │   ├── elements/
│   │   │   ├── housing/
│   │   │   ├── childcare/
│   │   │   └── ...
│   │   └── ...
│   ├── pension_credit/
│   ├── housing_benefit/
│   ├── [18 other benefits]
│   └── benefit_cap.yaml
├── hmrc/                      (taxes)
│   ├── income_tax/
│   ├── national_insurance/
│   ├── child_benefit/
│   └── ...
├── dfe/                       (education)
├── social_security_scotland/  (Scottish programs)
├── indices/                   (inflation indices for uprating)
└── [other departments]

Pattern: parameters/gov/{DEPARTMENT}/{BENEFIT}/{COMPONENT}/values.yaml

Example Parameter File (YAML):
---
description: Universal Credit standard allowance.
SINGLE_YOUNG:
  values:
    2024-04-01: 311.68
    2025-04-01: 316.98
  metadata:
    uprating: gov.benefit_uprating_cpi  # Auto-uprated by CPI
    unit: currency-GBP
    period: month
SINGLE_OLD:
  values:
    2024-04-01: 393.45
    2025-04-01: 400.14
  ...

5. VARIABLES ORGANIZATION (Python Formulas)
================================================================================
variables/gov/
├── dwp/                       (100+ benefit calculation modules)
│   ├── universal_credit/      (8 modules for UC alone)
│   │   ├── universal_credit.py (main amount)
│   │   ├── universal_credit_pre_benefit_cap.py
│   │   ├── uc_maximum_amount.py
│   │   ├── is_uc_eligible.py
│   │   └── would_claim_uc.py
│   ├── pension_credit/
│   ├── housing_benefit/
│   └── [18+ other benefits]
├── hmrc/                      (50+ tax modules)
└── [other departments]

variables/household/
├── demographic/               (95+ demographic variables)
│   ├── country.py            (ENGLAND | SCOTLAND | WALES | NORTHERN_IRELAND)
│   ├── benunit_region.py
│   ├── geography.py          (Region enum definition)
│   └── [90+ others: age, family type, disability, etc.]
└── [benefits, income, consumption, wealth, etc.]

Example Variable (Python):
---
class universal_credit(Variable):
    label = "Universal Credit"
    entity = BenUnit          # Calculated at benefit unit level
    definition_period = YEAR  # Annual calculation
    value_type = float
    unit = GBP
    
    def formula(benunit, period, parameters):
        uc_max = benunit("universal_credit_pre_benefit_cap", period)
        cap_reduction = benunit("benefit_cap_reduction", period)
        return max_(uc_max - cap_reduction, 0)

6. ENTITY HIERARCHY
================================================================================
State (country)
  ├── Household (residence, building)
  │   └── BenUnit (family/benefit unit)
  │       └── Person
  └── Person (directly)

Total: 4 entities, hierarchical structure

7. ENTITIES (entities.py)
================================================================================
State:
  - Contains people as members
  - Represents the nation

Household:
  - Contains people as members
  - Contains benefit units
  - Represents a residence

BenUnit (Benefit Unit / Family):
  - Contains people as members
  - Contained in household and state
  - Legal family unit for means-testing

Person:
  - Individual
  - Can be member of household/benunit/state

8. KEY DIFFERENCES FROM US SYSTEM
================================================================================
ASPECT                  UK                          US
Jurisdictions           National + 4 countries      50+ states + DC
Regional Scope          Mostly national             State-by-state variation
Benefit Coordination    Unified benefit cap         State-specific programs
Parameter Structure     Nested YAML, auto-uprating  Flat or state-specific
Regional Logic          Only Scotland/Wales/NI      All benefits vary by state
Entity Model            State/HH/BenUnit/Person     Household/Person (state vars)
Variables Count         154+ government variables   [Check policyengine-us]
Tax Integration         Unified HMRC system         IRS + state/local taxes
Disability Support      Separate programs (PIP, DLA) Varies by state

9. KEY DESIGN PATTERNS FOR COVERAGE TRACKER
================================================================================
1. Region Mapping:
   - Maintain 13-region enum (9 English + 3 countries)
   - Calculate country from region (not vice versa)
   - Use country for conditional benefit logic (Scotland != England)

2. Benefit Organization:
   - Organize by department folder (dwp, hmrc, dfe, etc.)
   - Each benefit can have sub-folders (universal_credit/elements/)
   - Metadata propagates down hierarchies

3. Parameter Uprating:
   - All time-varying parameters link to indices (CPI)
   - Support metadata: unit, period, label, reference
   - Categories for enum values (SINGLE_YOUNG, COUPLE_OLD, etc.)

4. Eligibility Cascade:
   - is_eligible -> would_claim -> actual_amount
   - Many benefits are conditional (defined_for="would_claim_x")
   - Use cascading formula structure

5. Regional Variations:
   - Most benefits are national
   - Only specific benefits vary by country (flag with country check)
   - Housing Benefit has regional LHA rates

6. Benefit Cap:
   - Unified aggregation across multiple benefits
   - Calculate total benefit entitlements
   - Apply cap reduction

7. Time-Varying Parameters:
   - All amounts/rates should support multiple values
   - Link to automatic uprating indices
   - Include references to legislation

================================================================================
For detailed analysis, see: POLICYENGINE_UK_STRUCTURE.md
================================================================================
