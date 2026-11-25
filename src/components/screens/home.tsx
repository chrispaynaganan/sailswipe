"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { useState, type ReactNode } from "react";
import { CHARTERS, CREW, OPPORTUNITIES, type CrewProfile, type Opportunity } from "@/lib/data";
import { useStore } from "../store";
import { ActionPair, Alert, Button, GreetingHeader, Icon, IconTabs, ReadField, Segmented, cn, ease } from "../ui";
import { CREW_TABS, InfoCard, QualRow, SUBS, SkillsCard, VoyageRow } from "./shared";

/* ------------------------------------------------------------------ shared deck */

function Greeting() {
  const { push, threads } = useStore();
  return (
    <GreetingHeader
      onAvatar={() => push({ s: "account" })}
      onInbox={() => push({ s: "messages" })}
      onSettings={() => push({ s: "settings" })}
      unread={threads.some((t) => t.unread && !t.archived)}
    />
  );
}

/** Photo card you can drag left (pass) or right (message) */
function Hero({ photo, title, sub, onPass, onLike }: { photo: string; title: string; sub: string; onPass: () => void; onLike: () => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const pass = useTransform(x, [-120, -30], [1, 0]);
  const like = useTransform(x, [30, 120], [0, 1]);
  const end = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -110 || info.velocity.x < -600) onPass();
    else if (info.offset.x > 110 || info.velocity.x > 600) onLike();
  };
  return (
    <motion.div
      drag="x"
      dragSnapToOrigin
      dragElastic={0.6}
      onDragEnd={end}
      style={{ x, rotate }}
      className="relative h-105.5 cursor-grab touch-pan-y overflow-hidden rounded-3xl bg-photo active:cursor-grabbing"
    >
      <img src={photo} alt="" draggable={false} className="pointer-events-none absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent from-35% to-ink/75" />
      <motion.span style={{ opacity: pass }} className="absolute top-6 right-6 rotate-12 rounded-lg border-2 border-error-dark px-3 py-1 text-lg font-medium text-error-dark">
        NOT INTERESTED
      </motion.span>
      <motion.span style={{ opacity: like }} className="absolute top-6 left-6 -rotate-12 rounded-lg border-2 border-n-100 px-3 py-1 text-lg font-medium text-n-100">
        MESSAGE
      </motion.span>
      <div className="absolute bottom-5 left-7.25 flex flex-col text-white">
        <span className="text-3xl font-medium">{title}</span>
        <span className="text-sm">{sub}</span>
      </div>
    </motion.div>
  );
}

function Deck<T extends { id: string }>({
  deckKey,
  items,
  render,
  onMessage,
  emptyText,
}: {
  deckKey: string;
  items: T[];
  render: (item: T, hero: (h: { photo: string; title: string; sub: string }) => ReactNode) => ReactNode;
  onMessage: (item: T) => void;
  emptyText: string;
}) {
  const { deck, setDeck, done } = useStore();
  const i = deck[deckKey] ?? 0;
  const [dir, setDir] = useState<1 | -1>(-1);
  const item = items[i];

  const pass = () => {
    setDir(-1);
    setDeck(deckKey, i + 1);
    done("swipe");
  };
  const like = () => {
    if (item) onMessage(item);
  };

  return (
    <div className="absolute inset-0 flex flex-col pt-13.25 pb-21.25">
      <Greeting />
      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          {item ? (
            <motion.div
              key={item.id}
              custom={dir}
              variants={{
                enter: { opacity: 0, scale: 0.96, y: 16 },
                center: { opacity: 1, scale: 1, y: 0, x: 0, rotate: 0, transition: { duration: 0.4, ease } },
                exit: (d: number) => ({ x: d * 420, rotate: d * 12, opacity: 0, transition: { duration: 0.35, ease } }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex flex-col"
            >
              <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
                {render(item, (h) => (
                  <Hero {...h} onPass={pass} onLike={like} />
                ))}
              </div>
              <ActionPair left="Not Interested" right="Message" onLeft={pass} onRight={like} />
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col items-center justify-center gap-4 px-10 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-p-100 text-p-700">
                <Icon name="ship" className="size-8" />
              </span>
              <p className="text-base text-n-900">{emptyText}</p>
              <p className="text-sm text-n-600">Check back soon, new posts come in every day.</p>
              <Button className="mt-2 w-45" onClick={() => setDeck(deckKey, 0)}>
                Start over
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Messaging someone off a card needs a sailing profile first */
function useNeedsProfile() {
  const { profile, push } = useStore();
  const [ask, setAsk] = useState(false);
  const guard = (fn: () => void) => () => (profile ? fn() : setAsk(true));
  const alert = (
    <Alert
      open={ask}
      title="This feature requires your Sailing Profile"
      body="To use this feature, you need to complete your Sailing Profile. Set it up now to continue!"
      cancel="Later"
      confirm="Create"
      onCancel={() => setAsk(false)}
      onConfirm={() => {
        setAsk(false);
        push({ s: "profileCreate", from: "crew" });
      }}
    />
  );
  return { guard, alert };
}

/* ------------------------------------------------------------------ opportunities & charters */

type OppTab = "opportunity" | "crew" | "costs";

function OpportunityBody({ o, hero }: { o: Opportunity; hero: ReactNode }) {
  const [tab, setTab] = useState<OppTab>("opportunity");
  return (
    <div className="flex flex-col px-4 pb-6">
      {hero}
      <div className="mt-4.25">
        <IconTabs
          value={tab}
          onChange={setTab}
          items={[
            { key: "opportunity", label: o.kind, icon: "pin" },
            { key: "crew", label: "Crew & Onboard", icon: "lifebuoy" },
            { key: "costs", label: "Costs & Travel", icon: "banknote" },
          ]}
        />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="mt-7.5 grid grid-cols-2 gap-x-4 gap-y-4"
        >
          {tab === "opportunity" && (
            <>
              <ReadField className="col-span-2" label="Description" value={o.description} />
              <ReadField label="Departure Port" value={o.from} />
              <ReadField label="Start Date" value={o.start} />
              <ReadField label="Arrival Port" value={o.to} />
              <ReadField label="Ending Date" value={o.end} />
              <ReadField label="Rally" value={o.rally} />
              <ReadField label="Auto Expires" value={o.expires} />
            </>
          )}
          {tab === "crew" && (
            <>
              <ReadField label="Total Numbers Aboard" value={o.aboard} />
              <ReadField label="Number of Crews" value={o.crews} />
              <ReadField label="Smoking Allowed" value={o.smoking} />
              <ReadField label="Cabin" value={o.cabin} />
              <ReadField className="col-span-2" label="Primary Language(s) on Board" value={o.languages} />
            </>
          )}
          {tab === "costs" && (
            <>
              <ReadField label="Money" value={o.money} />
              <ReadField label="Travel Covered" value={o.travel} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OppDeck({ deckKey, items, empty }: { deckKey: string; items: Opportunity[]; empty: string }) {
  const { openChat } = useStore();
  const { guard, alert } = useNeedsProfile();
  return (
    <>
      <Deck
        deckKey={deckKey}
        items={items}
        emptyText={empty}
        onMessage={(o) => guard(() => openChat(o.captain))()}
        render={(o, hero) => <OpportunityBody o={o} hero={hero({ photo: o.photo, title: o.name, sub: o.boat })} />}
      />
      {alert}
    </>
  );
}

export function Opportunities() {
  return <OppDeck deckKey="opportunities" items={OPPORTUNITIES} empty="You’ve seen every sailing opportunity." />;
}

export function Charters() {
  return <OppDeck deckKey="charters" items={CHARTERS} empty="You’ve seen every charter." />;
}

/* ------------------------------------------------------------------ crew */

type CrewTab = (typeof CREW_TABS)[number]["key"];
type Sub = (typeof SUBS)[number]["key"];

/** Profile & Skills / Qualifications / Voyage History, shared by the crew card and your own profile */
export function CrewDetails({ c, start = 0, compact }: { c: CrewProfile; start?: number; compact?: boolean }) {
  const [tab, setTab] = useState<CrewTab>("profile");
  const [sub, setSub] = useState<Sub>("about");
  return (
    <>
      <div className={cn(start ? "mt-4.25" : "")}>
        <IconTabs value={tab} onChange={setTab} items={CREW_TABS} />
      </div>
      {tab === "profile" && <Segmented className="mt-6" items={SUBS} value={sub} onChange={setSub} />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab + sub}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className={cn("flex flex-col gap-4", tab === "profile" ? "mt-6.25" : compact ? "mt-6" : "mt-7")}
        >
          {tab === "profile" && sub === "about" && (
            <div className="grid grid-cols-2 gap-4">
              {c.about.map((f) => (
                <ReadField key={f.label} label={f.label} value={f.value} className={f.half ? "" : "col-span-2"} />
              ))}
            </div>
          )}
          {tab === "profile" && sub === "work" && c.work.map((f) => <ReadField key={f.label} label={f.label} value={f.value} />)}
          {tab === "profile" && sub === "expertise" && (
            <>
              <SkillsCard skills={c.skills} />
              <InfoCard title="Nautical Skills">
                <p className="text-sm text-n-900">{c.nautical}</p>
              </InfoCard>
            </>
          )}
          {tab === "profile" && sub === "destinations" && (
            <>
              <InfoCard title="Geo Regions">
                <p className="text-sm text-n-700">{c.regions}</p>
              </InfoCard>
              <InfoCard title="Rallies">
                <p className="text-sm text-n-700">{c.rallies}</p>
              </InfoCard>
            </>
          )}
          {tab === "quals" && c.qualifications.map((q) => <QualRow key={q.org + q.level} {...q} />)}
          {tab === "voyages" && c.voyages.map((v) => <VoyageRow key={v.from + v.year} {...v} />)}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export function Crew() {
  const { openChat } = useStore();
  const { guard, alert } = useNeedsProfile();
  return (
    <>
      <Deck<CrewProfile>
        deckKey="crew"
        items={CREW}
        emptyText="You’ve seen every crew member nearby."
        onMessage={(c) =>
          guard(() => {
            openChat({ id: c.id, name: c.name, avatar: c.photo });
          })()
        }
        render={(c, hero) => (
          <div className="flex flex-col px-4 pb-6">
            {hero({ photo: c.photo, title: c.name, sub: c.nationality })}
            <CrewDetails c={c} start={1} />
          </div>
        )}
      />
      {alert}
    </>
  );
}
