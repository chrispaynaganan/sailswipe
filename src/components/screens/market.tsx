"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LISTINGS, LISTING_DETAIL_OVERRIDES } from "@/lib/data";
import { useStore } from "../store";
import { BackButton, Button, Icon, cn, ease } from "../ui";

export function Marketplace() {
  const { push, myListings, done } = useStore();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const all = [...myListings.filter((l) => !l.id.startsWith("my-")), ...LISTINGS];
  const searching = focus || q.length > 0;
  const shown = q ? all.filter((l) => (l.name + " " + l.description).toLowerCase().includes(q.toLowerCase())) : all;

  return (
    <div className="absolute inset-0 flex flex-col pt-13.25 pb-21.25">
      <motion.header
        animate={{ height: searching ? 0 : 97, opacity: searching ? 0 : 1 }}
        transition={{ duration: 0.3, ease }}
        className="relative shrink-0 overflow-hidden border-b border-n-200 bg-white"
      >
        <h1 className="absolute top-8.75 left-3.75 text-2xl font-medium text-ink">Marketplace</h1>
      </motion.header>
      <div className="shrink-0 px-4 py-2.5">
        <label className={cn("flex h-12 items-center gap-2.5 rounded-field border px-4 transition-colors", focus ? "border-p-500" : "border-n-500")}>
          <Icon name="search" className="text-n-800" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder="Search Marketplace"
            aria-label="Search Marketplace"
            className="min-w-0 flex-1 bg-transparent text-sm text-n-900 outline-none"
          />
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setQ("")} aria-label="Clear search" className="flex cursor-pointer text-ink">
            <Icon name="clear" className="size-2.75" />
          </button>
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 scrollbar-none">
        <p className="mt-2.25 mb-3.25 text-base text-black">{q ? `${shown.length} result${shown.length === 1 ? "" : "s"} for “${q}”` : "Recommended for You"}</p>
        <motion.div layout className="grid grid-cols-2 gap-4">
          <AnimatePresence initial={false}>
            {shown.map((l, i) => (
              <motion.button
                key={l.id}
                layout
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 6) * 0.04 } }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  done("market");
                  push({ s: "marketItem", id: l.id });
                }}
                className="flex cursor-pointer flex-col gap-1.75 rounded-2xl border border-n-200 px-2 pt-2 pb-3 text-left transition hover:shadow-seg"
              >
                <span className="block h-43.25 overflow-hidden rounded-lg bg-photo">
                  <img src={l.photo} alt="" className="size-full object-cover transition duration-500 hover:scale-105" />
                </span>
                <span className="flex flex-col gap-0.75 px-px">
                  <span className="truncate text-sm text-black">{l.name}</span>
                  <span className="flex justify-between text-xs text-n-600">
                    <span>{l.price}</span>
                    <span>{l.date}</span>
                  </span>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
        {shown.length === 0 && <p className="pt-20 text-center text-sm text-n-600">Nothing matches that yet. Try “raft” or “GPS”.</p>}
      </div>
    </div>
  );
}

export function MarketItem({ id }: { id: string }) {
  const { pop, openChat, myListings } = useStore();
  const base = [...myListings, ...LISTINGS].find((l) => l.id === id);
  const [more, setMore] = useState(false);
  if (!base) return null;
  const l = { ...base, ...LISTING_DETAIL_OVERRIDES[id] };
  const mine = l.seller.id === "me";
  return (
    <div className="absolute inset-0 flex flex-col pb-21.25">
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
        <motion.div initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 0.6, ease }} className="relative h-129.75 bg-photo">
          <img src={l.photo} alt="" className="size-full object-cover" />
          <div className="absolute top-16 left-4 flex size-9 items-center justify-center rounded-full bg-n-100/90 backdrop-blur-xs">
            <BackButton onClick={pop} />
          </div>
        </motion.div>
        <div className="flex flex-col gap-2 px-4 pt-3.5">
          <h1 className="truncate text-2xl font-medium text-black">{l.name}</h1>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5">
              <img src={l.seller.avatar} alt="" width={35} height={35} className="size-8.75 rounded-full object-cover" />
              <span className="text-xs text-n-900">{l.seller.name}</span>
            </span>
            <span className="text-xs text-n-600">{l.date}</span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 px-4 pt-4 pb-4">
          <motion.p layout className={cn("text-xs text-n-600", !more && "line-clamp-3")}>
            {l.description}
          </motion.p>
          {l.description.length > 160 && (
            <button type="button" onClick={() => setMore((m) => !m)} className="cursor-pointer text-xs text-black underline decoration-from-font">
              {more ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between border-t border-n-200 px-4 py-2.5">
        <span className="text-base text-n-900">{l.price}</span>
        <Button className="w-43" disabled={mine} onClick={() => openChat(l.seller)}>
          {mine ? "Your listing" : "Message"}
        </Button>
      </div>
    </div>
  );
}
