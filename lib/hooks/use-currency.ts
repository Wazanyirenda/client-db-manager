"use client";

import { useState, useEffect, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

// Supported currencies
export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  ZMW: { code: 'ZMW', symbol: 'K', name: 'Zambian Kwacha', flag: '🇿🇲' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

interface ExchangeRates {
  [key: string]: number;
}

interface UseCurrencyReturn {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => Promise<void>;
  rates: ExchangeRates | null;
  loading: boolean;
  error: string | null;
  formatAmount: (amount: number, fromCurrency?: CurrencyCode) => string;
  convertAmount: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;
  lastUpdated: Date | null;
  refreshRates: () => Promise<void>;
}

// Cache exchange rates in memory to avoid excessive API calls
let cachedRates: ExchangeRates | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export function useCurrency(): UseCurrencyReturn {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [rates, setRates] = useState<ExchangeRates | null>(cachedRates);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    cacheTimestamp ? new Date(cacheTimestamp) : null
  );

  // Fetch user's currency preference
  useEffect(() => {
    const fetchUserCurrency = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .single();

      if (profile?.currency && CURRENCIES[profile.currency as CurrencyCode]) {
        setCurrencyState(profile.currency as CurrencyCode);
      }
    };
    fetchUserCurrency();
  }, []);

  // Fetch exchange rates
  const fetchRates = useCallback(async () => {
    // Check cache first
    if (cachedRates && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setRates(cachedRates);
      setLastUpdated(new Date(cacheTimestamp));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Using frankfurter.app - free, no API key needed
      const response = await fetch(
        'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,ZAR,CAD'
      );
      
      if (!response.ok) throw new Error('Failed to fetch exchange rates');
      
      const data = await response.json();
      
      // Frankfurter doesn't have ZMW, NGN, KES - we'll use approximate rates
      // These are approximate and should be updated with a better API for production
      const fullRates: ExchangeRates = {
        USD: 1,
        EUR: data.rates.EUR || 0.92,
        GBP: data.rates.GBP || 0.79,
        ZAR: data.rates.ZAR || 18.5,
        CAD: data.rates.CAD || 1.36,
        // Approximate rates for African currencies (update these periodically)
        ZMW: 27.5,  // ~27.5 ZMW per USD
        NGN: 1550,  // ~1550 NGN per USD
        KES: 153,   // ~153 KES per USD
      };

      cachedRates = fullRates;
      cacheTimestamp = Date.now();
      setRates(fullRates);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rates');
      // Use fallback rates if fetch fails
      const fallbackRates: ExchangeRates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        ZMW: 27.5,
        ZAR: 18.5,
        NGN: 1550,
        KES: 153,
        CAD: 1.36,
      };
      setRates(fallbackRates);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // Update user's currency preference
  const setCurrency = async (code: CurrencyCode) => {
    setCurrencyState(code);
    
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('profiles')
      .update({ currency: code })
      .eq('id', user.id);
  };

  // Convert amount between currencies
  const convertAmount = useCallback(
    (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
      if (!rates || from === to) return amount;
      
      // Convert to USD first, then to target currency
      const inUSD = amount / (rates[from] || 1);
      return inUSD * (rates[to] || 1);
    },
    [rates]
  );

  // Format amount in user's preferred currency
  const formatAmount = useCallback(
    (amount: number, fromCurrency: CurrencyCode = 'USD'): string => {
      if (!amount && amount !== 0) return '—';
      
      const converted = convertAmount(amount, fromCurrency, currency);
      const currencyInfo = CURRENCIES[currency];
      
      // Format with appropriate decimal places
      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(converted);

      return `${currencyInfo.symbol}${formatted}`;
    },
    [currency, convertAmount]
  );

  return {
    currency,
    setCurrency,
    rates,
    loading,
    error,
    formatAmount,
    convertAmount,
    lastUpdated,
    refreshRates: fetchRates,
  };
}

