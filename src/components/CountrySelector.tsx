import React from 'react';
import { CountryCode, COUNTRIES } from '../types/Country';
import { colors, typography, spacing } from '../designTokens';

interface CountrySelectorProps {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountryChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: spacing.sm,
        alignItems: 'center',
      }}
    >
      {Object.values(COUNTRIES).map((country) => (
        <button
          key={country.code}
          onClick={() => onCountryChange(country.code)}
          style={{
            padding: `${spacing.sm} ${spacing.md}`,
            border: `2px solid ${
              selectedCountry === country.code
                ? colors.primary[600]
                : colors.gray[300]
            }`,
            backgroundColor:
              selectedCountry === country.code
                ? colors.primary[600]
                : colors.white,
            color:
              selectedCountry === country.code
                ? colors.white
                : colors.text.primary,
            borderRadius: spacing.radius.md,
            fontSize: typography.fontSize.sm,
            fontWeight:
              selectedCountry === country.code
                ? typography.fontWeight.bold
                : typography.fontWeight.medium,
            cursor: 'pointer',
            fontFamily: typography.fontFamily.primary,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (selectedCountry !== country.code) {
              e.currentTarget.style.borderColor = colors.primary[400];
              e.currentTarget.style.backgroundColor = colors.primary[50];
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCountry !== country.code) {
              e.currentTarget.style.borderColor = colors.gray[300];
              e.currentTarget.style.backgroundColor = colors.white;
            }
          }}
        >
          {country.name}
        </button>
      ))}
    </div>
  );
};

export default CountrySelector;
