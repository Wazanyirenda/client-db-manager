import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODEL = 'gemini-1.5-flash';

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, data } = body as { action?: string; data?: any };

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    }

    const model = getModel();

    switch (action) {
      case 'client-insights': {
        const { client } = data || {};
        if (!client) {
          return NextResponse.json({ error: 'Missing client' }, { status: 400 });
        }

        const prompt = `
You are an expert CRM assistant for a small business using a tool called Cliently.
You are helping the user understand one client and how to improve the relationship.

Client data (JSON):
${JSON.stringify(client, null, 2)}

Using this data, write a short, practical analysis with this structure:

1) Short Summary (2–3 sentences)
2) Risks & Red Flags (bullet list, focus on follow-up gaps, overdue invoices, churn risk)
3) Recommended Next Actions (3–6 numbered, concrete steps the user can take)
4) Growth Opportunities (how they can upsell, offer more services, or improve the relationship)

Keep language simple and friendly. Make suggestions specific, not generic.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return NextResponse.json({ text });
      }

      case 'draft-email': {
        const { client, goal, extraContext } = data || {};
        if (!client) {
          return NextResponse.json({ error: 'Missing client' }, { status: 400 });
        }

        const prompt = `
You are helping write a follow-up email inside a CRM called Cliently.

Client data:
${JSON.stringify(client, null, 2)}

Goal of this email: ${goal || 'friendly follow-up and check-in'}
Extra context from the user (optional): ${extraContext || 'none'}

Write a concise, friendly email in plain text with this format:

Subject: ...

Hi {client name},
...

Best regards,
{Your name}

Keep it:
- Short (5–8 sentences in the body)
- Clear and easy to understand
- Focused on one main goal (follow-up / payment / booking a call / confirming details)
Do not add boilerplate legal text. Do not invent discounts or promises.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return NextResponse.json({ text });
      }

      case 'dashboard-summary': {
        const { stats } = data || {};
        if (!stats) {
          return NextResponse.json({ error: 'Missing stats' }, { status: 400 });
        }

        const prompt = `
You are summarizing the health of a small business pipeline based on these stats:

${JSON.stringify(stats, null, 2)}

Write:
1) A short overview paragraph (2–3 sentences) describing how things are going.
2) A \"Focus for today\" list with 3–5 bullet points, each starting with a verb (\"Follow up with...\", \"Collect payment from...\").

Be specific and practical. Assume the user is busy and wants quick guidance.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return NextResponse.json({ text });
      }

      case 'chat': {
        const { message, context } = data || {};
        if (!message) {
          return NextResponse.json({ error: 'Missing message' }, { status: 400 });
        }

        const safeContext = JSON.stringify(context || {}, null, 2);

        const prompt = `
You are an AI assistant inside a CRM called Cliently.
You help the user understand their clients, tasks, and pipeline, and suggest practical next steps.

Context (JSON summary of their data, may be partial):
${safeContext}

User question:
${message}

Answer clearly and briefly. When helpful, suggest concrete next steps or improvements, but do not invent data that is not in the context.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return NextResponse.json({ text });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: any) {
    console.error('AI route error:', err);
    if (err.message && err.message.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Failed to process AI request.' }, { status: 500 });
  }
}

