"use client";

import { useEffect, useRef, useState } from "react";
import type { Critter } from "@/lib/critters";
import { markFound } from "@/lib/progress";

interface UiMessage {
  role: "critter" | "user";
  content: string;
}

interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

export default function CritterChat({ critter }: { critter: Critter }) {
  const [messages, setMessages] = useState<UiMessage[]>([
    { role: "critter", content: critter.greeting },
  ]);
  const [streaming, setStreaming] = useState<{ active: boolean; content: string }>({
    active: false,
    content: "",
  });
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<"live" | "offline" | null>(null);

  const historyRef = useRef<ApiMessage[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Visiting the page is how a critter is "discovered".
  useEffect(() => {
    markFound(critter.slug);
  }, [critter.slug]);

  // Let players start typing right away instead of having to click in first.
  // Skipped on small/touch screens so it doesn't yank the page and pop the
  // keyboard open before the player has read the critter's greeting.
  useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  // Keep the conversation scrolled to the newest message.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, streaming]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || pending) return;

    setInput("");
    setPending(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setStreaming({ active: true, content: "" });

    const history: ApiMessage[] = [...historyRef.current, { role: "user", content: text }];
    historyRef.current = history;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ critterSlug: critter.slug, messages: history }),
      });

      const responseMode = response.headers.get("x-calcritters-mode");
      if (responseMode === "live" || responseMode === "offline") {
        setMode(responseMode);
      }

      if (!response.ok || !response.body) {
        throw new Error(`Request failed (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setStreaming({ active: true, content: accumulated });
      }

      const reply = accumulated.trim() || "...";
      historyRef.current = [...history, { role: "assistant", content: reply }];
      setMessages((prev) => [...prev, { role: "critter", content: reply }]);
    } catch (error) {
      console.error(error);
      const apology = `${critter.name} got distracted for a second. Try saying that again?`;
      historyRef.current = history;
      setMessages((prev) => [...prev, { role: "critter", content: apology }]);
    } finally {
      setStreaming({ active: false, content: "" });
      setPending(false);
    }
  }

  return (
    <section className="chat" aria-label={`Chat with ${critter.name}`}>
      <div className="chat-head">
        <span aria-hidden="true">{critter.emoji}</span>
        <span>{critter.name}</span>
        <span className="chat-status">
          <span className={`dot${mode === "offline" ? " offline" : ""}`} aria-hidden="true" />
          {mode === "offline" ? "Demo mode" : "Online"}
        </span>
      </div>

      <div className="chat-log" ref={logRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`msg ${message.role === "user" ? "from-user" : "from-critter"}`}
          >
            <span className="who">{message.role === "user" ? "You" : critter.name}</span>
            {message.content}
          </div>
        ))}

        {streaming.active && (
          <div className="msg from-critter">
            <span className="who">{critter.name}</span>
            {streaming.content ? (
              streaming.content
            ) : (
              <span className="typing" aria-label="typing">
                <span />
                <span />
                <span />
              </span>
            )}
          </div>
        )}
      </div>

      <form className="chat-form" onSubmit={send}>
        <input
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={`Say something to ${critter.name}...`}
          maxLength={2000}
          aria-label="Your message"
          disabled={pending}
        />
        <button className="chat-send" type="submit" disabled={pending || !input.trim()}>
          Send
        </button>
      </form>

      {mode === "offline" && (
        <div className="chat-note">
          Demo mode: replies are scripted. Add an ANTHROPIC_API_KEY to power live
          conversations.
        </div>
      )}
    </section>
  );
}
