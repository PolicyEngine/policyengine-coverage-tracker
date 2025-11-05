# UK PolicyEngine Documentation Index

This index guides you through the exploration of the PolicyEngine UK system for coverage tracker adaptation.

## Start Here

### If you have 5 minutes:
- Read: **UK_EXPLORATION_SUMMARY.md** (this file gives you the executive summary)

### If you have 20 minutes:
- Read: **POLICYENGINE_UK_QUICK_REFERENCE.md** (overview of structure and major programs)
- Then: **UK_ADAPTATION_GUIDE.md** (practical implementation guidance)

### If you have 1+ hour:
- Read: **POLICYENGINE_UK_STRUCTURE.md** (comprehensive technical reference)
- Reference: **POLICYENGINE_UK_QUICK_REFERENCE.md** (for specific lookups)
- Use: **UK_ADAPTATION_GUIDE.md** (for implementation decisions)

---

## Document Overview

### 1. UK_EXPLORATION_SUMMARY.md (This File)
**Length**: ~300 lines | **Reading Time**: 5-10 minutes

**What it contains:**
- Executive summary: UK is NATIONAL, not state-by-state
- Key insight: Simpler structure than US (4 countries vs 50 states)
- 154+ government variables overview
- Directory structure diagram
- Jurisdictional structure (13 regions)
- Three layers of implementation (Parameters, Variables, Entities)
- 4 major concepts for adaptation
- Statistics and quick answers

**When to use:**
- Quick overview before diving deeper
- To understand the scale and scope
- To see the big picture differences from US

**Key takeaway:** UK system is national with 4 countries + 9 English regions, organized by department (DWP, HMRC, DfE)

---

### 2. POLICYENGINE_UK_QUICK_REFERENCE.md
**Length**: ~250 lines | **Reading Time**: 15-20 minutes

**What it contains:**
- Directory structure (high level)
- 13 jurisdictions with full breakdown
- 20 DWP benefits listed
- 8+ HMRC tax types listed
- 4 DfE education programs
- Scottish-specific benefits
- Parameter organization tree
- Parameter file examples (YAML)
- Variables organization tree
- Variable code examples (Python)
- Entity hierarchy
- Key differences from US system (table)
- 7 key design patterns for tracker

**When to use:**
- Quick reference for program names and locations
- Understanding parameter structure
- Understanding variable patterns
- Comparing UK vs US approaches

**Key takeaway:** Comprehensive structured overview of what exists and where to find it

---

### 3. POLICYENGINE_UK_STRUCTURE.md
**Length**: ~460 lines (18KB) | **Reading Time**: 45 minutes - 1 hour

**What it contains:**
- Complete directory structure with all benefits
- Full list of 13 regions with hierarchy
- All 20+ DWP benefits with descriptions
- All HMRC taxes listed
- All DfE education programs
- All Scottish-specific programs
- Detailed parameter folder structure (9 subsections)
- Parameter file structure patterns (YAML examples with full content)
- Key features of parameter system (6 points)
- Complete variables folder structure
- Variable file pattern examples (Python code)
- Test structure
- Entity hierarchy and definitions
- Key files reference table
- 8 key differences from US system (detailed table)
- Key learnings for coverage tracker adaptation

**When to use:**
- Deep technical understanding needed
- Detailed implementation planning
- Understanding exact parameter/variable organization
- Finding specific benefits or tax types

**Key takeaway:** Complete technical reference for understanding the entire UK system structure

---

### 4. UK_ADAPTATION_GUIDE.md
**Length**: ~250 lines (7.4KB) | **Reading Time**: 20-30 minutes

**What it contains:**
- File overview (summary of the 3 documents)
- Key findings summary (structure, benefits count, differences)
- Implementation recommendations (8 detailed sections):
  1. Benefit tracking structure (organized by department)
  2. Region/jurisdiction enum design (Python code example)
  3. Benefit coverage data structure (JSON example)
  4. Parameter uprating awareness
  5. Regional variations handling
  6. Cascading eligibility pattern
  7. Benefit cap tracking
  8. Entity handling (BenUnit focus)
- Data collection priorities (5 categories)
- Regional data needs
- Migration steps from US system
- Next steps (7-item action plan)
- Additional resources

**When to use:**
- Planning how to implement UK support in coverage tracker
- Deciding on data schema and structure
- Understanding what to prioritize
- Getting specific implementation recommendations

**Key takeaway:** Practical guidance for adapting coverage tracker, with code examples and data schemas

---

## Feature Comparison Table

| Feature | Summary | Full Details |
|---------|---------|--------------|
| **Jurisdictions** | 13 regions (9 English + 4 countries) | POLICYENGINE_UK_STRUCTURE.md, Section 2 |
| **Benefits Count** | 20+ DWP, 8+ HMRC, 4+ DfE | POLICYENGINE_UK_QUICK_REFERENCE.md, Section 3 |
| **Directory Structure** | parameters/ and variables/ by department | POLICYENGINE_UK_STRUCTURE.md, Section 4 |
| **Parameter Format** | YAML with time-varying values & metadata | POLICYENGINE_UK_STRUCTURE.md, Section 4 |
| **Variable Format** | Python classes with formula methods | POLICYENGINE_UK_STRUCTURE.md, Section 5 |
| **Entities** | State, Household, BenUnit, Person | POLICYENGINE_UK_STRUCTURE.md, Section 7 |
| **Implementation Guide** | Practical recommendations with examples | UK_ADAPTATION_GUIDE.md, all sections |

---

## Quick Navigation by Topic

### Understanding the Structure
1. Start: **UK_EXPLORATION_SUMMARY.md** (Executive Summary)
2. Deep dive: **POLICYENGINE_UK_STRUCTURE.md** (Section 1)

### Finding Programs
1. Quick lookup: **POLICYENGINE_UK_QUICK_REFERENCE.md** (Section 3)
2. Full details: **POLICYENGINE_UK_STRUCTURE.md** (Section 3)

### Understanding Parameters
1. Overview: **POLICYENGINE_UK_QUICK_REFERENCE.md** (Section 4)
2. Detailed patterns: **POLICYENGINE_UK_STRUCTURE.md** (Section 4)
3. Examples: Both documents have YAML examples

### Understanding Variables
1. Overview: **POLICYENGINE_UK_QUICK_REFERENCE.md** (Section 5)
2. Detailed patterns: **POLICYENGINE_UK_STRUCTURE.md** (Section 5)
3. Examples: Both documents have Python code examples

### Understanding Jurisdictions
1. Quick overview: **POLICYENGINE_UK_QUICK_REFERENCE.md** (Section 2)
2. Full details: **POLICYENGINE_UK_STRUCTURE.md** (Section 2)
3. Implementation: **UK_ADAPTATION_GUIDE.md** (Section 2)

### Planning Implementation
1. Start: **UK_EXPLORATION_SUMMARY.md** (4 Major Concepts)
2. Plan: **UK_ADAPTATION_GUIDE.md** (all sections)
3. Reference: **POLICYENGINE_UK_STRUCTURE.md** (for details as needed)

---

## Key Concepts Explained

### BenUnit (Benefit Unit)
- **What**: Family/legal family unit for means-testing purposes
- **Why it matters**: Most UK benefits calculated at this level, not household/person
- **Reference**: UK_ADAPTATION_GUIDE.md, Section 8; POLICYENGINE_UK_STRUCTURE.md, Section 7
- **Impact**: Must track eligibility at BenUnit level, not just household

### Cascading Eligibility
- **Pattern**: Eligible → Would Claim → Actual Amount
- **Why it matters**: Many benefits have three calculation levels
- **Reference**: UK_ADAPTATION_GUIDE.md, Section 6
- **Impact**: Need to track all three levels in coverage tracking

### Benefit Cap
- **What**: Unified limit on total benefits received
- **Why it matters**: Unique to UK, aggregates multiple benefits
- **Reference**: UK_ADAPTATION_GUIDE.md, Section 7
- **Impact**: Need to aggregate across benefits for cap calculation

### Parameter Uprating
- **Pattern**: Link to inflation indices (CPI, RPI) for auto-uprating
- **Why it matters**: Parameters update automatically, need to track mechanism
- **Reference**: UK_ADAPTATION_GUIDE.md, Section 4
- **Impact**: Need to understand uprating links when tracking parameters

### Regional vs National
- **Pattern**: Most benefits national, only Scotland/Wales/NI vary
- **Why it matters**: Simpler than US where all vary by state
- **Reference**: UK_ADAPTATION_GUIDE.md, Section 5
- **Impact**: Can treat most benefits as national with exceptions

---

## Statistics Summary

| Metric | Value | Reference |
|--------|-------|-----------|
| Total Variables | 154+ | UK_EXPLORATION_SUMMARY.md |
| DWP Benefits | 20+ | All documents |
| HMRC Tax Types | 8+ | All documents |
| Education Programs | 4 | All documents |
| Regions | 13 | POLICYENGINE_UK_QUICK_REFERENCE.md, Section 2 |
| Entities | 4 | POLICYENGINE_UK_STRUCTURE.md, Section 7 |
| Parameter Folders | 20+ | POLICYENGINE_UK_STRUCTURE.md, Section 4 |
| Variable Modules | 150+ | POLICYENGINE_UK_STRUCTURE.md, Section 5 |

---

## Common Questions & Answers

**Q: Is the UK system like the US state-by-state?**
A: No. UK is national with 4 countries. Most benefits identical across UK. Reference: UK_EXPLORATION_SUMMARY.md (Key Insight section)

**Q: How many benefits are there?**
A: 20+ DWP social security benefits, 8+ HMRC taxes, 4 education programs. Reference: UK_EXPLORATION_SUMMARY.md (What's Implemented)

**Q: What are the regions?**
A: 13 total: 9 English regions + Scotland + Wales + Northern Ireland. Reference: UK_EXPLORATION_SUMMARY.md (Jurisdictional Structure)

**Q: Where are parameters stored?**
A: `/parameters/gov/{DEPARTMENT}/{BENEFIT}/` as YAML files. Reference: POLICYENGINE_UK_STRUCTURE.md, Section 4

**Q: Where are benefit calculations?**
A: `/variables/gov/{DEPARTMENT}/{BENEFIT}/` as Python classes. Reference: POLICYENGINE_UK_STRUCTURE.md, Section 5

**Q: What are the main entities?**
A: State, Household, BenUnit, Person. BenUnit is key for means-testing. Reference: POLICYENGINE_UK_STRUCTURE.md, Section 7

**Q: How do I adapt the US tracker for UK?**
A: Follow UK_ADAPTATION_GUIDE.md. Key changes: add BenUnit, simplify regions, track benefit cap. Reference: UK_ADAPTATION_GUIDE.md (all sections)

**Q: What are the key differences from US?**
A: National vs state-by-state, unified benefit cap, BenUnit entity, cascading eligibility. Reference: UK_EXPLORATION_SUMMARY.md (3 Key Differences)

---

## Source Information

**Source Repository**: `/Users/pavelmakarchuk/policyengine-uk`  
**Documentation Location**: `/Users/pavelmakarchuk/policyengine-coverage-tracker/`  
**Generated**: November 5, 2025  
**Based on**: Direct exploration of policyengine-uk repository structure, parameters, and variables

---

## File Sizes & Line Counts

| Document | Size | Lines | Type |
|----------|------|-------|------|
| UK_EXPLORATION_SUMMARY.md | 10KB | 330 | Overview |
| POLICYENGINE_UK_QUICK_REFERENCE.md | 9KB | 251 | Quick Ref |
| POLICYENGINE_UK_STRUCTURE.md | 18KB | 462 | Detailed |
| UK_ADAPTATION_GUIDE.md | 7KB | 257 | Practical |
| UK_DOCUMENTATION_INDEX.md | 8KB | 250 | This file |

---

## Next Steps

1. **If new to UK system**: Start with UK_EXPLORATION_SUMMARY.md
2. **If need quick reference**: Use POLICYENGINE_UK_QUICK_REFERENCE.md
3. **If planning implementation**: Read UK_ADAPTATION_GUIDE.md
4. **If need technical details**: Deep dive into POLICYENGINE_UK_STRUCTURE.md
5. **If confused about something**: Search this index for the topic

Good luck with your coverage tracker adaptation!
