# PolicyEngine Coverage Tracker

A comprehensive visualization tool for tracking the implementation status of government programs in [PolicyEngine US](https://github.com/PolicyEngine/policyengine-us).

## Features

- **Visual Coverage Status**: Clear indicators showing complete, partial, in-progress, and not-started programs
- **Filtering**: Filter programs by status, agency, or search by name
- **GitHub Integration**: Direct links to parameters and variables folders in the PolicyEngine US repository
- **Statistics Dashboard**: Overview of coverage completion rates
- **PolicyEngine Brand Colors**: Consistent with PolicyEngine's design system

## Adding New Programs

To add a new program to the tracker, edit the `/src/data/programs.ts` file and add a new program object to the `programs` array:

```typescript
{
  id: 'program_id',           // Unique identifier (lowercase, underscores)
  name: 'Program Name',        // Short display name
  fullName: 'Full Program Name', // Complete official name
  agency: 'AGENCY',           // One of: USDA, HHS, SSA, IRS, HUD, ED, DOL, FCC, ACA, State, Local
  category: 'Category',       // Optional: For non-agency programs (e.g., 'Taxes', 'Energy', 'Legal')
  status: 'status',           // One of: complete, partial, inProgress, notStarted
  coverage: 'Coverage Area',   // e.g., 'US', 'CA, NY, MA', 'Los Angeles'
  notes: 'Additional notes',  // Optional: Implementation details or caveats
  githubLinks: {
    parameters: `${GITHUB_BASE}/parameters/path/to/parameters`,
    variables: `${GITHUB_BASE}/variables/path/to/variables`,
    tests: `${TESTS_BASE}/policy/baseline/path/to/tests`, // Optional
  },
}
```

### Status Definitions

- **complete**: Fully implemented with all federal rules
- **partial**: Partially implemented or limited to certain states/regions
- **inProgress**: Currently being developed
- **notStarted**: Planned but not yet begun

### Example

```typescript
{
  id: 'new_benefit',
  name: 'New Benefit',
  fullName: 'New Government Benefit Program',
  agency: 'HHS',
  status: 'inProgress',
  coverage: 'CA, NY',
  notes: 'Currently implementing eligibility rules',
  githubLinks: {
    parameters: `${GITHUB_BASE}/parameters/gov/hhs/new_benefit`,
    variables: `${GITHUB_BASE}/variables/gov/hhs/new_benefit`,
    tests: `${TESTS_BASE}/policy/baseline/gov/hhs/new_benefit`,
  },
}
```

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Create production build
npm run build
```

## Deployment

### GitHub Pages

The project is configured for easy deployment to GitHub Pages:

```bash
# Deploy to GitHub Pages
npm run deploy
```

This will:
1. Build the production version
2. Deploy to the `gh-pages` branch
3. Make it available at: https://[username].github.io/policyengine-coverage-tracker

### Configuration

To deploy to a different GitHub Pages URL, update the `homepage` field in `package.json`:

```json
"homepage": "https://[username].github.io/[repository-name]"
```

## Project Structure

```
src/
├── components/
│   ├── FilterBar.tsx       # Filter and search controls
│   ├── ProgramCard.tsx     # Individual program display
│   └── StatsOverview.tsx   # Coverage statistics dashboard
├── constants/
│   └── colors.ts           # PolicyEngine brand colors
├── data/
│   └── programs.ts         # Program data and configuration
├── types/
│   └── Program.ts          # TypeScript type definitions
└── App.tsx                 # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add or update programs in `/src/data/programs.ts`
4. Test locally with `npm start`
5. Submit a pull request

## License

This project is part of PolicyEngine and follows the same licensing terms as the main PolicyEngine US repository.

## Links

- [PolicyEngine US Repository](https://github.com/PolicyEngine/policyengine-us)
- [PolicyEngine Website](https://policyengine.org)
- [PolicyEngine Documentation](https://docs.policyengine.org)