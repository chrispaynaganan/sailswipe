"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AUTO_REPLIES, type Thread } from "@/lib/data";
import { nowTime, uid, useStore } from "../store";
import { Button, Header, Icon, SwipeRow, TextAction, cn, ease } from "../ui";

const preview = (t: Thread) => {
  const last = t.messages[t.messages.length - 1];
  if (!last) return "Say hi!";
  return (last.from === "me" ? "You: " : "") + last.text;
};

function ThreadRow({ t, onOpen, select }: { t: Thread; onOpen?: () => void; select?: { on: boolean; toggle: () => void } }) {
  const inner = (
    <div className="flex items-center gap-4 px-4 py-2.5">
      <img src={t.contact.avatar} alt="" width={50} height={50} className="size-12.5 shrink-0 rounded-full object-cover" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-end justify-between gap-3">
          <span className="flex items-center gap-1.75 text-base text-n-900">
            {t.contact.name}
            {t.unread && <span className="size-1.75 rounded-full bg-p-600" />}
          </span>
          <span className="shrink-0 text-xs text-n-600">{t.time}</span>
        </div>
        <p className={cn("line-clamp-2 h-6.25 text-xs leading-tight", t.unread ? "text-n-800" : "text-n-600")}>{preview(t)}</p>
      </div>
    </div>
  );
  if (select) {
    return (
      <button type="button" onClick={select.toggle} className="flex w-full cursor-pointer items-center text-left">
        <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 52, opacity: 1 }} className="flex shrink-0 justify-end">
          <span className={cn("flex size-5.5 items-center justify-center rounded-full border-2", select.on ? "border-p-600 bg-p-600" : "border-n-700")}>
            {select.on && (
              <svg viewBox="0 0 12 12" className="size-3 text-n-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 6.5 5 9l4.5-6" />
              </svg>
            )}
          </span>
        </motion.span>
        <span className="min-w-0 flex-1">{inner}</span>
      </button>
    );
  }
  return (
    <button type="button" onClick={onOpen} className="block w-full cursor-pointer text-left transition hover:bg-n-200/60">
      {inner}
    </button>
  );
}

export function Messages() {
  const { threads, setThreads, push, pop, done } = useStore();
  const active = threads.filter((t) => !t.archived);
  return (
    <div className="absolute inset-0 flex flex-col pt-13.25 pb-21.25">
      <Header
        title="Messages"
        onBack={pop}
        right={
          <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => push({ s: "archive" })} aria-label="Archived messages" className="flex cursor-pointer text-ink">
            <Icon name="archive" />
          </motion.button>
        }
      />
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <AnimatePresence initial={false}>
          {active.map((t) => (
            <motion.div key={t.id} layout exit={{ opacity: 0, x: -60, height: 0 }} transition={{ duration: 0.3, ease }}>
              <SwipeRow
                onArchive={() => {
                  done("archive");
                  setThreads((ts) => ts.map((x) => (x.id === t.id ? { ...x, archived: true } : x)));
                }}
              >
                <ThreadRow
                  t={t}
                  onOpen={() => {
                    setThreads((ts) => ts.map((x) => (x.id === t.id ? { ...x, unread: false } : x)));
                    push({ s: "chat", id: t.id });
                  }}
                />
              </SwipeRow>
            </motion.div>
          ))}
        </AnimatePresence>
        {active.length === 0 && <p className="px-10 pt-40 text-center text-sm text-n-700">No conversations yet. Swipe right on a card to say hello.</p>}
        {active.length > 0 && <p className="px-6 pt-6 text-center text-2xs text-n-600">Tip: swipe a conversation left to archive it.</p>}
      </div>
    </div>
  );
}

export function Archive() {
  const { threads, setThreads, pop, push } = useStore();
  const [editing, setEditing] = useState(false);
  const [sel, setSel] = useState<string[]>([]);
  const archived = threads.filter((t) => t.archived);
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const restore = () => {
    setThreads((ts) => ts.map((t) => (sel.includes(t.id) ? { ...t, archived: false } : t)));
    setSel([]);
    setEditing(false);
  };
  return (
    <div className={cn("absolute inset-0 flex flex-col pt-13.25", editing ? "pb-8.5" : "pb-21.25")}>
      <Header
        title="Archive"
        onBack={pop}
        right={
          archived.length > 0 && (
            <TextAction
              onClick={() => {
                setEditing((e) => !e);
                setSel([]);
              }}
            >
              {editing ? "Done" : "Edit"}
            </TextAction>
          )
        }
      />
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <AnimatePresence initial={false}>
          {archived.map((t) => (
            <motion.div key={t.id} layout exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease }}>
              <ThreadRow t={t} onOpen={() => push({ s: "chat", id: t.id })} select={editing ? { on: sel.includes(t.id), toggle: () => toggle(t.id) } : undefined} />
            </motion.div>
          ))}
        </AnimatePresence>
        {archived.length === 0 && <p className="px-10 pt-40 text-center text-sm text-n-700">Nothing archived.</p>}
      </div>
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="relative z-40 px-4 pb-px">
            <Button variant="danger" disabled={sel.length === 0} onClick={restore} className="w-full">
              Unarchive ({sel.length}) Message{sel.length === 1 ? "" : "s"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Chat({ id }: { id: string }) {
  const { threads, setThreads, pop, done } = useStore();
  const t = threads.find((x) => x.id === id);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const msgs = t?.messages ?? [];
  const waiting = Boolean(t?.fresh && msgs.some((m) => m.from === "me") && !msgs.some((m) => m.from === "them"));

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs.length, typing]);

  // A new contact answers after a little while, which unlocks the composer
  useEffect(() => {
    if (!waiting || !t) return;
    const a = setTimeout(() => setTyping(true), 2200);
    const b = setTimeout(() => {
      setTyping(false);
      const reply = AUTO_REPLIES[t.contact.id] ?? "Hey! Thanks for the message.";
      setThreads((ts) =>
        ts.map((x) => (x.id === t.id ? { ...x, fresh: false, time: nowTime(), messages: [...x.messages, { id: uid(), from: "them", text: reply, time: nowTime() }] } : x)),
      );
    }, 5200);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [waiting, t, setThreads]);

  if (!t) return null;

  const send = () => {
    const v = text.trim();
    if (!v || waiting) return;
    done("message");
    const first = msgs.length === 0;
    setThreads((ts) =>
      ts.map((x) =>
        x.id === t.id ? { ...x, time: nowTime(), messages: [...x.messages, { id: uid(), from: "me", text: v, time: first ? nowTime() : undefined }] } : x,
      ),
    );
    setText("");
  };

  return (
    <div className="absolute inset-0 flex flex-col pt-13.25 pb-21.25">
      <Header
        onBack={pop}
        titleSlot={
          <div className="absolute top-4.5 left-1/2 flex w-25 -translate-x-1/2 flex-col items-center gap-2">
            <img src={t.contact.avatar} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
            <span className="truncate text-xs text-ink">{t.contact.name}</span>
          </div>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-4 scrollbar-none">
        {msgs.length === 0 ? (
          <p className="m-auto max-w-68.25 text-center text-xs text-n-700">
            Start a conversation with {t.contact.name.split(" ")[0]}! Send a message to say hi or ask anything.
          </p>
        ) : (
          <div className="flex flex-col gap-4 pb-4">
            <AnimatePresence initial={false}>
              {msgs.map((m) => (
                <motion.div key={m.id} layout initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease }} className="flex flex-col gap-3">
                  {m.time && <span className="text-center text-xs text-n-600">{m.time}</span>}
                  <p
                    className={cn(
                      "p-2.5 text-sm",
                      m.from === "me"
                        ? "max-w-52 self-end rounded-2xl rounded-br-md bg-p-700 text-right text-n-100"
                        : "max-w-47.5 self-start rounded-2xl rounded-bl-md bg-n-200 text-n-900",
                    )}
                  >
                    {m.text}
                  </p>
                </motion.div>
              ))}
              {typing && (
                <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1 self-start rounded-2xl rounded-bl-md bg-n-200 px-3.5 py-3">
                  {[0, 1, 2].map((d) => (
                    <motion.span key={d} animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }} className="size-1.5 rounded-full bg-n-600" />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <div ref={end} />
      </div>
      <div className="shrink-0 px-4 pb-3.75">
        <AnimatePresence>
          {waiting && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mx-auto mb-3.25 max-w-68.25 text-center text-xs text-n-700">
              You cannot send another message until the other person replies.
            </motion.p>
          )}
        </AnimatePresence>
        <form
          className="flex gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            value={text}
            disabled={waiting}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your message ..."
            aria-label="Message"
            className="h-10 min-w-0 flex-1 rounded-field bg-n-200 px-4 text-sm text-n-800 outline-none focus:ring-1 focus:ring-p-500 disabled:cursor-not-allowed"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.92 }}
            disabled={waiting}
            aria-label="Send"
            className="flex h-10 w-19.5 cursor-pointer items-center justify-center rounded-field bg-p-700 text-n-100 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="send" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
