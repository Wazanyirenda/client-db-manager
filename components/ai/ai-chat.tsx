"use client";

import { useState } from "react";
import { useClients } from "@/lib/hooks/use-clients";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useAI } from "@/lib/hooks/use-ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatCircleDots, X } from "@phosphor-icons/react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { clients } = useClients();
  const { tasks } = useTasks();
  const { loading, error, askChat } = useAI();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");

    // Build a lightweight context snapshot for the AI
    const context = {
      stats: {
        totalClients: clients.length,
        payingClients: clients.filter((c) => c.client_type === "Paying").length,
        leads: clients.filter((c) => c.client_type === "Lead").length,
        tasksTotal: tasks.length,
        tasksOpen: tasks.filter((t) => !t.completed).length,
      },
      sampleClients: clients.slice(0, 15).map((c) => ({
        id: c.id,
        name: c.name,
        type: c.client_type,
        status: c.status,
        pipeline_stage: c.pipeline_stage,
        invoice_status: c.invoice_status,
        next_follow_up: c.next_follow_up,
      })),
      sampleTasks: tasks.slice(0, 15).map((t) => ({
        id: t.id,
        title: t.title,
        due_at: t.due_at,
        completed: t.completed,
      })),
    };

    const reply = await askChat(userText, context);
    if (reply) {
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-40 inline-flex items-center justify-center w-11 h-11 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <ChatCircleDots className="h-5 w-5" weight="fill" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 lg:bottom-16 lg:right-8 z-40 w-[90vw] max-w-sm rounded-xl border border-gray-200 bg-white shadow-2xl flex flex-col max-h-[70vh]">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white">
                <ChatCircleDots className="h-4 w-4" weight="fill" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Cliently AI Assistant</p>
                <p className="text-[11px] text-gray-500">
                  Ask about clients, tasks, or next steps.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="h-4 w-4" weight="bold" />
            </button>
          </div>

          <div className="flex-1 min-h-0 px-3 py-2 overflow-y-auto space-y-2 text-xs">
            {messages.length === 0 && (
              <p className="text-gray-500">
                Example questions:
                {" "}
                <span className="block mt-1">
                  • Which clients need follow-ups today?
                </span>
                <span className="block">
                  • Where should I focus to improve?
                </span>
              </p>
            )}
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-2.5 py-1.5 whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  } text-[11px]`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-2 space-y-1">
            {error && <p className="text-[11px] text-red-600">{error}</p>}
            <div className="flex items-end gap-1">
              <Textarea
                rows={2}
                className="text-xs resize-none"
                placeholder="Ask a question about your pipeline..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >
                {loading ? "..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

