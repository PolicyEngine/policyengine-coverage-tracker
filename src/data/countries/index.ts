import { CountryCode } from '../../types/Country';
import { Program } from '../../types/Program';
import { programs as usPrograms, getStatusCount as usGetStatusCount } from './us/programs';
import { canadaPrograms, getStatusCount as canadaGetStatusCount } from './canada/programs';
import { ukPrograms, getStatusCount as ukGetStatusCount } from './uk/programs';

export function getProgramsForCountry(country: CountryCode): Program[] {
  switch (country) {
    case 'us':
      return usPrograms;
    case 'canada':
      return canadaPrograms;
    case 'uk':
      return ukPrograms;
    default:
      return usPrograms;
  }
}

export function getStatusCountForCountry(country: CountryCode) {
  switch (country) {
    case 'us':
      return usGetStatusCount();
    case 'canada':
      return canadaGetStatusCount();
    case 'uk':
      return ukGetStatusCount();
    default:
      return usGetStatusCount();
  }
}
