"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { BUSINESSES, COUNTRIES, FORMALITY, PORTS, REGIONS } from "@/lib/data";
import { useStore } from "../store";
import { BackButton, FooterButton, Header, Icon, SelectField, cn, ease, type IconName } from "../ui";

type View = "formalities" | "reports" | "business";

const MENU: { key: View; label: string; icon: IconName }[] = [
  { key: "formalities", label: "Formalities", icon: "clipboard-check" },
  { key: "reports", label: "Cruising Reports", icon: "pin" },
  { key: "business", label: "Related Business", icon: "anchor" },
];

export function Port({ view: initial }: { view?: View }) {
  const { push, pop, reports } = useStore();
  const [view, setView] = useState<View>(initial ?? "business");
  const [menu, setMenu] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [port, setPort] = useState("");

  const title = MENU.find((m) => m.key === view)!.label;

  return (
    <div className="absolute inset-0 flex flex-col pt-13.25 pb-21.25">
      <Header
        onBack={pop}
        titleSlot={
          <button type="button" onClick={() => setMenu((m) => !m)} aria-expanded={menu} className="absolute top-8.75 left-13.75 flex cursor-pointer items-center gap-2.5 text-ink">
            <span className="text-2xl font-medium">Port Info</span>
            <motion.span animate={{ rotate: menu ? 180 : 0 }} className="flex">
              <Icon name="chevron-down" />
            </motion.span>
          </button>
        }
        right={
          <motion.button type="button" whileTap={{ rotate: 30, scale: 0.85 }} onClick={() => push({ s: "settings" })} aria-label="Settings" className="flex cursor-pointer text-ink">
            <Icon name="settings" />
          </motion.button>
        }
      />
      <AnimatePresence>
        {menu && (
          <>
            <motion.button type="button" aria-label="Close menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)} className="absolute inset-0 z-20 cursor-default" />
            <motion.ul
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease }}
              className="absolute top-34.75 left-6.5 z-30 flex w-30.5 origin-top-left flex-col gap-1 rounded-xl bg-white py-2 shadow-alert"
            >
              {MENU.map((m) => (
                <li key={m.key}>
                  <button
                    type="button"
                    onClick={() => {
                      setView(m.key);
                      setMenu(false);
                    }}
                    className={cn("flex w-full cursor-pointer items-center gap-2 px-2 py-1 text-xs whitespace-nowrap hover:bg-n-200", view === m.key ? "text-p-600" : "text-ink")}
                  >
                    <Icon name={m.icon} className="size-4.5" />
                    {m.label}
                  </button>
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-3.25 pb-4 scrollbar-none">
            <h2 className="mb-4 pl-0.5 text-lg text-black">{title}</h2>
            <SelectField placeholder="Select Country" options={COUNTRIES} value={country} onChange={setCountry} />
            {view === "business" && (
              <>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <SelectField placeholder="Select Region" options={REGIONS} value={region} onChange={setRegion} />
                  <SelectField placeholder="Select Port" options={PORTS} value={port} onChange={setPort} />
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  {BUSINESSES.map((b, i) => (
                    <motion.article key={b.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }} className="flex flex-col gap-4 rounded-2xl border border-n-200 p-4">
                      <div className="flex flex-col gap-1.5">
                        <h3 className="text-base text-n-900">{b.name}</h3>
                        <p className="text-sm text-n-700">{b.address}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-n-900">
                        <Contact icon="phone" href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</Contact>
                        <Contact icon="globe" href={`https://${b.web}`}>{b.web}</Contact>
                        <Contact icon="mail" href={`mailto:${b.email}`}>{b.email}</Contact>
                        <Contact icon="signal">{b.channel}</Contact>
                        <Contact icon="lng">{b.lng}</Contact>
                        <Contact icon="lat">{b.lat}</Contact>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </>
            )}
            {view === "reports" && (
              <div className="mt-2.5 flex flex-col gap-4">
                {reports.map((r, i) => (
                  <motion.button
                    key={r.id}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => push({ s: "reportView", id: r.id })}
                    className="relative flex cursor-pointer flex-col gap-4 rounded-2xl border border-n-200 p-2 text-left transition hover:shadow-seg"
                  >
                    <span className="block h-31.25 overflow-hidden rounded-lg bg-photo">
                      {r.photo ? (
                        <img src={r.photo} alt="" className="size-full object-cover" />
                      ) : (
                        <span className="flex size-full items-center justify-center bg-p-100 text-p-600">
                          <Icon name="pin" className="size-9" />
                        </span>
                      )}
                    </span>
                    <span className="absolute top-4 right-4 rounded-md bg-white/80 px-2 py-1 text-xs text-black backdrop-blur-sm">{r.tag}</span>
                    <span className="flex flex-col gap-1.5">
                      <span className="truncate text-base text-n-900">{r.title}</span>
                      <span className="line-clamp-2 text-xs text-n-700">{r.summary}</span>
                    </span>
                    <span className="flex items-center gap-2.5">
                      <img src={r.author.avatar} alt="" width={16} height={16} className="size-4 rounded-full object-cover" />
                      <span className="text-xs text-n-900">{r.author.name}</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
            {view === "formalities" &&
              (country ? (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => push({ s: "formality" })}
                  className="mt-4 flex w-full cursor-pointer flex-col gap-2 rounded-2xl border border-n-200 p-4 text-left transition hover:shadow-seg"
                >
                  <span className="text-base text-n-900">{FORMALITY.country}</span>
                  <span className="line-clamp-2 text-2xs text-n-700">{FORMALITY.overview}</span>
                  <span className="mt-1 text-2xs text-n-600">{FORMALITY.date}</span>
                </motion.button>
              ) : (
                <p className="mx-auto mt-6.5 max-w-60 text-center text-xs text-n-600">First, select a country to view the location’s formalities.</p>
              ))}
          </div>
          {view === "reports" && <FooterButton onClick={() => push({ s: "reportCreate" })}>Create Cruising Report</FooterButton>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Contact({ icon, children, href }: { icon: IconName; children: ReactNode; href?: string }) {
  const inner = (
    <>
      <Icon name={icon} className="size-5 shrink-0 text-p-700" />
      <span className="whitespace-nowrap">{children}</span>
    </>
  );
  return href ? (
    <a href={href} className="flex min-w-0 items-center gap-2.5 hover:text-p-600">
      {inner}
    </a>
  ) : (
    <span className="flex min-w-0 items-center gap-2.5">{inner}</span>
  );
}

export function ReportView({ id }: { id: string }) {
  const { reports, pop, openChat } = useStore();
  const r = reports.find((x) => x.id === id);
  if (!r) return null;
  return (
    <div className="absolute inset-0 flex flex-col pt-13.25 pb-21.25">
      <Header title={<span className="block max-w-63.75 truncate text-xl">{r.title}</span>} onBack={pop} />
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pt-2.75 pb-6 scrollbar-none">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }} className="h-21 overflow-hidden rounded-2xl bg-photo">
          {r.photo && <img src={r.photo} alt="" className="size-full object-cover" />}
        </motion.div>
        <div className="flex flex-col gap-1.5 px-2 pt-2">
          <h1 className="text-base text-n-900">{r.title}</h1>
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => r.author.id !== "me" && openChat(r.author)} className="flex cursor-pointer items-center gap-2.5 text-xs text-n-900 hover:text-p-600">
              <img src={r.author.avatar} alt="" width={16} height={16} className="size-4 rounded-full object-cover" />
              {r.author.name}
            </button>
            <span className="text-xs text-n-900">{r.date}</span>
          </div>
          <h2 className="mt-4 text-sm text-ink">Route Information</h2>
          <p className="text-xs whitespace-pre-line text-ink">{r.route}</p>
        </div>
      </div>
    </div>
  );
}

export function Formality() {
  const { pop } = useStore();
  return (
    <div className="absolute inset-0 flex flex-col pt-13.25 pb-21.25">
      <header className="relative h-24.25 shrink-0 border-b border-n-200 bg-white">
        <div className="absolute top-9.25 left-3.75">
          <BackButton onClick={pop} />
        </div>
        <div className="absolute top-7.5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5">
          <h1 className="text-xl font-medium text-ink">{FORMALITY.country}</h1>
          <span className="rounded-md bg-p-600 px-2 text-2xs text-n-100">{FORMALITY.port}</span>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-3.5 pb-6 scrollbar-none">
        <Section title="Overview">
          <p>{FORMALITY.overview}</p>
        </Section>
        {FORMALITY.sections.map((s) => (
          <Section key={s.title} title={s.title}>
            {s.ordered ? (
              <ol className="list-decimal pl-4">
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ol>
            ) : (
              s.items.map((it) => <p key={it}>{it}</p>)
            )}
          </Section>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex flex-col gap-1.5">
      <h2 className="text-base text-ink">{title}</h2>
      <div className="flex flex-col gap-0.5 text-2xs text-n-900">{children}</div>
    </motion.section>
  );
}
