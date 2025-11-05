# PolicyEngine UK - Exploration Summary

**Date**: November 5, 2025  
**Source**: `/Users/pavelmakarchuk/policyengine-uk`  
**Purpose**: Understanding UK system structure for coverage tracker adaptation

---

## Executive Summary

The UK PolicyEngine system is fundamentally different from the US system in structure and scope:

### Key Insight
**The UK is primarily NATIONAL, not state-by-state.**
- One national system with 4 countries (England, Scotland, Wales, Northern Ireland)
- 9 English regions (for data/analysis purposes, not separate policy)
- Most benefits are the same across the UK with only 3 countries having devolved programs
- Much simpler regional structure compared to US 50-state system

---

## What's Implemented (154+ Government Variables)

### By Department

**Department for Work & Pensions (DWP)** - 20+ Social Security Benefits
- Universal Credit (primary benefit replacing most others)
- Pension Credit, Housing Benefit
- PIP, DLA, Attendance Allowance (disability)
- Carers Allowance, Carers Premium
- ESA, JSA, Income Support
- State Pension, Child Tax Credit, Working Tax Credit
- Severe Disablement Allowance, Industrial Injuries Disablement Benefit
- Constant Attendance Allowance, Disability Premiums
- Winter Fuel Allowance
- **Benefit Cap** (unified limit across all benefits)

**Her Majesty's Revenue & Customs (HMRC)** - 8+ Tax Types
- Income Tax, National Insurance
- Child Benefit (universal, not means-tested)
- Capital Gains Tax, Stamp Duty, VAT, Business Rates, Fuel Duty

**Department for Education (DfE)** - 4 Education Benefits
- Universal Childcare Entitlement
- Extended Childcare Entitlement
- Targeted Childcare Entitlement
- Care to Learn

**Other Departments** - 10+ Programs
- Scottish Social Security (Parent & Widow Housing Payment)
- Scottish Taxes (Revenue Scotland)
- Welsh Programs (WRA - Welsh Revenue Authority)
- Transport, Health, Media, Local Authorities

---

## Directory Structure

```
policyengine_uk/
├── parameters/              YAML files with rates, thresholds, amounts
│   ├── gov/
│   │   ├── dwp/            20+ benefit parameter folders
│   │   ├── hmrc/           Tax parameters
│   │   ├── dfe/            Education parameters
│   │   ├── indices/        Inflation indices (for uprating)
│   │   └── [other depts]
│   └── household/          Household-level parameters
│
├── variables/              Python formulas - benefit/tax calculations
│   ├── gov/
│   │   ├── dwp/            100+ benefit calculation modules
│   │   ├── hmrc/           50+ tax calculation modules
│   │   └── [other depts]
│   │
│   └── household/
│       ├── demographic/    95+ demographic variables (region, country, family type, age, etc.)
│       ├── benefits/       Benefit aggregations
│       ├── income/         Income calculations
│       └── [other categories]
│
├── entities.py             Defines: State, Household, BenUnit, Person
├── system.py               TaxBenefitSystem initialization
├── reforms/                Policy change definitions
├── tests/                  Test suite
└── utils/                  Utility functions
```

---

## Jurisdictional Structure (13 Regions)

### Hierarchy
```
Region Enum (13 values)
├── England (9 regions)
│   ├── North East
│   ├── North West
│   ├── Yorkshire and the Humber
│   ├── East Midlands
│   ├── West Midlands
│   ├── East of England
│   ├── London
│   ├── South East
│   └── South West
├── Scotland (devolved)
├── Wales (devolved)
└── Northern Ireland (devolved)

Derived: Country (Enum)
└── ENGLAND | SCOTLAND | WALES | NORTHERN_IRELAND
```

### Regional Implementation Pattern
```python
# Most benefits are national
# Only specific benefits vary by country
if country == "SCOTLAND":
    # Scotland-specific logic
elif country in ["ENGLAND", "WALES"]:
    # England/Wales logic
```

---

## Three Layers of Implementation

### 1. Parameters (YAML)
**Location**: `/parameters/gov/{DEPARTMENT}/{BENEFIT}/`

**Example**: Universal Credit Standard Allowance
```yaml
SINGLE_YOUNG:
  values:
    2024-04-01: 311.68
    2025-04-01: 316.98
  metadata:
    uprating: gov.benefit_uprating_cpi  # Auto-uprated by inflation
    unit: currency-GBP
    period: month
```

### 2. Variables (Python)
**Location**: `/variables/gov/{DEPARTMENT}/{BENEFIT}/`

**Example**: Universal Credit Calculation
```python
class universal_credit(Variable):
    entity = BenUnit           # Calculated at benefit unit level
    definition_period = YEAR
    unit = GBP
    
    def formula(benunit, period, parameters):
        # Get maximum entitlement
        uc_max = benunit("universal_credit_pre_benefit_cap", period)
        # Apply benefit cap
        cap_reduction = benunit("benefit_cap_reduction", period)
        return max_(uc_max - cap_reduction, 0)
```

### 3. Entities
**Location**: `/entities.py`

Four entities in hierarchical structure:
- **State**: National level (contains people, households)
- **Household**: Residence/building (contains people, benefit units)
- **BenUnit**: Family/legal benefit unit (KEY - used for means-testing)
- **Person**: Individual

---

## 4 Major Concepts for Adaptation

### 1. Entity Level: BenUnit, Not Household
- Most means-tested benefits calculated at **BenUnit** level
- BenUnit = family unit for benefit purposes
- Unlike US where calculations often at household/person level
- Affects how you aggregate and track benefit eligibility

### 2. Cascading Eligibility Pattern
Many benefits have three levels:
```
is_X_eligible      → Meets policy criteria
  ↓
would_claim_X      → Would claim based on means-test
  ↓
X                  → Final calculated amount
```

Track all three in coverage tracking.

### 3. Unified Benefit Cap
UK has ONE benefit cap that aggregates:
- Universal Credit
- Housing Benefit
- JSA/ESA/IS
- Child Tax Credit
- Working Tax Credit
- Various disability elements
- Winter payments

**Note**: Some benefits exempt (State Pension, PIP, DLA)

### 4. Parameter Uprating via Indices
Parameters link to inflation indices:
```yaml
metadata:
  uprating: gov.benefit_uprating_cpi  # Automatic CPI uprating
```

- Need to track uprating mechanism
- Auto-uprating dates (usually April for benefits)
- Different indices for different benefits (CPI vs RPI)

---

## 3 Key Differences from US

### Regional Complexity
- **US**: 50+ states, each with different programs
- **UK**: National + 4 countries, most benefits identical

### Benefit Organization
- **US**: State-specific variations in most programs
- **UK**: Department-based (DWP, HMRC, DfE), mostly national

### Parameter Structure
- **US**: Likely flat or state-specific
- **UK**: Nested hierarchies, automatic uprating via indices

---

## Major Programs by Category

### Income Support (3 main)
1. **Universal Credit** - Primary working-age benefit
2. **Pension Credit** - Means-tested for pensioners  
3. **Housing Benefit** - Legacy, being phased to Universal Credit

### Disability & Caring (7 main)
1. PIP - Personal Independence Payment
2. DLA - Disability Living Allowance
3. Attendance Allowance
4. Carers Allowance
5-7. Various premiums (enhancements to other benefits)

### Employment Support (3 main)
1. ESA - Employment Support Allowance
2. JSA - Job Seeker's Allowance
3. IS - Income Support

### Taxes (3 major)
1. Income Tax
2. National Insurance (social security contribution)
3. Child Benefit (universal, not means-tested)

### Education/Childcare (4)
1-4. Various childcare entitlements (universal, extended, targeted, care to learn)

---

## Documentation Files Generated

### 1. **POLICYENGINE_UK_STRUCTURE.md** (18KB, 462 lines)
Complete technical reference including:
- Full directory structure with all benefits
- Parameter organization patterns (YAML examples)
- Variable calculation examples (Python)
- Entity hierarchy details
- Test structure
- All 154+ variables organized by department
- Key design patterns

**Use for**: Deep technical understanding, detailed implementation

### 2. **POLICYENGINE_UK_QUICK_REFERENCE.md** (9KB, 251 lines)
Quick lookup including:
- Directory structure overview
- All jurisdictions (13 regions)
- All major programs (20 DWP + 8 taxes + others)
- Parameter file patterns
- Variable code patterns
- Entity structure
- Key design patterns for tracker

**Use for**: Quick navigation, program overview, reference

### 3. **UK_ADAPTATION_GUIDE.md** (7KB, 257 lines)
Practical guidance for adapting coverage tracker:
- Recommended benefit tracking structure (by department)
- Region/jurisdiction enum design
- Data structure schemas (JSON examples)
- Regional variation handling
- Cascading eligibility tracking
- Benefit cap aggregation
- Entity handling (BenUnit focus)
- Data collection priorities
- Migration steps from US system

**Use for**: Implementation planning, schema design, next steps

---

## Key Files in Source Repository

| File | Purpose | Key Info |
|------|---------|----------|
| `/entities.py` | Define entities | State, Household, BenUnit, Person |
| `/system.py` | TaxBenefitSystem | Parameter loading, processing |
| `/parameters/gov/dwp/` | All DWP parameters | 20+ benefit folders with YAML |
| `/parameters/gov/hmrc/` | Tax parameters | Income tax, NI, child benefit, etc. |
| `/variables/gov/dwp/` | Benefit calculations | 100+ calculation modules |
| `/variables/gov/hmrc/` | Tax calculations | 50+ tax modules |
| `/variables/household/demographic/` | Region/country | 95+ demographic variables |
| `/variables/household/demographic/geography.py` | Region enum | 13 region definitions |
| `/variables/household/demographic/country.py` | Country logic | Derives country from region |
| `/modelled_policies.yaml` | Coverage overview | What's modeled vs not |

---

## Next Steps for Coverage Tracker Adaptation

1. **Review documentation** (start with QUICK_REFERENCE, then STRUCTURE)
2. **Define data schema** (use examples in ADAPTATION_GUIDE)
3. **Set up regions** (13 region enum, derive country)
4. **Choose initial benefits** (recommend: Universal Credit + Income Tax)
5. **Map files** (link benefits to parameter/variable files)
6. **Track cascading eligibility** (eligible → would_claim → amount)
7. **Plan benefit cap** (unified aggregation across programs)
8. **Add Scottish programs** (separate from English logic)

---

## Statistics Summary

| Metric | Value |
|--------|-------|
| Total Government Variables | 154+ |
| DWP Benefits | 20+ |
| HMRC Tax Types | 8+ |
| Education Programs | 4 |
| Regions (detailed) | 13 (9 English + 3 countries) |
| Jurisdictions | 4 (countries) |
| Entities | 4 (State, Household, BenUnit, Person) |
| Parameter Folders | 20+ |
| Variable Modules | 150+ |

---

## Quick Answers to Original Questions

### 1. Overall Directory Structure?
**Answer**: Organized by department (DWP, HMRC, DfE) with parameters (YAML) and variables (Python) folders

### 2. UK Jurisdictions?
**Answer**: National-level with 4 countries + 9 English regions. Most benefits national, only Scotland/Wales/NI have devolved variations

### 3. Programs Implemented?
**Answer**: 20 DWP social security benefits, 8+ HMRC taxes, 4 education programs, various department-specific programs

### 4. Parameters Structure?
**Answer**: Nested YAML by department/benefit/component with metadata, time-varying values, uprating indices, and legislative references

---

Generated: November 5, 2025  
Source Repository: `/Users/pavelmakarchuk/policyengine-uk`  
Documentation Path: `/Users/pavelmakarchuk/policyengine-coverage-tracker/`
