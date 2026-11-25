"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { ME, type CrewProfile } from "@/lib/data";
import { useStore, type SailingProfile } from "../store";
import { Alert, Empty, FooterButton, Header, Icon, IconTabs, ReadField, Segmented, SwipeRow, TextAction, TextField, ease } from "../ui";
import { CREW_TABS, InfoCard, QualRow, SKILL_DEFAULT, SUBS, SkillsCard, VoyageRow } from "./shared";

/** Your saved sailing profile, in the same shape as a crew card */
export function toCrew(p: SailingProfile, quals: { org: string; level: string }[], voyages: { from: string; to: string; year: string }[]): CrewProfile {
  const birth = p.birth ? new Date(p.birth + "T00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—";
  return {
    id: "me",
    name: p.first,
    nationality: p.nationality || "—",
    photo: ME.avatarLg,
    about: [
      { label: "Name", value: `${p.first} ${p.last}`.trim(), half: true },
      { label: "Birthday", value: birth, half: true },
      { label: "Gender", value: p.gender || "Prefer not to say" },
      { label: "Nationality", value: p.nationality || "—", half: true },
      { label: "Residence", value: p.residence || "—", half: true },
      { label: "Smoker?", value: p.smoker ? "Yes" : "No", half: true },
      { label: "Languages", value: p.languages.join(", ") || "—", half: true },
      { label: "Available For", value: p.available.join(", ") || "—" },
    ],
    work: [
      { label: "Years of Experience", value: p.years || "—" },
      { label: "Ocean Miles Sailed", value: p.ocean || "—" },
      { label: "Coastal Miles Sailed", value: p.coastal || "—" },
      { label: "Experienced as a ...", value: p.experienced || "—" },
    ],
    skills: p.skills.length ? p.skills : SKILL_DEFAULT,
    nautical: p.nautical.join(", ") || "—",
    regions: p.regions.join(", ") || "—",
    rallies: p.rallies.join(", ") || "—",
    qualifications: quals,
    voyages,
  };
}

function Screen({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col pt-13.25 pb-21.25">
      {children}
      {footer}
    </div>
  );
}

const Scroll = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={"flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-none " + (className ?? "")}>{children}</div>
);

/* ------------------------------------------------------------------ account hub */

const POSTS = [
  { label: "Sailing Profile", to: "sailingProfile" },
  { label: "Boat Profiles", to: "boats" },
  { label: "Sailing Opportunities and Charters", to: "myOpps" },
  { label: "Cruising Reports", to: "reports" },
  { label: "Marketplace LIstings", to: "listings" },
] as const;

export function Account() {
  const { pop, push, reset } = useStore();
  const [confirm, setConfirm] = useState(false);
  return (
    <Screen footer={<FooterButton variant="danger" onClick={() => setConfirm(true)}>Delete Account</FooterButton>}>
      <Header title="Account" onBack={pop} />
      <Scroll className="px-4 pt-6">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => push({ s: "myAccount" })}
          className="flex h-16.5 cursor-pointer items-center gap-3.5 rounded-2xl border border-n-500/60 px-4 text-left transition hover:bg-n-200/50"
        >
          <img src={ME.avatar} alt="" width={39} height={39} className="size-9.75 rounded-full" />
          <span className="flex flex-1 flex-col gap-1">
            <span className="text-sm text-n-900">
              {ME.first} {ME.last}
            </span>
            <span className="text-2xs text-n-700">{ME.email}</span>
          </span>
          <Icon name="chevron-right" className="text-ink" />
        </motion.button>
        <h2 className="mt-8 text-center text-xl text-ink">Manage Your Posts</h2>
        <ul className="mt-5.75 overflow-hidden rounded-xl border border-n-500/60">
          {POSTS.map((p, i) => (
            <li key={p.label} className={i ? "border-t border-n-500/60" : ""}>
              <button
                type="button"
                onClick={() => (p.to === "reports" ? reset({ s: "port", view: "reports" }) : push({ s: p.to }))}
                className="flex h-10.75 w-full cursor-pointer items-center justify-between px-4 text-sm text-n-900 transition hover:bg-n-200/60"
              >
                {p.label}
                <Icon name="chevron-right" className="text-ink" />
              </button>
            </li>
          ))}
        </ul>
      </Scroll>
      <Alert
        open={confirm}
        title="Delete your account?"
        body="This is a prototype, so nothing is really deleted. You’ll be signed out."
        cancel="Cancel"
        confirm="Delete"
        cancelTone="plain"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          reset({ s: "login" });
        }}
      />
    </Screen>
  );
}

export function MyAccount() {
  const { pop, toast } = useStore();
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ first: ME.first, last: ME.last, email: ME.email });
  return (
    <Screen
      footer={
        edit ? (
          <FooterButton
            onClick={() => {
              setEdit(false);
              toast("Account details saved");
            }}
          >
            Save Changes
          </FooterButton>
        ) : (
          <FooterButton variant="danger" onClick={() => toast("Archiving is disabled in the prototype")}>
            Archive Account
          </FooterButton>
        )
      }
    >
      <Header title="My Account" center onBack={pop} right={<TextAction onClick={() => setEdit((e) => !e)}>{edit ? "Cancel" : "Edit"}</TextAction>} />
      <Scroll className="px-4 pt-5">
        <img src={ME.avatarLg} alt="" width={100} height={100} className="size-25 self-center rounded-full" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={String(edit)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8.5 grid grid-cols-2 gap-4">
            {edit ? (
              <>
                <TextField label="First Name" value={f.first} onChange={(v) => setF({ ...f, first: v })} />
                <TextField label="Last Name" value={f.last} onChange={(v) => setF({ ...f, last: v })} />
                <TextField className="col-span-2" label="Email" type="email" value={f.email} onChange={(v) => setF({ ...f, email: v })} />
              </>
            ) : (
              <>
                <ReadField label="First Name" value={f.first} />
                <ReadField label="Last Name" value={f.last} />
                <ReadField className="col-span-2" label="Email" value={f.email} />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Scroll>
    </Screen>
  );
}

/* ------------------------------------------------------------------ your sailing profile */

type Tab = "profile" | "quals" | "voyages";
type Sub = (typeof SUBS)[number]["key"];

export function MySailingProfile() {
  const { pop, push, profile, quals, setQuals, voyages, setVoyages } = useStore();
  const [tab, setTab] = useState<Tab>("profile");
  const [sub, setSub] = useState<Sub>("about");

  if (!profile) {
    return (
      <Screen>
        <Header title="Sailing Profile" center onBack={pop} />
        <Empty text="You have no sailing profile added yet." action="Create Sailing Profile" onAction={() => push({ s: "profileCreate", from: "account" })} />
      </Screen>
    );
  }

  const c = toCrew(profile, quals, voyages);
  const footer =
    tab === "quals" && quals.length > 0 ? (
      <FooterButton onClick={() => push({ s: "qualAdd" })}>Add Qualification</FooterButton>
    ) : tab === "voyages" && voyages.length > 0 ? (
      <FooterButton onClick={() => push({ s: "voyageAdd" })}>Add New Voyage</FooterButton>
    ) : undefined;

  return (
    <Screen footer={footer}>
      <Header title="Sailing Profile" center onBack={pop} right={<TextAction onClick={() => push({ s: "profileCreate", from: "account" })}>Edit</TextAction>} />
      <Scroll className="px-4 pt-4.25">
        <IconTabs value={tab} onChange={setTab} items={CREW_TABS} />
        {tab === "profile" && <Segmented className="mt-4.25" items={SUBS} value={sub} onChange={setSub} />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab + sub}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="flex flex-1 flex-col gap-4 pt-6.5 pb-4"
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
            {tab === "quals" &&
              (quals.length ? (
                <AnimatePresence initial={false}>
                  {quals.map((q) => (
                    <motion.div key={q.id} layout exit={{ opacity: 0, x: -80, height: 0 }} transition={{ duration: 0.3, ease }}>
                      <SwipeRow onEdit={() => push({ s: "qualAdd" })} onArchive={() => setQuals((qs) => qs.filter((x) => x.id !== q.id))}>
                        <QualRow {...q} />
                      </SwipeRow>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <Empty text="You have no qualifications added yet." action="Add Qualification" onAction={() => push({ s: "qualAdd" })} />
              ))}
            {tab === "voyages" &&
              (voyages.length ? (
                <AnimatePresence initial={false}>
                  {voyages.map((v) => (
                    <motion.div key={v.id} layout exit={{ opacity: 0, x: -80, height: 0 }} transition={{ duration: 0.3, ease }}>
                      <SwipeRow onEdit={() => push({ s: "voyageAdd" })} onArchive={() => setVoyages((vs) => vs.filter((x) => x.id !== v.id))}>
                        <VoyageRow {...v} />
                      </SwipeRow>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <Empty text="You have no voyage history added yet." action="Add New Voyage" onAction={() => push({ s: "voyageAdd" })} />
              ))}
            {(tab === "quals" && quals.length > 0) || (tab === "voyages" && voyages.length > 0) ? (
              <p className="pt-2 text-center text-2xs text-n-600">Swipe a row left to edit or archive it.</p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </Scroll>
    </Screen>
  );
}

/* ------------------------------------------------------------------ lists: boats, opportunities, listings */

function Thumb({ src }: { src?: string }) {
  return src ? (
    <img src={src} alt="" width={40} height={40} className="size-10 shrink-0 rounded-sm object-cover" />
  ) : (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-n-200 text-n-600">
      <Icon name="image" className="size-5" />
    </span>
  );
}

function PostRow({ thumb, title, sub, right, onClick }: { thumb?: string; title: string; sub: string; right?: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-18.25 w-full cursor-pointer items-center gap-3 rounded-2xl border border-n-500/60 bg-n-100 px-4 text-left transition hover:bg-n-200/40">
      <Thumb src={thumb} />
      <span className="flex min-w-0 flex-1 flex-col gap-2.5">
        <span className="truncate text-base text-ink">{title}</span>
        <span className="truncate text-2xs text-n-600">{sub}</span>
      </span>
      {right && <span className="shrink-0 text-base text-ink">{right}</span>}
    </button>
  );
}

function PostList<T extends { id: string }>({
  title,
  items,
  row,
  onArchive,
  onOpen,
  editIcon,
  empty,
  emptyAction,
  addLabel,
  onAdd,
  filter,
}: {
  title: string;
  items: T[];
  row: (i: T) => { thumb?: string; title: string; sub: string; right?: string };
  onArchive: (id: string) => void;
  onOpen?: (i: T) => void;
  editIcon?: "edit" | "ship";
  empty: string;
  emptyAction: string;
  addLabel: string;
  onAdd: () => void;
  filter?: boolean;
}) {
  const { pop, toast } = useStore();
  return (
    <Screen footer={items.length ? <FooterButton onClick={onAdd}>{addLabel}</FooterButton> : undefined}>
      <Header title={title} center={title.length < 20} onBack={pop} />
      {items.length ? (
        <Scroll className="px-4 pt-5">
          {filter && (
            <button type="button" onClick={() => toast("Filters are coming soon")} aria-label="Filter" className="mb-4 flex size-11 cursor-pointer items-center justify-center self-end rounded-xl border border-n-500/60 text-n-800">
              <Icon name="sliders" />
            </button>
          )}
          <div className="flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {items.map((it) => (
                <motion.div key={it.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -80, height: 0 }} transition={{ duration: 0.3, ease }}>
                  <SwipeRow editIcon={editIcon} onEdit={onOpen ? () => onOpen(it) : undefined} onArchive={() => onArchive(it.id)}>
                    <PostRow {...row(it)} onClick={onOpen ? () => onOpen(it) : undefined} />
                  </SwipeRow>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <p className="pt-5 text-center text-2xs text-n-600">Swipe a row left for more actions.</p>
        </Scroll>
      ) : (
        <Empty text={empty} action={emptyAction} onAction={onAdd} />
      )}
    </Screen>
  );
}

export function Boats() {
  const { boats, setBoats, push } = useStore();
  return (
    <PostList
      title="Boat Profiles"
      items={boats}
      row={(b) => ({ thumb: b.photo, title: b.name, sub: b.model })}
      editIcon="ship"
      onOpen={(b) => push({ s: "boatView", id: b.id })}
      onArchive={(id) => setBoats((bs) => bs.filter((b) => b.id !== id))}
      empty={"You don’t have any boats added yet.\nCreate One now."}
      emptyAction="Create Boat Profile"
      addLabel="Add New Boat"
      onAdd={() => push({ s: "boatCreate" })}
    />
  );
}

export function BoatView({ id }: { id: string }) {
  const { boats, setBoats, pop, toast } = useStore();
  const b = boats.find((x) => x.id === id);
  if (!b) return null;
  return (
    <Screen
      footer={
        <FooterButton
          variant="danger"
          onClick={() => {
            setBoats((bs) => bs.filter((x) => x.id !== id));
            toast(`${b.name} archived`);
            pop();
          }}
        >
          Archive Boat
        </FooterButton>
      }
    >
      <Header title={b.name} center onBack={pop} right={<TextAction onClick={() => toast("Editing is coming soon")}>Edit</TextAction>} />
      <Scroll className="px-4 pt-4.25 pb-4">
        <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, ease }} className="h-39 overflow-hidden rounded-2xl bg-photo">
          {b.photo ? (
            <img src={b.photo} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-n-600">
              <Icon name="image" className="size-9" />
            </span>
          )}
        </motion.div>
        <div className="mt-4.5 flex items-center justify-between">
          <h2 className="text-3xl font-medium text-ink">{b.name}</h2>
          <div className="flex w-19.5 justify-between text-ink">
            <a href={b.website ? `https://${b.website}` : undefined} aria-label="Website" className="flex">
              <Icon name="globe" />
            </a>
            <a href={b.facebook ? `https://facebook.com/${b.facebook}` : undefined} aria-label="Facebook" className="flex">
              <Icon name="facebook" />
            </a>
          </div>
        </div>
        <dl className="mt-8 flex flex-col gap-4 text-base">
          <div className="flex flex-col gap-2.5">
            <dt className="text-n-900">Description</dt>
            <dd className="text-n-700">{b.description}</dd>
          </div>
          <div className="flex flex-col gap-2.5">
            <dt className="text-n-900">Manufacturer/Model</dt>
            <dd className="text-n-700">
              {b.manufacturer}/{b.model}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2.5">
              <dt className="text-n-900">Boat Length</dt>
              <dd className="text-n-700">
                {b.length} {b.unit === "M" ? "meters" : "feet"}
              </dd>
            </div>
            <div className="flex flex-col gap-2.5">
              <dt className="text-n-900">Hull Type</dt>
              <dd className="text-n-700">{b.hull}</dd>
            </div>
          </div>
        </dl>
      </Scroll>
    </Screen>
  );
}

export function MyOpportunities() {
  const { myOpps, setMyOpps, push, toast } = useStore();
  return (
    <PostList
      title="Sailing Opportunities & Charters"
      items={myOpps}
      row={(o) => ({ thumb: o.photo, title: o.name, sub: o.boat })}
      editIcon="ship"
      onOpen={(o) => toast(`${o.name} is live in the ${o.kind === "Charter" ? "Charters" : "Opportunities"} feed`)}
      onArchive={(id) => setMyOpps((os) => os.filter((o) => o.id !== id))}
      empty={"You don’t have any sailing opportunities\nor charters created yet. Create One now."}
      emptyAction="Create Opportunity or Charter"
      addLabel="Add New Opportunity or Charter"
      onAdd={() => push({ s: "oppCreate" })}
    />
  );
}

export function MyListings() {
  const { myListings, setMyListings, push } = useStore();
  return (
    <PostList
      title="Marketplace Listings"
      items={myListings}
      row={(l) => ({ thumb: l.photo, title: l.name, sub: l.description, right: l.price })}
      onOpen={(l) => push({ s: "marketItem", id: l.id })}
      onArchive={(id) => setMyListings((ls) => ls.filter((l) => l.id !== id))}
      empty={"You don’t have any listing created yet.\nCreate One now."}
      emptyAction="Create Listing"
      addLabel="Add New Listing"
      onAdd={() => push({ s: "listingCreate" })}
      filter
    />
  );
}
