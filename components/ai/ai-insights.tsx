"use client";

import { useState } from "react";
import type { Client } from "@/lib/hooks/use-clients";
import { useAI } from "@/lib/hooks/use-ai";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkle } from "@phosphor-icons/react";

interface AiInsightsProps {
  client: Client;
}

export function AiInsights({ client }: AiInsightsProps) {
  const { loading, error, getClientInsights } = useAI();
  const [text, setText] = useState<string | null>(null);

  const handleGenerate = async () => {
    const result = await getClientInsights(client);
    if (result) {
      setText(result);
    }
  };

  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white">
            <Sparkle className="h-4 w-4" weight="fill" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">AI Client Insights</p>
            <p className="text-xs text-gray-600">
              Gemini reviews this client and suggests improvements.
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
          className="h-8 text-xs"
          onClick={handleGenerate}
          disabled={loading}
        >
          <Sparkle className="h-4 w-4 mr-1" weight="fill" />
          {loading ? "Thinking..." : "Review & suggest improvements"}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {text && (
        <div className="mt-1 rounded-md bg-white/80 border border-blue-100 p-3 text-xs text-gray-800 max-h-64 overflow-y-auto whitespace-pre-wrap">
          {text}
        </div>
      )}
    </div>
  );
}
