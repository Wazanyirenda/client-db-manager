"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CaretDown, X } from '@phosphor-icons/react';

// Country data with codes, names, and flags
export const countries = [
  { code: '+1', name: 'United States', flag: '🇺🇸', dialCode: '1' },
  { code: '+1', name: 'Canada', flag: '🇨🇦', dialCode: '1' },
  { code: '+1', name: 'Puerto Rico', flag: '🇵🇷', dialCode: '1' },
  { code: '+7', name: 'Russia', flag: '🇷🇺', dialCode: '7' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬', dialCode: '20' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦', dialCode: '27' },
  { code: '+30', name: 'Greece', flag: '🇬🇷', dialCode: '30' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱', dialCode: '31' },
  { code: '+32', name: 'Belgium', flag: '🇧🇪', dialCode: '32' },
  { code: '+33', name: 'France', flag: '🇫🇷', dialCode: '33' },
  { code: '+34', name: 'Spain', flag: '🇪🇸', dialCode: '34' },
  { code: '+36', name: 'Hungary', flag: '🇭🇺', dialCode: '36' },
  { code: '+39', name: 'Italy', flag: '🇮🇹', dialCode: '39' },
  { code: '+40', name: 'Romania', flag: '🇷🇴', dialCode: '40' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭', dialCode: '41' },
  { code: '+43', name: 'Austria', flag: '🇦🇹', dialCode: '43' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', dialCode: '44' },
  { code: '+45', name: 'Denmark', flag: '🇩🇰', dialCode: '45' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪', dialCode: '46' },
  { code: '+47', name: 'Norway', flag: '🇳🇴', dialCode: '47' },
  { code: '+48', name: 'Poland', flag: '🇵🇱', dialCode: '48' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', dialCode: '49' },
  { code: '+51', name: 'Peru', flag: '🇵🇪', dialCode: '51' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽', dialCode: '52' },
  { code: '+53', name: 'Cuba', flag: '🇨🇺', dialCode: '53' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷', dialCode: '54' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷', dialCode: '55' },
  { code: '+56', name: 'Chile', flag: '🇨🇱', dialCode: '56' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴', dialCode: '57' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪', dialCode: '58' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾', dialCode: '60' },
  { code: '+61', name: 'Australia', flag: '🇦🇺', dialCode: '61' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩', dialCode: '62' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭', dialCode: '63' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿', dialCode: '64' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬', dialCode: '65' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭', dialCode: '66' },
  { code: '+81', name: 'Japan', flag: '🇯🇵', dialCode: '81' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷', dialCode: '82' },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳', dialCode: '84' },
  { code: '+86', name: 'China', flag: '🇨🇳', dialCode: '86' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷', dialCode: '90' },
  { code: '+91', name: 'India', flag: '🇮🇳', dialCode: '91' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰', dialCode: '92' },
  { code: '+93', name: 'Afghanistan', flag: '🇦🇫', dialCode: '93' },
  { code: '+94', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '94' },
  { code: '+95', name: 'Myanmar', flag: '🇲🇲', dialCode: '95' },
  { code: '+98', name: 'Iran', flag: '🇮🇷', dialCode: '98' },
  { code: '+212', name: 'Morocco', flag: '🇲🇦', dialCode: '212' },
  { code: '+213', name: 'Algeria', flag: '🇩🇿', dialCode: '213' },
  { code: '+216', name: 'Tunisia', flag: '🇹🇳', dialCode: '216' },
  { code: '+218', name: 'Libya', flag: '🇱🇾', dialCode: '218' },
  { code: '+220', name: 'Gambia', flag: '🇬🇲', dialCode: '220' },
  { code: '+221', name: 'Senegal', flag: '🇸🇳', dialCode: '221' },
  { code: '+222', name: 'Mauritania', flag: '🇲🇷', dialCode: '222' },
  { code: '+223', name: 'Mali', flag: '🇲🇱', dialCode: '223' },
  { code: '+224', name: 'Guinea', flag: '🇬🇳', dialCode: '224' },
  { code: '+225', name: 'Ivory Coast', flag: '🇨🇮', dialCode: '225' },
  { code: '+226', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '226' },
  { code: '+227', name: 'Niger', flag: '🇳🇪', dialCode: '227' },
  { code: '+228', name: 'Togo', flag: '🇹🇬', dialCode: '228' },
  { code: '+229', name: 'Benin', flag: '🇧🇯', dialCode: '229' },
  { code: '+230', name: 'Mauritius', flag: '🇲🇺', dialCode: '230' },
  { code: '+231', name: 'Liberia', flag: '🇱🇷', dialCode: '231' },
  { code: '+232', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '232' },
  { code: '+233', name: 'Ghana', flag: '🇬🇭', dialCode: '233' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬', dialCode: '234' },
  { code: '+235', name: 'Chad', flag: '🇹🇩', dialCode: '235' },
  { code: '+236', name: 'Central African Republic', flag: '🇨🇫', dialCode: '236' },
  { code: '+237', name: 'Cameroon', flag: '🇨🇲', dialCode: '237' },
  { code: '+238', name: 'Cape Verde', flag: '🇨🇻', dialCode: '238' },
  { code: '+239', name: 'São Tomé and Príncipe', flag: '🇸🇹', dialCode: '239' },
  { code: '+240', name: 'Equatorial Guinea', flag: '🇬🇶', dialCode: '240' },
  { code: '+241', name: 'Gabon', flag: '🇬🇦', dialCode: '241' },
  { code: '+242', name: 'Republic of the Congo', flag: '🇨🇬', dialCode: '242' },
  { code: '+243', name: 'Democratic Republic of the Congo', flag: '🇨🇩', dialCode: '243' },
  { code: '+244', name: 'Angola', flag: '🇦🇴', dialCode: '244' },
  { code: '+245', name: 'Guinea-Bissau', flag: '🇬🇼', dialCode: '245' },
  { code: '+246', name: 'British Indian Ocean Territory', flag: '🇮🇴', dialCode: '246' },
  { code: '+248', name: 'Seychelles', flag: '🇸🇨', dialCode: '248' },
  { code: '+249', name: 'Sudan', flag: '🇸🇩', dialCode: '249' },
  { code: '+250', name: 'Rwanda', flag: '🇷🇼', dialCode: '250' },
  { code: '+251', name: 'Ethiopia', flag: '🇪🇹', dialCode: '251' },
  { code: '+252', name: 'Somalia', flag: '🇸🇴', dialCode: '252' },
  { code: '+253', name: 'Djibouti', flag: '🇩🇯', dialCode: '253' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪', dialCode: '254' },
  { code: '+255', name: 'Tanzania', flag: '🇹🇿', dialCode: '255' },
  { code: '+256', name: 'Uganda', flag: '🇺🇬', dialCode: '256' },
  { code: '+257', name: 'Burundi', flag: '🇧🇮', dialCode: '257' },
  { code: '+258', name: 'Mozambique', flag: '🇲🇿', dialCode: '258' },
  { code: '+260', name: 'Zambia', flag: '🇿🇲', dialCode: '260' },
  { code: '+261', name: 'Madagascar', flag: '🇲🇬', dialCode: '261' },
  { code: '+262', name: 'Réunion', flag: '🇷🇪', dialCode: '262' },
  { code: '+263', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '263' },
  { code: '+264', name: 'Namibia', flag: '🇳🇦', dialCode: '264' },
  { code: '+265', name: 'Malawi', flag: '🇲🇼', dialCode: '265' },
  { code: '+266', name: 'Lesotho', flag: '🇱🇸', dialCode: '266' },
  { code: '+267', name: 'Botswana', flag: '🇧🇼', dialCode: '267' },
  { code: '+268', name: 'Eswatini', flag: '🇸🇿', dialCode: '268' },
  { code: '+269', name: 'Comoros', flag: '🇰🇲', dialCode: '269' },
  { code: '+290', name: 'Saint Helena', flag: '🇸🇭', dialCode: '290' },
  { code: '+291', name: 'Eritrea', flag: '🇪🇷', dialCode: '291' },
  { code: '+297', name: 'Aruba', flag: '🇦🇼', dialCode: '297' },
  { code: '+298', name: 'Faroe Islands', flag: '🇫🇴', dialCode: '298' },
  { code: '+299', name: 'Greenland', flag: '🇬🇱', dialCode: '299' },
  { code: '+350', name: 'Gibraltar', flag: '🇬🇮', dialCode: '350' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹', dialCode: '351' },
  { code: '+352', name: 'Luxembourg', flag: '🇱🇺', dialCode: '352' },
  { code: '+353', name: 'Ireland', flag: '🇮🇪', dialCode: '353' },
  { code: '+354', name: 'Iceland', flag: '🇮🇸', dialCode: '354' },
  { code: '+355', name: 'Albania', flag: '🇦🇱', dialCode: '355' },
  { code: '+356', name: 'Malta', flag: '🇲🇹', dialCode: '356' },
  { code: '+357', name: 'Cyprus', flag: '🇨🇾', dialCode: '357' },
  { code: '+358', name: 'Finland', flag: '🇫🇮', dialCode: '358' },
  { code: '+359', name: 'Bulgaria', flag: '🇧🇬', dialCode: '359' },
  { code: '+370', name: 'Lithuania', flag: '🇱🇹', dialCode: '370' },
  { code: '+371', name: 'Latvia', flag: '🇱🇻', dialCode: '371' },
  { code: '+372', name: 'Estonia', flag: '🇪🇪', dialCode: '372' },
  { code: '+373', name: 'Moldova', flag: '🇲🇩', dialCode: '373' },
  { code: '+374', name: 'Armenia', flag: '🇦🇲', dialCode: '374' },
  { code: '+375', name: 'Belarus', flag: '🇧🇾', dialCode: '375' },
  { code: '+376', name: 'Andorra', flag: '🇦🇩', dialCode: '376' },
  { code: '+377', name: 'Monaco', flag: '🇲🇨', dialCode: '377' },
  { code: '+378', name: 'San Marino', flag: '🇸🇲', dialCode: '378' },
  { code: '+380', name: 'Ukraine', flag: '🇺🇦', dialCode: '380' },
  { code: '+381', name: 'Serbia', flag: '🇷🇸', dialCode: '381' },
  { code: '+382', name: 'Montenegro', flag: '🇲🇪', dialCode: '382' },
  { code: '+383', name: 'Kosovo', flag: '🇽🇰', dialCode: '383' },
  { code: '+385', name: 'Croatia', flag: '🇭🇷', dialCode: '385' },
  { code: '+386', name: 'Slovenia', flag: '🇸🇮', dialCode: '386' },
  { code: '+387', name: 'Bosnia and Herzegovina', flag: '🇧🇦', dialCode: '387' },
  { code: '+389', name: 'North Macedonia', flag: '🇲🇰', dialCode: '389' },
  { code: '+420', name: 'Czech Republic', flag: '🇨🇿', dialCode: '420' },
  { code: '+421', name: 'Slovakia', flag: '🇸🇰', dialCode: '421' },
  { code: '+423', name: 'Liechtenstein', flag: '🇱🇮', dialCode: '423' },
  { code: '+500', name: 'Falkland Islands', flag: '🇫🇰', dialCode: '500' },
  { code: '+501', name: 'Belize', flag: '🇧🇿', dialCode: '501' },
  { code: '+502', name: 'Guatemala', flag: '🇬🇹', dialCode: '502' },
  { code: '+503', name: 'El Salvador', flag: '🇸🇻', dialCode: '503' },
  { code: '+504', name: 'Honduras', flag: '🇭🇳', dialCode: '504' },
  { code: '+505', name: 'Nicaragua', flag: '🇳🇮', dialCode: '505' },
  { code: '+506', name: 'Costa Rica', flag: '🇨🇷', dialCode: '506' },
  { code: '+507', name: 'Panama', flag: '🇵🇦', dialCode: '507' },
  { code: '+508', name: 'Saint Pierre and Miquelon', flag: '🇵🇲', dialCode: '508' },
  { code: '+509', name: 'Haiti', flag: '🇭🇹', dialCode: '509' },
  { code: '+590', name: 'Guadeloupe', flag: '🇬🇵', dialCode: '590' },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴', dialCode: '591' },
  { code: '+592', name: 'Guyana', flag: '🇬🇾', dialCode: '592' },
  { code: '+593', name: 'Ecuador', flag: '🇪🇨', dialCode: '593' },
  { code: '+594', name: 'French Guiana', flag: '🇬🇫', dialCode: '594' },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾', dialCode: '595' },
  { code: '+596', name: 'Martinique', flag: '🇲🇶', dialCode: '596' },
  { code: '+597', name: 'Suriname', flag: '🇸🇷', dialCode: '597' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾', dialCode: '598' },
  { code: '+599', name: 'Curaçao', flag: '🇨🇼', dialCode: '599' },
  { code: '+670', name: 'East Timor', flag: '🇹🇱', dialCode: '670' },
  { code: '+672', name: 'Antarctica', flag: '🇦🇶', dialCode: '672' },
  { code: '+673', name: 'Brunei', flag: '🇧🇳', dialCode: '673' },
  { code: '+674', name: 'Nauru', flag: '🇳🇷', dialCode: '674' },
  { code: '+675', name: 'Papua New Guinea', flag: '🇵🇬', dialCode: '675' },
  { code: '+676', name: 'Tonga', flag: '🇹🇴', dialCode: '676' },
  { code: '+677', name: 'Solomon Islands', flag: '🇸🇧', dialCode: '677' },
  { code: '+678', name: 'Vanuatu', flag: '🇻🇺', dialCode: '678' },
  { code: '+679', name: 'Fiji', flag: '🇫🇯', dialCode: '679' },
  { code: '+680', name: 'Palau', flag: '🇵🇼', dialCode: '680' },
  { code: '+681', name: 'Wallis and Futuna', flag: '🇼🇫', dialCode: '681' },
  { code: '+682', name: 'Cook Islands', flag: '🇨🇰', dialCode: '682' },
  { code: '+683', name: 'Niue', flag: '🇳🇺', dialCode: '683' },
  { code: '+684', name: 'American Samoa', flag: '🇦🇸', dialCode: '684' },
  { code: '+685', name: 'Samoa', flag: '🇼🇸', dialCode: '685' },
  { code: '+686', name: 'Kiribati', flag: '🇰🇮', dialCode: '686' },
  { code: '+687', name: 'New Caledonia', flag: '🇳🇨', dialCode: '687' },
  { code: '+688', name: 'Tuvalu', flag: '🇹🇻', dialCode: '688' },
  { code: '+689', name: 'French Polynesia', flag: '🇵🇫', dialCode: '689' },
  { code: '+690', name: 'Tokelau', flag: '🇹🇰', dialCode: '690' },
  { code: '+691', name: 'Federated States of Micronesia', flag: '🇫🇲', dialCode: '691' },
  { code: '+692', name: 'Marshall Islands', flag: '🇲🇭', dialCode: '692' },
  { code: '+850', name: 'North Korea', flag: '🇰🇵', dialCode: '850' },
  { code: '+852', name: 'Hong Kong', flag: '🇭🇰', dialCode: '852' },
  { code: '+853', name: 'Macau', flag: '🇲🇴', dialCode: '853' },
  { code: '+855', name: 'Cambodia', flag: '🇰🇭', dialCode: '855' },
  { code: '+856', name: 'Laos', flag: '🇱🇦', dialCode: '856' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩', dialCode: '880' },
  { code: '+886', name: 'Taiwan', flag: '🇹🇼', dialCode: '886' },
  { code: '+960', name: 'Maldives', flag: '🇲🇻', dialCode: '960' },
  { code: '+961', name: 'Lebanon', flag: '🇱🇧', dialCode: '961' },
  { code: '+962', name: 'Jordan', flag: '🇯🇴', dialCode: '962' },
  { code: '+963', name: 'Syria', flag: '🇸🇾', dialCode: '963' },
  { code: '+964', name: 'Iraq', flag: '🇮🇶', dialCode: '964' },
  { code: '+965', name: 'Kuwait', flag: '🇰🇼', dialCode: '965' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '966' },
  { code: '+967', name: 'Yemen', flag: '🇾🇪', dialCode: '967' },
  { code: '+968', name: 'Oman', flag: '🇴🇲', dialCode: '968' },
  { code: '+970', name: 'Palestine', flag: '🇵🇸', dialCode: '970' },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '971' },
  { code: '+972', name: 'Israel', flag: '🇮🇱', dialCode: '972' },
  { code: '+973', name: 'Bahrain', flag: '🇧🇭', dialCode: '973' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦', dialCode: '974' },
  { code: '+975', name: 'Bhutan', flag: '🇧🇹', dialCode: '975' },
  { code: '+976', name: 'Mongolia', flag: '🇲🇳', dialCode: '976' },
  { code: '+977', name: 'Nepal', flag: '🇳🇵', dialCode: '977' },
  { code: '+992', name: 'Tajikistan', flag: '🇹🇯', dialCode: '992' },
  { code: '+993', name: 'Turkmenistan', flag: '🇹🇲', dialCode: '993' },
  { code: '+994', name: 'Azerbaijan', flag: '🇦🇿', dialCode: '994' },
  { code: '+995', name: 'Georgia', flag: '🇬🇪', dialCode: '995' },
  { code: '+996', name: 'Kyrgyzstan', flag: '🇰🇬', dialCode: '996' },
  { code: '+998', name: 'Uzbekistan', flag: '🇺🇿', dialCode: '998' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  defaultCountry?: string; // ISO country code like "ZM" for Zambia
}

// Find country by ISO code
const findCountryByIso = (isoCode: string) => {
  const isoToDialCode: Record<string, string> = {
    'US': '1', 'CA': '1', 'GB': '44', 'ZM': '260', 'ZA': '27', 'NG': '234',
    'KE': '254', 'GH': '233', 'TZ': '255', 'UG': '256', 'RW': '250',
    'DE': '49', 'FR': '33', 'IT': '39', 'ES': '34', 'PT': '351',
    'JP': '81', 'CN': '86', 'IN': '91', 'AU': '61', 'NZ': '64',
    'BR': '55', 'MX': '52', 'AR': '54', 'CL': '56', 'CO': '57',
  };
  const dialCode = isoToDialCode[isoCode.toUpperCase()];
  if (dialCode) {
    return countries.find(c => c.dialCode === dialCode);
  }
  return null;
};

// Default to Zambia
const defaultZambia = countries.find(c => c.dialCode === '260') || countries[0];

export function PhoneInput({ value, onChange, placeholder = "Enter phone number", className = "", required = false, defaultCountry = "ZM" }: PhoneInputProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse the current value to get country and number
  const parseValue = (val: string) => {
    if (!val) {
      return { country: findCountryByIso(defaultCountry) || defaultZambia, number: '' };
    }
    const country = countries.find(c => val.startsWith(c.code)) || findCountryByIso(defaultCountry) || defaultZambia;
    const number = val.replace(country.code, '').replace(/^\s+/, '');
    return { country, number };
  };

  const { country: selectedCountry, number: phoneNumber } = parseValue(value);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, spaces, parentheses, hyphens, and plus signs
    const cleaned = e.target.value.replace(/[^\d\s\-\(\)\+]/g, '');
    const fullNumber = cleaned ? `${selectedCountry.code} ${cleaned}` : '';
    onChange(fullNumber);
  };

  const handleCountrySelect = (country: typeof countries[0]) => {
    const fullNumber = phoneNumber ? `${country.code} ${phoneNumber}` : '';
    onChange(fullNumber);
    setIsDropdownOpen(false);
  };

  const handleClear = () => {
    onChange('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        {/* Country selector */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 h-10 sm:h-11 px-2 sm:px-3 bg-gray-50 hover:bg-gray-100 rounded-l-lg border-r border-gray-300 focus:outline-none transition-colors"
          >
            <span className="text-base sm:text-lg">{selectedCountry.flag}</span>
            <span className="text-xs sm:text-sm font-medium text-gray-700">{selectedCountry.code}</span>
            <CaretDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" weight="bold" />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 z-50 w-72 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl mt-1">
              {countries.map((country, index) => (
                <button
                  key={`${country.code}-${country.name}-${index}`}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm text-gray-900 font-medium">{country.name}</span>
                  <span className="text-sm text-gray-500 ml-auto">{country.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone number input */}
        <div className="flex-1 relative min-w-0">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder={placeholder}
            required={required}
            className="w-full h-10 sm:h-11 px-3 pr-10 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          {phoneNumber && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" weight="bold" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
