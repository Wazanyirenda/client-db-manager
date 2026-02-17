"use client";

import { useEffect, useState } from "react";
import { useAI } from "@/lib/hooks/use-ai";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkle } from "@phosphor-icons/react";

interface AiDashboardSummaryProps {
  stats: any;
}

export function AiDashboardSummary({ stats }: AiDashboardSummaryProps) {
  const { loading, error, getDashboardSummary } = useAI();
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    // Generate summary automatically on mount
    const run = async () => {
      const result = await getDashboardSummary(stats);
      if (result) {
        setText(result);
      }
    };
    void run();
  }, [stats, getDashboardSummary]);

  const handleRefresh = async () => {
    const result = await getDashboardSummary(stats);
    if (result) {
      setText(result);
    }
  };

  return (
    <div className="border border-blue-100 bg-blue-50/70 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
            <Sparkle className="h-5 w-5" weight="fill" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">AI Summary & Focus</p>
            <p className="text-xs text-gray-600">
              Gemini reviews your stats and suggests what to focus on.
            </p>
          </div>
        </div>
        <Badge className="bg-white text-blue-700 border-blue-200 text-xs px-2 py-0.5">
          Gemini
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 text-xs"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "Updating..." : "Refresh insights"}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      <div className="rounded-md bg-white/90 border border-blue-100 p-3 text-xs text-gray-800 min-h-[80px] whitespace-pre-wrap">
        {text || "Loading AI summary..."}
      </div>
    </div>
  );
}
