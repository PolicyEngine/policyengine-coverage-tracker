import { Program } from '../types/Program';

export const getProgramBreakdown = (programs: Program[]) => {
  // Get unique categories
  const categoryMap = new Map<string, number>();
  const agencyMap = new Map<string, number>();
  const statesSet = new Set<string>();

  programs.forEach(program => {
    // Count by category
    if (program.category) {
      categoryMap.set(program.category, (categoryMap.get(program.category) || 0) + 1);
    }

    // Count by agency
    if (program.agency) {
      agencyMap.set(program.agency, (agencyMap.get(program.agency) || 0) + 1);
    }

    // Collect states from state implementations
    if (program.stateImplementations) {
      program.stateImplementations.forEach(impl => {
        statesSet.add(impl.state);
      });
    }
  });

  return {
    byCategory: Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    byAgency: Array.from(agencyMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    totalStates: statesSet.size,
  };
};
