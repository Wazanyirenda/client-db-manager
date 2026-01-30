"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders, CheckCircle, Monitor, Sidebar, CurrencyDollar, ArrowsClockwise } from "@phosphor-icons/react";
import { useCurrency, CURRENCIES, CurrencyCode } from "@/lib/hooks/use-currency";

const SIDEBAR_COLLAPSED_KEY = "sidebar_collapsed";

export default function PreferencesSettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { currency, setCurrency, rates, loading: currencyLoading, lastUpdated, refreshRates } = useCurrency();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(SIDEBAR_COLLAPSED_KEY) : null;
    if (stored) setSidebarCollapsed(stored === "true");
  }, []);

  const handleSave = () => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
    setMessage("Preferences saved successfully!");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Display Preferences */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Monitor className="h-4 w-4 text-blue-600" weight="fill" />
            Display Preferences
          </h3>
          <p className="text-sm text-gray-500 mt-1">Customize how the app looks and behaves.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Sidebar className="h-4 w-4 text-gray-400" weight="regular" />
              Sidebar Default State
            </label>
            <Select 
              value={sidebarCollapsed ? "collapsed" : "expanded"} 
              onValueChange={(v) => setSidebarCollapsed(v === "collapsed")}
            >
              <SelectTrigger className="h-11 max-w-sm">
                <SelectValue placeholder="Select default state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expanded">
                  <div className="flex items-center gap-2">
                    <span>Expanded</span>
                    <span className="text-xs text-gray-400">- Show sidebar with labels</span>
                  </div>
                </SelectItem>
                <SelectItem value="collapsed">
                  <div className="flex items-center gap-2">
                    <span>Collapsed</span>
                    <span className="text-xs text-gray-400">- Icons only</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Choose whether the navigation sidebar should be expanded or collapsed by default when you open the app.
            </p>
          </div>
        </div>
      </div>

      {/* Currency Preferences */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <CurrencyDollar className="h-4 w-4 text-blue-600" weight="fill" />
            Currency Settings
          </h3>
          <p className="text-sm text-gray-500 mt-1">Set your preferred currency for displaying deal values and invoices.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <CurrencyDollar className="h-4 w-4 text-gray-400" weight="regular" />
              Display Currency
            </label>
            <Select 
              value={currency} 
              onValueChange={(v) => setCurrency(v as CurrencyCode)}
            >
              <SelectTrigger className="h-11 max-w-sm">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CURRENCIES).map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    <div className="flex items-center gap-2">
                      <span>{curr.flag}</span>
                      <span>{curr.code}</span>
                      <span className="text-gray-400">- {curr.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              All monetary values will be converted and displayed in this currency.
            </p>
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Exchange Rates</span>
              <button
                onClick={refreshRates}
                disabled={currencyLoading}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
              >
                <ArrowsClockwise className={`h-4 w-4 ${currencyLoading ? 'animate-spin' : ''}`} weight="bold" />
                Refresh
              </button>
            </div>
            {rates && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(CURRENCIES).slice(0, 8).map(([code, curr]) => (
                  <div key={code} className="text-xs">
                    <span className="text-gray-500">{curr.flag} 1 USD = </span>
                    <span className="font-medium text-gray-700">
                      {curr.symbol}{rates[code]?.toFixed(code === 'NGN' ? 0 : 2) || '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {lastUpdated && (
              <p className="text-xs text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <Sliders className="h-4 w-4" weight="fill" />
          More Preferences Coming Soon
        </h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>- Theme customization (light/dark mode)</li>
          <li>- Email notification settings</li>
          <li>- Date and time format preferences</li>
        </ul>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {message && (
          <span className="text-sm text-emerald-600 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" weight="fill" />
            {message}
          </span>
        )}
        <Button onClick={handleSave} className="px-6">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
