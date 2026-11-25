"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LISTINGS, REPORTS, THREADS, type Listing, type Opportunity, type Report, type Thread } from "@/lib/data";
import { About, ChangePassword, Settings } from "./screens/settings";
import { Account, BoatView, Boats, MyAccount, MyListings, MyOpportunities, MySailingProfile } from "./screens/account";
import { ForgotDone, ForgotEmail, ForgotReset, ForgotVerify, Login, Register, Splash } from "./screens/auth";
import { BoatCreate, BoatDone, ListingCreate, OppCreate, OppDone, ProfileCreate, ProfileDone, QualAdd, ReportCreate, VoyageAdd } from "./screens/create";
import { Charters, Crew, Opportunities } from "./screens/home";
import { MarketItem, Marketplace } from "./screens/market";
import { Archive, Chat, Messages } from "./screens/messages";
import { Formality, Port, ReportView } from "./screens/port";
import { CHROME, GOALS, StoreCtx, type Boat, type Goal, type Qualification, type Route, type SailingProfile, type ScreenName, type Store, type Voyage } from "./store";
import { HomeIndicator, StatusBar, TabBar, cn, ease, type TabKey } from "./ui";

function render(r: Route): ReactNode {
  switch (r.s) {
    case "splash": return <Splash />;
    case "login": return <Login />;
    case "register": return <Register />;
    case "forgotEmail": return <ForgotEmail />;
    case "forgotVerify": return <ForgotVerify />;
    case "forgotReset": return <ForgotReset />;
    case "forgotDone": return <ForgotDone />;
    case "opportunities": return <Opportunities />;
    case "crew": return <Crew />;
    case "charters": return <Charters />;
    case "marketplace": return <Marketplace />;
    case "port": return <Port view={r.view} />;
    case "messages": return <Messages />;
    case "archive": return <Archive />;
    case "chat": return <Chat id={r.id} />;
    case "account": return <Account />;
    case "myAccount": return <MyAccount />;
    case "sailingProfile": return <MySailingProfile />;
    case "profileCreate": return <ProfileCreate />;
    case "profileDone": return <ProfileDone />;
    case "qualAdd": return <QualAdd />;
    case "voyageAdd": return <VoyageAdd />;
    case "boats": return <Boats />;
    case "boatView": return <BoatView id={r.id} />;
    case "boatCreate": return <BoatCreate />;
    case "boatDone": return <BoatDone />;
    case "myOpps": return <MyOpportunities />;
    case "oppCreate": return <OppCreate />;
    case "oppDone": return <OppDone />;
    case "listings": return <MyListings />;
    case "listingCreate": return <ListingCreate />;
    case "marketItem": return <MarketItem id={r.id} />;
    case "marketSearch": return <Marketplace />;
    case "reportView": return <ReportView id={r.id} />;
    case "reportCreate": return <ReportCreate />;
    case "formality": return <Formality />;
    case "settings": return <Settings />;
    case "changePassword": return <ChangePassword />;
    case "about": return <About />;
  }
}

const keyOf = (r: Route, depth: number) => `${depth}:${JSON.stringify(r)}`;

const MY_LISTINGS: Listing[] = [
  { ...LISTINGS[0], id: "my-raymarine", seller: { id: "me", name: "Andrew Longbottom", avatar: "/img/av-andrew.webp" }, price: "$99.99", description: "Spare chartplotter, works perfectly." },
  { ...LISTINGS[5], id: "my-solar", seller: { id: "me", name: "Andrew Longbottom", avatar: "/img/av-andrew.webp" }, price: "$99.99", description: "Two panels and a controller." },
];

const QUALS: Qualification[] = [
  { id: "q1", org: "CWO", level: "CWO I JaZ Tidal" },
  { id: "q2", org: "NFB Sweden", level: "CWO II JaZ Tidal" },
  { id: "q3", org: "NFB Sweden", level: "CWO III JaZ Tidal" },
];
const VOYAGES: Voyage[] = [
  { id: "v1", from: "Floreana", to: "Lyford Cay", year: "2006" },
  { id: "v2", from: "Nassau", to: "Spanish Wells", year: "2009" },
  { id: "v3", from: "Pago Pago", to: "Esmeraldas", year: "2012" },
];

export function SailSwipe() {
  const [stack, setStack] = useState<Route[]>([{ s: "splash" }]);
  const [dir, setDir] = useState<1 | -1 | 0>(0);
  const [threads, setThreadsState] = useState<Thread[]>(THREADS);
  const [profile, setProfile] = useState<SailingProfile | null>(null);
  const [quals, setQualsState] = useState(QUALS);
  const [voyages, setVoyagesState] = useState(VOYAGES);
  const [boats, setBoatsState] = useState<Boat[]>([]);
  const [myOpps, setMyOppsState] = useState<Opportunity[]>([]);
  const [myListings, setMyListingsState] = useState(MY_LISTINGS);
  const [reports, setReportsState] = useState<Report[]>(REPORTS);
  const [deck, setDeckState] = useState<Record<string, number>>({});
  const [goals, setGoals] = useState<Set<Goal>>(new Set());
  const [toastMsg, setToastMsg] = useState<{ id: number; text: string } | null>(null);
  const [lastTab, setLastTab] = useState<TabKey>("opportunities");

  const route = stack[stack.length - 1];

  const push = useCallback((r: Route) => {
    setDir(1);
    setStack((s) => [...s, r]);
  }, []);
  const pop = useCallback(() => {
    setDir(-1);
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);
  const reset = useCallback((r: Route | Route[]) => {
    setDir(0);
    setStack(Array.isArray(r) ? r : [r]);
  }, []);
  const replace = useCallback((r: Route) => {
    setDir(1);
    setStack((s) => [...s.slice(0, -1), r]);
  }, []);
  const stackRef = useRef(stack);
  stackRef.current = stack;
  const popTo = useCallback((name: ScreenName) => {
    const i = stackRef.current.map((r) => r.s).lastIndexOf(name);
    if (i < 0) return false;
    setDir(-1);
    setStack((s) => s.slice(0, i + 1));
    return true;
  }, []);
  const goTab = useCallback((t: TabKey) => {
    setDir(0);
    setStack([{ s: t }]);
  }, []);
  const done = useCallback((g: Goal) => setGoals((s) => (s.has(g) ? s : new Set(s).add(g))), []);
  const toast = useCallback((text: string) => setToastMsg({ id: Date.now(), text }), []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2600);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const openChat = useCallback(
    (c: { id: string; name: string; avatar: string }) => {
      setThreadsState((ts) => {
        const hit = ts.find((t) => t.contact.id === c.id);
        if (hit) return ts.map((t) => (t.id === hit.id ? { ...t, archived: false, unread: false } : t));
        return [{ id: c.id, contact: c, time: "now", fresh: true, messages: [] }, ...ts];
      });
      setDir(1);
      setStack((s) => [...s, { s: "chat", id: c.id }]);
    },
    [],
  );

  const chrome = CHROME[route.s];
  const tab: TabKey | null = chrome ? (chrome === "current" ? lastTab : chrome) : null;
  useEffect(() => {
    if (tab && stack.length === 1) setLastTab(tab);
  }, [tab, stack.length]);

  const store: Store = useMemo(
    () => ({
      route,
      push,
      pop,
      reset,
      replace,
      popTo,
      goTab,
      done,
      toast,
      threads,
      setThreads: setThreadsState,
      openChat,
      profile,
      setProfile,
      quals,
      setQuals: setQualsState,
      voyages,
      setVoyages: setVoyagesState,
      boats,
      setBoats: setBoatsState,
      myOpps,
      setMyOpps: setMyOppsState,
      myListings,
      setMyListings: setMyListingsState,
      reports,
      setReports: setReportsState,
      deck,
      setDeck: (k, n) => setDeckState((d) => ({ ...d, [k]: n })),
    }),
    [route, push, pop, reset, replace, popTo, goTab, done, toast, threads, openChat, profile, quals, voyages, boats, myOpps, myListings, reports, deck],
  );

  // Handy for automated screenshots: window.__sailswipe.reset([...])
  useEffect(() => {
    (window as unknown as { __sailswipe: object }).__sailswipe = { reset, push, setProfile, setBoats: setBoatsState };
  }, [reset, push]);

  const restart = () => {
    setStack([{ s: "splash" }]);
    setDir(0);
    setThreadsState(THREADS);
    setProfile(null);
    setQualsState(QUALS);
    setVoyagesState(VOYAGES);
    setBoatsState([]);
    setMyOppsState([]);
    setMyListingsState(MY_LISTINGS);
    setReportsState(REPORTS);
    setDeckState({});
    setGoals(new Set());
  };

  const phone = (
    <StoreCtx.Provider value={store}>
      <div className="relative size-full overflow-hidden bg-n-100 font-sans text-ink">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={keyOf(route, stack.length)}
            custom={dir}
            variants={{
              enter: (d: number) => (d === 0 ? { opacity: 0 } : { x: d > 0 ? "100%" : "-30%", opacity: d > 0 ? 1 : 0.6 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => (d === 0 ? { opacity: 0 } : { x: d > 0 ? "-30%" : "100%", opacity: d > 0 ? 0.6 : 1 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: dir === 0 ? 0.25 : 0.38, ease }}
            className={cn("absolute inset-0 bg-n-100", dir !== 0 && "shadow-sheet")}
          >
            {render(route)}
          </motion.div>
        </AnimatePresence>
        {tab && <TabBar active={tab} onSelect={goTab} />}
        <StatusBar />
        <HomeIndicator />
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              key={toastMsg.id}
              role="status"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="absolute inset-x-6 top-14 z-50 rounded-xl bg-p-900 px-4 py-3 text-center text-sm text-n-100 shadow-alert"
            >
              {toastMsg.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StoreCtx.Provider>
  );

  return <PhoneShell phone={phone} goals={goals} onRestart={restart} />;
}

function PhoneShell({ phone, goals, onRestart }: { phone: ReactNode; goals: Set<Goal>; onRestart: () => void }) {
  const [mode, setMode] = useState<"framed" | "full" | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      setMode(window.innerWidth < 640 ? "full" : "framed");
      setScale(Math.min(1, (window.innerHeight - 64) / 852));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  if (mode === null) return <div className="h-dvh bg-desk" />;
  if (mode === "full") return <div className="fixed inset-0 overflow-hidden">{phone}</div>;

  const count = GOALS.filter((g) => goals.has(g.key)).length;

  return (
    <main className="flex min-h-dvh items-center justify-center gap-16 bg-desk px-8 py-8 font-sans">
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease }}
        className="hidden w-80 shrink-0 flex-col gap-6 lg:flex"
      >
        <img src="/img/logo.png" alt="SailSwipe" width={96} height={96} className="-ml-3 size-24" />
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium tracking-widest text-p-600 uppercase">Mobile app · interactive preview</p>
          <h1 className="text-3xl leading-tight font-medium text-p-900">Find a boat. Find a crew. Swipe.</h1>
          <p className="text-sm leading-relaxed text-n-700">
            SailSwipe matches skippers with crew, lists charters and gear, and keeps port formalities in one place. Drag a card right to message, left to pass.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-seg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-n-900">Things to try</p>
            <span className="text-xs text-n-600">
              {count}/{GOALS.length}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-n-200">
            <motion.div animate={{ width: `${(count / GOALS.length) * 100}%` }} transition={{ duration: 0.5, ease }} className="h-full rounded-full bg-p-600" />
          </div>
          <ul className="flex flex-col gap-2">
            {GOALS.map((g) => {
              const on = goals.has(g.key);
              return (
                <li key={g.key} className={cn("flex items-center gap-2.5 text-sm transition-colors", on ? "text-n-600 line-through" : "text-n-900")}>
                  <motion.span
                    animate={on ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    className={cn("flex size-4.5 shrink-0 items-center justify-center rounded-full border", on ? "border-p-600 bg-p-600" : "border-n-500")}
                  >
                    {on && (
                      <svg viewBox="0 0 12 12" className="size-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.5 6.5 5 9l4.5-6" />
                      </svg>
                    )}
                  </motion.span>
                  {g.label}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex items-center gap-4 text-xs text-n-600">
          <button type="button" onClick={onRestart} className="cursor-pointer underline decoration-from-font hover:text-p-600">
            Restart the prototype
          </button>
          <span>Designed by Chris Paynaganan</span>
        </div>
      </motion.aside>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        style={{ width: 393 * scale, height: 852 * scale }}
        className="shrink-0"
      >
        <div style={{ transform: `scale(${scale})` }} className="h-213 w-98.25 origin-top-left overflow-hidden rounded-screen shadow-device">
          {phone}
        </div>
      </motion.div>
    </main>
  );
}
