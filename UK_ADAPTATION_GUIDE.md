# UK Coverage Tracker - Adaptation Guide

This document provides guidance for adapting the coverage tracker to support the PolicyEngine UK system.

## Files Generated

1. **POLICYENGINE_UK_STRUCTURE.md** - Comprehensive detailed analysis (18KB)
   - Complete directory structure
   - All 20+ benefits listed with locations
   - Parameter file examples with YAML structure
   - Variable calculation patterns
   - Full entity hierarchy

2. **POLICYENGINE_UK_QUICK_REFERENCE.md** - Quick lookup guide
   - High-level overview
   - Major programs summary
   - Key design patterns
   - Differences from US system

## Key Findings Summary

### Structure
- **Jurisdictions**: 13 regions (9 English + Scotland + Wales + Northern Ireland)
- **Core Entity**: `BenUnit` (Benefit Unit / Family) - NOT state-based like US
- **Organization**: By government department (DWP, HMRC, DfE, etc.)

### Benefits Count
- **DWP**: 20+ social security benefits
- **HMRC**: 8+ tax types
- **DfE**: 4 education/childcare programs
- **Scottish-specific**: 1+ devolved programs
- **Total**: 154+ government variables

### Key Differences from US

| Aspect | UK | US |
|--------|----|----|
| **Coverage Model** | National + 4 countries | 50+ states |
| **Region Pattern** | Country-based logic | State-based variations |
| **Regional Scope** | Most benefits national | All vary by state |
| **Benefit Cap** | Unified across all | N/A |
| **Tax Integration** | Single HMRC system | IRS + state/local |

## Implementation Recommendations

### 1. Benefit Tracking Structure
For UK coverage tracker, organize by department:
```
Coverage/
├── DWP (Social Security)
│   ├── Universal Credit
│   ├── Pension Credit
│   ├── Housing Benefit
│   ├── Disability Benefits (PIP, DLA, etc.)
│   ├── Employment Benefits (ESA, JSA, IS)
│   └── [17 other benefits]
├── HMRC (Taxes)
│   ├── Income Tax
│   ├── National Insurance
│   ├── Child Benefit
│   └── [5 other taxes]
└── Other Departments
    ├── DfE (Education/Childcare)
    ├── Scottish Social Security
    └── [other departments]
```

### 2. Region/Jurisdiction Support
```python
# Enum definition needed
class Region(Enum):
    # England (9 regions)
    NORTH_EAST = "North East"
    NORTH_WEST = "North West"
    YORKSHIRE = "Yorkshire and the Humber"
    EAST_MIDLANDS = "East Midlands"
    WEST_MIDLANDS = "West Midlands"
    EAST_OF_ENGLAND = "East of England"
    LONDON = "London"
    SOUTH_EAST = "South East"
    SOUTH_WEST = "South West"
    
    # Countries
    SCOTLAND = "Scotland"
    WALES = "Wales"
    NORTHERN_IRELAND = "Northern Ireland"

# Derived at calculation time
def get_country(region: Region) -> str:
    country_map = {
        "SCOTLAND": "Scotland",
        "WALES": "Wales",
        "NORTHERN_IRELAND": "Northern Ireland",
        # All English regions map to England
    }
    return country_map.get(region.name, "England")
```

### 3. Benefit Coverage Data Structure
For each benefit, track:
```json
{
  "benefit_id": "universal_credit",
  "label": "Universal Credit",
  "department": "DWP",
  "type": "income_support",
  "coverage_status": {
    "ENGLAND": "fully_modeled",
    "SCOTLAND": "fully_modeled",
    "WALES": "fully_modeled",
    "NORTHERN_IRELAND": "fully_modeled"
  },
  "implementation": {
    "parameters_path": "/gov/dwp/universal_credit/",
    "variables_path": "/gov/dwp/universal_credit/",
    "modules": [
      "universal_credit.py",
      "is_uc_eligible.py",
      "would_claim_uc.py",
      "universal_credit_pre_benefit_cap.py"
    ],
    "entities": ["BenUnit"],
    "parent_benefits": [],
    "child_components": [
      "standard_allowance",
      "housing_element",
      "childcare_element",
      "disability_element",
      "child_element"
    ]
  },
  "notes": "Primary working-age benefit, replaced most legacy benefits"
}
```

### 4. Parameter Uprating Awareness
Many UK parameters auto-uprate via indices:
```yaml
metadata:
  uprating: gov.benefit_uprating_cpi  # Link to inflation index
  unit: currency-GBP
  period: month
```

Consider tracking:
- Base year for parameters
- Uprating index used
- Last confirmed values
- Next scheduled uprating date

### 5. Regional Variations
Most benefits are **national**, but track exceptions:

**Varies by Region/Country:**
- Housing Benefit: Local Housing Allowance (LHA) rates by BRMA (sub-regional)
- Winter Fuel Allowance: Different for Scotland vs England/Wales
- Council Tax: Local authority rates (200+ councils)

**Scotland-specific:**
- Parent & Widow Housing Payment (PAWHP)
- Different tax rates

**Treat as mostly national** unless specifically regional.

### 6. Cascading Eligibility Pattern
Many benefits follow:
```
Eligible → Would Claim → Actual Amount
```

Track all three levels:
1. `is_X_eligible` - Meets policy criteria
2. `would_claim_X` - Would claim based on means-testing
3. `X` - Final calculated amount

### 7. Benefit Cap Tracking
UK has unified **benefit cap** that aggregates:
- Universal Credit
- Housing Benefit
- JSA/ESA/IS
- Child Tax Credit
- Working Tax Credit
- Disability elements
- Winter support payments

Note: Not all benefits count towards cap (State Pension exempt, PIP exempt, etc.)

### 8. Entities to Track
Unlike US (household/person), UK uses:
- **State**: National level
- **Household**: Residence/building
- **BenUnit**: Family/legal benefit unit (KEY FOR MEANS-TESTING)
- **Person**: Individual

Most means-tested benefits calculated at **BenUnit** level, not household or individual.

## Data Collection Priorities

1. **Core Income Support** (3 major):
   - Universal Credit (replacing most legacy benefits)
   - Pension Credit (pensioners)
   - Housing Benefit (legacy, being phased out)

2. **Disability & Caring** (7 major):
   - PIP, DLA, Attendance Allowance (disability)
   - Carers Allowance (unpaid carers)
   - Various premiums (additions to means-tested benefits)

3. **Employment Support** (3 major):
   - ESA (Employment Support Allowance)
   - JSA (Job Seeker's Allowance)
   - IS (Income Support)

4. **Taxes** (3 major):
   - Income Tax
   - National Insurance
   - Child Benefit (universal, not means-tested)

5. **Education** (4 benefits):
   - Various childcare entitlements

## Regional Data Needs

For tracking coverage completeness:
- National parameters: 1 copy per benefit
- Regional parameters: ~13 copies (by region)
- BRMA (housing): ~150+ sub-regions for LHA

Most can be treated as **national** with exceptions noted.

## Migration from US

If migrating from US coverage tracker:

1. **Simplify region logic**: Most UK benefits national
2. **Add BenUnit entity**: Can't just track household/person
3. **Add country distinction**: Scotland/Wales/NI have devolved programs
4. **Track benefit cap**: Unique to UK
5. **Parameter uprating**: Need to link to indices, not just dates
6. **Reduce state variations**: Only ~3 countries with variations

## Next Steps

1. Review full documentation: POLICYENGINE_UK_STRUCTURE.md
2. Choose benefits to track first (recommend Universal Credit + Income Tax)
3. Define data schema for benefit coverage
4. Set up regional/jurisdiction tracking
5. Create benefit inventory spreadsheet/database
6. Map parameter/variable files to coverage tracking
7. Implement cascading eligibility tracking

## Additional Resources

- PolicyEngine UK: https://github.com/PolicyEngine/policyengine-uk
- PolicyEngine Core: https://github.com/PolicyEngine/policyengine-core
- UK Legislation: https://www.legislation.gov.uk/
- DWP Benefits: https://www.gov.uk/browse/benefits
