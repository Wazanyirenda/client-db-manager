"use client";

import { useState } from "react";
import type { Client } from "@/lib/hooks/use-clients";
import { useAI } from "@/lib/hooks/use-ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkle, ClipboardText } from "@phosphor-icons/react";

interface AiEmailDraftProps {
  client: Client;
}

export function AiEmailDraft({ client }: AiEmailDraftProps) {
  const { loading, error, draftEmail } = useAI();
  const [goal, setGoal] = useState<string>("follow up and move the deal forward");
  const [emailText, setEmailText] = useState<string>("");

  const handleGenerate = async () => {
    const result = await draftEmail(client, { goal });
    if (result) {
      setEmailText(result);
    }
  };

  const handleCopy = async () => {
    if (!emailText) return;
    try {
      await navigator.clipboard.writeText(emailText);
      // simple feedback: we could integrate toast, but keep it minimal
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white">
            <Sparkle className="h-4 w-4" weight="fill" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">AI Follow-up Email</p>
            <p className="text-xs text-gray-600">
              Let Gemini draft a message you can tweak and send.
            </p>
          </div>
        </div>
        <Badge className="bg-white text-blue-700 border-blue-200 text-xs px-2 py-0.5">
          Gemini
        </Badge>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">
          Email goal
        </label>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
          placeholder="e.g. Follow up after sending a proposal"
        />
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
          {loading ? "Drafting..." : "Draft email"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 text-xs"
          onClick={handleCopy}
          disabled={!emailText}
        >
          <ClipboardText className="h-4 w-4 mr-1" weight="bold" />
          Copy
        </Button>
      </div>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      <Textarea
        className="mt-1 h-40 text-xs whitespace-pre-wrap"
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
        placeholder="AI email draft will appear here. You can edit it before sending."
      />
    </div>
  );
}
