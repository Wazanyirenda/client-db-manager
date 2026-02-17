import { useState, useCallback } from 'react';
import type { Client } from '@/lib/hooks/use-clients';

export type AiAction =
  | 'client-insights'
  | 'draft-email'
  | 'dashboard-summary'
  | 'chat';

interface AiResponse {
  text: string;
  error?: string;
}

async function callAiAPI(action: AiAction, data: any): Promise<AiResponse> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, data }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'AI request failed');
    }
    return { text: json.text || '', error: undefined };
  } catch (err: any) {
    return { text: '', error: err.message || 'AI request failed' };
  }
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withState = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        return await fn();
      } catch (err: any) {
        setError(err.message || 'AI request failed');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getClientInsights = useCallback(
    async (client: Client) =>
      withState(async () => {
        const res = await callAiAPI('client-insights', { client });
        if (res.error) throw new Error(res.error);
        return res.text;
      }),
    [withState]
  );

  const draftEmail = useCallback(
    async (client: Client, options?: { goal?: string; extraContext?: string }) =>
      withState(async () => {
        const res = await callAiAPI('draft-email', {
          client,
          goal: options?.goal,
          extraContext: options?.extraContext,
        });
        if (res.error) throw new Error(res.error);
        return res.text;
      }),
    [withState]
  );

  const getDashboardSummary = useCallback(
    async (stats: any) =>
      withState(async () => {
        const res = await callAiAPI('dashboard-summary', { stats });
        if (res.error) throw new Error(res.error);
        return res.text;
      }),
    [withState]
  );

  const askChat = useCallback(
    async (message: string, context?: any) =>
      withState(async () => {
        const res = await callAiAPI('chat', { message, context });
        if (res.error) throw new Error(res.error);
        return res.text;
      }),
    [withState]
  );

  return {
    loading,
    error,
    getClientInsights,
    draftEmail,
    getDashboardSummary,
    askChat,
  };
}

