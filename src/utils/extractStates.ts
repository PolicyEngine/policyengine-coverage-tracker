import { Program } from '../types/Program';

export const extractStatesFromPrograms = (programs: Program[]): string[] => {
  const statesSet = new Set<string>();

  // Common US state abbreviations
  const stateAbbreviations = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
    'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
    'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
    'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
    'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  programs.forEach(program => {
    if (program.coverage && program.coverage !== 'US') {
      // Split by comma and extract state abbreviations
      const parts = program.coverage.split(',').map(s => s.trim());

      parts.forEach(part => {
        // Check if it's a state abbreviation
        if (stateAbbreviations.includes(part)) {
          statesSet.add(part);
        }
        // Also check for "Los Angeles" or "Riverside County" type entries
        else if (part.includes('Los Angeles')) {
          statesSet.add('CA'); // Los Angeles is in CA
        } else if (part.includes('Riverside')) {
          statesSet.add('CA'); // Riverside County is in CA
        }
      });
    }

    // Also check agency for State programs
    if (program.agency === 'State' && program.coverage) {
      const parts = program.coverage.split(',').map(s => s.trim());
      parts.forEach(part => {
        if (stateAbbreviations.includes(part)) {
          statesSet.add(part);
        }
      });
    }
  });

  // Convert to array and sort
  return Array.from(statesSet).sort();
};