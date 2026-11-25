"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import {
  AVAILABLE_FOR, AWARDING_ORGS, CABINS, COUNTRIES, EXPERIENCE_LEVELS, EXPIRY, GENDERS, GEO_REGIONS, HULLS, LANGUAGES, ME,
  MANUFACTURERS, MODELS, MONEY, NATIONALITIES, NAUTICAL, PORTS, QUAL_LEVELS, RALLIES, REGIONS, ROLES, SKILLS, SKILL_LEVELS, TRAVEL,
} from "@/lib/data";
import { nowTime, uid, useStore, type SailingProfile } from "../store";
import {
  Alert, BackButton, Button, Checkbox, DateField, FooterButton, Header, Icon, Label, MonthField, MultiSelect, PillGroup, Segmented,
  SelectField, Sheet, TextArea, TextField, cn, ease, fmtMonth,
} from "../ui";
import { InfoCard, SkillsCard } from "./shared";

function Form({ title, onBack, footer, children, bare }: { title: string; onBack: () => void; footer: ReactNode; children: ReactNode; bare?: boolean }) {
  return (
    <div className={cn("absolute inset-0 flex flex-col pt-13.25", bare ? "pb-8.5" : "pb-21.25")}>
      <Header small title={title} onBack={onBack} />
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pt-2 pb-6 scrollbar-none">{children}</div>
      {footer}
    </div>
  );
}

const Row = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-2 gap-4">{children}</div>;

function Success({ title, body, primary, onPrimary, link, onLink, onClose }: { title: string; body: string; primary: string; onPrimary: () => void; link?: string; onLink?: () => void; onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-n-100">
      <div className="absolute top-22 left-10.5">
        <BackButton icon="x-close" label="Close" onClick={onClose} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="absolute inset-x-6.5 top-73.5 flex flex-col items-center text-center"
      >
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 16 }} className="mb-6 flex size-14 items-center justify-center rounded-full bg-p-100 text-p-700">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M5 12.5 10 17l9-10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.45 }} />
          </svg>
        </motion.span>
        <h1 className="text-3xl font-medium text-n-900">{title}</h1>
        <p className="mt-6 text-sm text-n-900">{body}</p>
        <Button className="mt-6 w-74.25" onClick={onPrimary}>
          {primary}
        </Button>
        {link && (
          <button type="button" onClick={onLink} className="mt-3.5 cursor-pointer text-base text-p-700 hover:underline">
            {link}
          </button>
        )}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ sailing profile */

type Step = "about" | "work" | "expertise" | "destinations";
const STEPS: { key: Step; label: string }[] = [
  { key: "about", label: "About" },
  { key: "work", label: "Work" },
  { key: "expertise", label: "Expertise" },
  { key: "destinations", label: "Destinations" },
];

const blankProfile = (): SailingProfile => ({
  first: ME.first,
  last: ME.last,
  birth: "",
  gender: "",
  nationality: "",
  residence: "",
  smoker: false,
  languages: ["English", "Mandarin", "French"],
  activeAs: "",
  available: ["Hire", "Shared Costs"],
  years: "3-5 years",
  ocean: "6000+",
  coastal: "3001-6000",
  nights: "11-50",
  experienced: "",
  skills: [
    { name: "Steer by Compass", level: "Competent" },
    { name: "Watch Keeping", level: "Basic" },
    { name: "Trim Sails", level: "None" },
    { name: "Reefing", level: "Competent" },
    { name: "Work the Front Deck", level: "Competent" },
  ],
  nautical: ["Sextant", "VFH Radio", "Radar", "Making Sails", "Outbound Engine Maintenance", "Diesel Engine Maintenance", "Repairing Sails"],
  regions: ["South East Asia & East Asia", "Caribbean", "North Pacific Islands", "Central & North America", "Northern Europe"],
  rallies: ["Independent", "ARC Pacific", "ARC USA", "Caribbean 1500", "ARC DelMarVa"],
});

export function ProfileCreate() {
  const { pop, replace, profile, setProfile, done } = useStore();
  const [p, setP] = useState<SailingProfile>(profile ?? blankProfile());
  const [step, setStep] = useState<Step>("about");
  const [dirty, setDirty] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [skill, setSkill] = useState({ name: "", level: "" });
  const set = <K extends keyof SailingProfile>(k: K) => (v: SailingProfile[K]) => {
    setDirty(true);
    setP((s) => ({ ...s, [k]: v }));
  };
  const valid = p.first.trim() && p.last.trim();
  const last = step === "destinations";
  const save = () => {
    const isNew = !profile;
    setProfile(p);
    done("profile");
    if (isNew) replace({ s: "profileDone" });
    else pop();
  };

  return (
    <Form
      title={profile ? "Edit Sailing Profile" : "Create Sailing Profile"}
      onBack={() => (dirty ? setDiscard(true) : pop())}
      footer={
        <FooterButton disabled={!valid || (!last && !dirty && !profile)} onClick={() => (last || dirty || profile ? save() : setStep("destinations"))}>
          Save Sailing Profile
        </FooterButton>
      }
    >
      <Segmented items={STEPS} value={step} onChange={setStep} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }} className="flex flex-col gap-4 pt-4">
          {step === "about" && (
            <>
              <Row>
                <TextField label="First Name" placeholder="First Name" value={p.first} onChange={set("first")} />
                <TextField label="Last Name" placeholder="Last Name" value={p.last} onChange={set("last")} />
              </Row>
              <Row>
                <DateField label="Birth date" value={p.birth} onChange={set("birth")} />
                <SelectField label="Gender" placeholder="Select Gender" options={GENDERS} value={p.gender} onChange={set("gender")} />
              </Row>
              <Row>
                <SelectField label="Nationality" options={NATIONALITIES} value={p.nationality} onChange={set("nationality")} />
                <SelectField label="Residence" placeholder="Select Country" options={COUNTRIES} value={p.residence} onChange={set("residence")} />
              </Row>
              <Checkbox label="I am a smoker" checked={p.smoker} onChange={set("smoker")} />
              <MultiSelect label="Languages Spoken" options={LANGUAGES} values={p.languages} onChange={set("languages")} />
              <SelectField label="Active as Crew" options={["Yes, actively looking", "Open to offers", "Not right now"]} value={p.activeAs} onChange={set("activeAs")} />
              <MultiSelect label="Available For" options={AVAILABLE_FOR} values={p.available} onChange={set("available")} />
            </>
          )}
          {step === "work" && (
            <>
              <PillGroup label="Years of Experience" options={["0-2 years", "3-5 years", "7+ years"]} value={p.years} onChange={set("years")} />
              <PillGroup label="Ocean Miles Sailed" options={["0-500", "501-3000", "3001-6000", "6000+"]} value={p.ocean} onChange={set("ocean")} />
              <PillGroup label="Coastal Miles Sailed" options={["0-100", "101-500", "3001-6000", "6000+"]} value={p.coastal} onChange={set("coastal")} />
              <PillGroup label="Nights at Sea" options={["None", "1-10", "11-50", "51+"]} value={p.nights} onChange={set("nights")} />
              <SelectField label="Experienced as a ..." placeholder="Select Maximum Experience Level" options={EXPERIENCE_LEVELS} value={p.experienced} onChange={set("experienced")} />
            </>
          )}
          {step === "expertise" && (
            <>
              <Row>
                <SelectField label="Skill" placeholder="Select Skill" options={SKILLS} value={skill.name} onChange={(v) => setSkill({ ...skill, name: v })} />
                <SelectField label="Level" placeholder="None" options={SKILL_LEVELS} value={skill.level} onChange={(v) => setSkill({ ...skill, level: v })} />
              </Row>
              <button
                type="button"
                disabled={!skill.name}
                onClick={() => {
                  set("skills")([...p.skills.filter((s) => s.name !== skill.name), { name: skill.name, level: skill.level || "None" }]);
                  setSkill({ name: "", level: "" });
                }}
                className="-mt-1 flex cursor-pointer items-center gap-1.5 self-end text-sm text-p-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="plus-circle" /> Add New Skill
              </button>
              <SkillsCard skills={p.skills} />
              <MultiSelect label="Nautical Skills" options={NAUTICAL} values={p.nautical} onChange={set("nautical")} />
            </>
          )}
          {step === "destinations" && (
            <>
              <MultiSelect label="Geo Regions" options={GEO_REGIONS} values={p.regions} onChange={set("regions")} />
              <MultiSelect label="Rallies" options={RALLIES} values={p.rallies} onChange={set("rallies")} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
      {!last && (
        <button type="button" onClick={() => setStep(STEPS[STEPS.findIndex((s) => s.key === step) + 1].key)} className="flex cursor-pointer items-center gap-1 self-end text-sm text-p-700 hover:underline">
          Next: {STEPS[STEPS.findIndex((s) => s.key === step) + 1].label} <Icon name="chevron-right" className="size-4" />
        </button>
      )}
      <Alert
        open={discard}
        title="Discard Changes?"
        body="There are some changes that has not been saved yet. Exiting might discard these changes."
        cancel="Save Changes"
        confirm="Discard"
        onCancel={() => {
          setDiscard(false);
          if (valid) save();
        }}
        onConfirm={() => {
          setDiscard(false);
          pop();
        }}
      />
    </Form>
  );
}

export function ProfileDone() {
  const { reset } = useStore();
  return (
    <Success
      title="Sailing Profile Successfully Created"
      body="Your Sailing Profile has been successfully created! You’re now ready to connect, explore opportunities, and set sail."
      primary="Find Sailing Opportunities"
      onPrimary={() => reset({ s: "opportunities" })}
      link="Create Sailing Opportunities or Charters"
      onLink={() => reset([{ s: "crew" }, { s: "account" }, { s: "oppCreate" }])}
      onClose={() => reset({ s: "crew" })}
    />
  );
}

/* ------------------------------------------------------------------ qualifications & voyages */

export function QualAdd() {
  const { pop, setQuals } = useStore();
  const [org, setOrg] = useState("");
  const [level, setLevel] = useState("");
  const [list, setList] = useState<{ org: string; level: string }[]>([]);
  const add = () => {
    if (!org) return;
    setList((l) => [...l, { org, level: level || QUAL_LEVELS[0] }]);
    setOrg("");
    setLevel("");
  };
  const pending = org ? [...list, { org, level: level || QUAL_LEVELS[0] }] : list;
  return (
    <Form
      title="Add Qualifications"
      onBack={pop}
      footer={
        <FooterButton
          disabled={pending.length === 0}
          onClick={() => {
            setQuals((q) => [...q, ...pending.map((x) => ({ ...x, id: uid() }))]);
            pop();
          }}
        >
          Save Changes
        </FooterButton>
      }
    >
      <SelectField label="Qualification" placeholder="Select Awarding Organization" options={AWARDING_ORGS} value={org} onChange={setOrg} />
      <SelectField label="Level" placeholder="Select Level" options={QUAL_LEVELS} value={level} onChange={setLevel} />
      <button type="button" disabled={!org} onClick={add} className="flex cursor-pointer items-center gap-1.5 self-end text-sm text-p-700 disabled:cursor-not-allowed disabled:opacity-50">
        <Icon name="plus-circle" /> Add Qualification
      </button>
      <AnimatePresence>
        {list.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <InfoCard title="Qualifications">
              <ul className="flex flex-col gap-3">
                {list.map((q, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-p-900">{q.org}</span>
                    <span className="text-2xs text-n-700">{q.level}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </motion.div>
        )}
      </AnimatePresence>
    </Form>
  );
}

function PortPicker({ label, value, onChange }: { label: string; value: { country: string; region: string; port: string }; onChange: (v: { country: string; region: string; port: string }) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <SelectField label={label} placeholder="Select Country" options={COUNTRIES} value={value.country} onChange={(country) => onChange({ ...value, country })} />
      <Row>
        <SelectField placeholder="Select Region" options={REGIONS} value={value.region} onChange={(region) => onChange({ ...value, region })} />
        <SelectField placeholder="Select Port" options={PORTS} value={value.port} onChange={(port) => onChange({ ...value, port })} />
      </Row>
    </div>
  );
}

const blankPort = { country: "", region: "", port: "" };
const portName = (p: typeof blankPort, fallback: string) => p.port || p.country || fallback;

export function VoyageAdd() {
  const { pop, setVoyages } = useStore();
  const [year, setYear] = useState("");
  const [hull, setHull] = useState("");
  const [dist, setDist] = useState("");
  const [unit, setUnit] = useState("Mi");
  const [start, setStart] = useState(blankPort);
  const [end, setEnd] = useState(blankPort);
  const [role, setRole] = useState("");
  const [tags, setTags] = useState("");
  const years = Array.from({ length: 30 }, (_, i) => String(2025 - i));
  return (
    <Form
      title="Add New Voyage"
      onBack={pop}
      footer={
        <FooterButton
          onClick={() => {
            setVoyages((v) => [{ id: uid(), from: portName(start, "Nassau"), to: portName(end, "Spanish Wells"), year: year || "2024" }, ...v]);
            pop();
          }}
        >
          Submit Voyage
        </FooterButton>
      }
    >
      <SelectField label="Voyage Year" placeholder="Select Year" options={years} value={year} onChange={setYear} />
      <div className="grid grid-cols-2 gap-4">
        <SelectField label="Boat Type" placeholder="Select Hull Type" options={HULLS} value={hull} onChange={setHull} />
        <div className="flex flex-col gap-1.5">
          <Label>Approximate Distance</Label>
          <div className="flex gap-2">
            <TextField className="flex-1" placeholder="0" type="number" inputMode="numeric" value={dist} onChange={setDist} />
            <SelectField className="w-19" options={["Mi", "Km", "Nm"]} value={unit} onChange={setUnit} />
          </div>
        </div>
      </div>
      <PortPicker label="Starting Port" value={start} onChange={setStart} />
      <PortPicker label="Ending Port" value={end} onChange={setEnd} />
      <SelectField label="Role on Board" placeholder="Select Role" options={ROLES} value={role} onChange={setRole} />
      <TextField label="Rally Tags" placeholder="Add Tags" value={tags} onChange={setTags} />
    </Form>
  );
}

/* ------------------------------------------------------------------ opportunity / charter */

export function OppCreate() {
  const { pop, push, replace, boats, setMyOpps, done } = useStore();
  const [kind, setKind] = useState("");
  const [name, setName] = useState("");
  const [boat, setBoat] = useState("");
  const [needBoat, setNeedBoat] = useState(false);
  const [sheet, setSheet] = useState<"timeline" | "itinerary" | null>(null);
  const [from, setFrom] = useState(blankPort);
  const [to, setTo] = useState(blankPort);
  const [start, setStart] = useState("2025-03");
  const [end, setEnd] = useState("2025-09");
  const [aboard, setAboard] = useState("");
  const [crews, setCrews] = useState("");
  const [rally, setRally] = useState("ARC Pacific");
  const [money, setMoney] = useState("Shared Expenses");
  const [smoking, setSmoking] = useState(false);
  const [langs, setLangs] = useState<string[]>([]);
  const [travel, setTravel] = useState("Negotiable");
  const [cabin, setCabin] = useState("Shared Cabin");
  const [desc, setDesc] = useState("");
  const [expires, setExpires] = useState("2 Weeks");
  const [tried, setTried] = useState(false);

  const fromName = from.port || from.country ? `${from.port || from.country}` : "Sydney, AU";
  const toName = to.port || to.country ? `${to.port || to.country}` : "Vancouver, CA";

  const create = () => {
    setTried(true);
    if (!boats.length) return setNeedBoat(true);
    if (!name.trim()) return;
    const b = boats.find((x) => x.name === boat) ?? boats[0];
    setMyOpps((os) => [
      {
        id: uid(),
        kind: kind === "Charter" ? "Charter" : "Opportunity",
        name: name.trim(),
        boat: b.model,
        photo: b.photo ?? "/img/boat-thumb.webp",
        captain: { id: "me", name: "You", avatar: ME.avatar },
        description: desc || "—",
        from: fromName,
        to: toName,
        start: fmtMonth(start),
        end: fmtMonth(end),
        rally,
        expires,
        aboard: aboard || "0",
        crews: crews || "0",
        smoking: smoking ? "Yes" : "No",
        cabin,
        languages: langs.join(", ") || "English",
        money,
        travel,
      },
      ...os,
    ]);
    done("opportunity");
    replace({ s: "oppDone" });
  };

  const BoatField = boats.length ? (
    <SelectField label="Boat" placeholder="Select Boat" options={boats.map((b) => b.name)} value={boat} onChange={setBoat} />
  ) : (
    <div className="flex flex-col gap-1.5">
      <Label>Boat</Label>
      <button type="button" onClick={() => setNeedBoat(true)} className="flex h-10 cursor-pointer items-center gap-2.5 rounded-field bg-n-200 px-4 text-left text-sm text-n-700">
        <span className="flex-1">Select Boat</span>
        <Icon name="chevron-down" className="text-n-900" />
      </button>
    </div>
  );

  return (
    <Form title="Create Sailing Opportunity or Charter" onBack={pop} footer={<FooterButton onClick={create}>Create Opportunity</FooterButton>}>
      <SelectField label="Opportunity or Charter" options={["Opportunity", "Charter"]} value={kind} onChange={setKind} />
      <TextField label="Opportunity Name" placeholder="Enter Opportunity Name" value={name} onChange={setName} error={tried && boats.length && !name.trim() ? "Required Field" : ""} />
      {BoatField}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Label>Itinerary</Label>
          <button type="button" onClick={() => setSheet("itinerary")} className="flex cursor-pointer flex-col gap-2.5 text-left text-sm text-ink">
            <span className="flex items-center gap-2.5 underline decoration-from-font underline-offset-2">
              <Icon name="map-pin-alt" className="size-5 text-p-700" /> {fromName}
            </span>
            <span className="flex items-center gap-2.5 underline decoration-from-font underline-offset-2">
              <Icon name="map-pin-alt" className="size-5 text-p-700" /> {toName}
            </span>
          </button>
        </div>
        <div className="relative flex flex-col gap-3">
          <button
            type="button"
            aria-label="Swap departure and arrival"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            className="group absolute top-8 -left-7 flex h-9.5 w-4 cursor-pointer items-center"
          >
            <span className="h-full w-2.5 rounded-r-xs border border-l-0 border-n-500" />
            <span className="absolute right-0 flex bg-n-100 py-0.5 text-p-700 transition group-hover:scale-110">
              <Icon name="swap" className="size-4" />
            </span>
          </button>
          <Label>Timeline</Label>
          <button type="button" onClick={() => setSheet("timeline")} className="flex cursor-pointer flex-col gap-2.5 text-left text-sm text-ink underline decoration-from-font underline-offset-2">
            <span>{fmtMonth(start)}</span>
            <span>{fmtMonth(end)}</span>
          </button>
        </div>
      </div>
      <Row>
        <TextField label="Numbers Aboard" placeholder="0" type="number" inputMode="numeric" value={aboard} onChange={setAboard} />
        <TextField label="Number of Crews" placeholder="0" type="number" inputMode="numeric" value={crews} onChange={setCrews} />
      </Row>
      <Row>
        <SelectField label="Rally" options={RALLIES} value={rally} onChange={setRally} />
        <SelectField label="Money" options={MONEY} value={money} onChange={setMoney} />
      </Row>
      <Checkbox label="Smoking is allowed" checked={smoking} onChange={setSmoking} />
      <MultiSelect label="Primary Language on Board" placeholder="Select Language" options={LANGUAGES} values={langs} onChange={setLangs} />
      <Row>
        <SelectField label="Travel Covered" options={TRAVEL} value={travel} onChange={setTravel} />
        <SelectField label="Cabin" options={CABINS} value={cabin} onChange={setCabin} />
      </Row>
      <TextArea label="Item Description" placeholder="Describe your item ..." value={desc} onChange={setDesc} />
      <SelectField label="Auto Expires In" options={EXPIRY} value={expires} onChange={setExpires} />

      <Sheet open={sheet === "timeline"} title="Timeline" onClose={() => setSheet(null)}>
        <div className="flex flex-col gap-4">
          <MonthField label="Start Date" value={start} onChange={setStart} />
          <MonthField label="Ending Date" value={end} onChange={setEnd} />
          <Button className="mt-4 w-full" onClick={() => setSheet(null)}>
            Save Changes
          </Button>
        </div>
      </Sheet>
      <Sheet open={sheet === "itinerary"} title="Itinerary" onClose={() => setSheet(null)}>
        <div className="flex flex-col gap-4">
          <PortPicker label="Departure" value={from} onChange={setFrom} />
          <PortPicker label="Arrival" value={to} onChange={setTo} />
          <Button className="mt-4 w-full" onClick={() => setSheet(null)}>
            Save Changes
          </Button>
        </div>
      </Sheet>
      <Alert
        open={needBoat}
        title="You don’t have a boat profile yet"
        body="To use this feature, you need to complete your Boat Profile. Set it up now to continue!"
        cancel="Later"
        confirm="Create"
        onCancel={() => setNeedBoat(false)}
        onConfirm={() => {
          setNeedBoat(false);
          push({ s: "boatCreate" });
        }}
      />
    </Form>
  );
}

export function OppDone() {
  const { reset, replace } = useStore();
  return (
    <Success
      title="Sailing Opportunity/Charter Successfully Created"
      body="Your Sailing Opportunity or Charter has been successfully created!"
      primary="Create New Opportunity or Charter"
      onPrimary={() => replace({ s: "oppCreate" })}
      link="See your posts"
      onLink={() => reset([{ s: "crew" }, { s: "account" }, { s: "myOpps" }])}
      onClose={() => reset([{ s: "crew" }, { s: "account" }, { s: "myOpps" }])}
    />
  );
}

/* ------------------------------------------------------------------ boat */

function ImagePick({ label, value, onChange }: { label: string; value?: string; onChange: (url: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="relative flex h-26.75 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-n-200 text-n-900 transition hover:bg-n-500/30"
      >
        {value ? (
          <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={value} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <>
            <Icon name="image" className="size-8.75" />
            <span className="text-2xs text-n-700">Upload a photo in JPG or PNG format (Max 2MB).</span>
          </>
        )}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(URL.createObjectURL(f));
        }}
      />
    </div>
  );
}

export function BoatCreate() {
  const { pop, replace, setBoats, done } = useStore();
  const [photo, setPhoto] = useState<string>();
  const [name, setName] = useState("");
  const [man, setMan] = useState("");
  const [model, setModel] = useState("");
  const [len, setLen] = useState("");
  const [unit, setUnit] = useState("Ft");
  const [hull, setHull] = useState("Trimaran");
  const [web, setWeb] = useState("");
  const [fb, setFb] = useState("");
  return (
    <Form
      title="Create Boat Profile"
      onBack={pop}
      footer={
        <FooterButton
          onClick={() => {
            // Blank fields fall back to the Figma example boat, so a quick tap still shows a full profile
            const named = name.trim();
            setBoats((bs) => [
              {
                id: uid(),
                name: named || "Sea Voyager",
                manufacturer: man || "Oceanic Yachts",
                model: model || "Oceania 5000",
                length: len || "15",
                unit: len ? unit : "M",
                hull: hull || "Catamaran",
                website: web,
                facebook: fb,
                photo: photo ?? (named ? undefined : "/img/boat-sea-voyager.webp"),
                description: named
                  ? `${named} is a ${hull.toLowerCase()} ready for her next voyage.`
                  : "A luxurious catamaran designed for comfort and speed, perfect for both leisurely cruises and adventurous journeys. With a sleek design and spacious interiors, it’s ideal for long voyages and exploring the open seas.",
              },
              ...bs,
            ]);
            done("boat");
            replace({ s: "boatDone" });
          }}
        >
          Create Boat Profile
        </FooterButton>
      }
    >
      <ImagePick label="Boat Image" value={photo} onChange={setPhoto} />
      <TextField label="Boat Name" placeholder="Boat Name" value={name} onChange={setName} />
      <Row>
        <SelectField label="Manufacturer" options={MANUFACTURERS} value={man} onChange={setMan} />
        <SelectField label="Model" placeholder="Select Model" options={MODELS} value={model} onChange={setModel} />
      </Row>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Boat Length</Label>
          <div className="flex gap-2">
            <TextField className="flex-1" placeholder="0" type="number" inputMode="numeric" value={len} onChange={setLen} />
            <SelectField className="w-21" options={["Ft", "M"]} value={unit} onChange={setUnit} />
          </div>
        </div>
        <SelectField label="Hull Type" options={HULLS} value={hull} onChange={setHull} />
      </div>
      <TextField label="Website" prefix="https://" placeholder="Enter website" value={web} onChange={setWeb} />
      <TextField label="Facebook" prefix="facebook.com/" placeholder="Enter username" value={fb} onChange={setFb} />
    </Form>
  );
}

export function BoatDone() {
  const { reset, popTo, replace } = useStore();
  return (
    <Success
      title="Boat Profile Successfully Created"
      body="Your Boat Profile has been successfully created! You’re now ready to connect, explore opportunities, and set sail."
      primary="Create Opportunities or Charters"
      onPrimary={() => {
        if (!popTo("oppCreate")) replace({ s: "oppCreate" });
      }}
      link="Go to Profile"
      onLink={() => reset([{ s: "crew" }, { s: "account" }, { s: "boats" }])}
      onClose={() => reset([{ s: "crew" }, { s: "account" }, { s: "boats" }])}
    />
  );
}

/* ------------------------------------------------------------------ listing & cruising report */

export function ListingCreate() {
  const { pop, setMyListings, toast } = useStore();
  const [photo, setPhoto] = useState<string>();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [tried, setTried] = useState(false);
  return (
    <Form
      title="Create New Listing"
      onBack={pop}
      footer={
        <FooterButton
          onClick={() => {
            setTried(true);
            if (!name.trim()) return;
            const price = amount ? `$${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00";
            setMyListings((ls) => [
              {
                id: uid(),
                name: name.trim(),
                description: desc || "No description yet",
                price,
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                photo: photo ?? "/img/boat-thumb.webp",
                seller: { id: "me", name: `${ME.first} ${ME.last}`, avatar: ME.avatar },
              },
              ...ls,
            ]);
            toast("Listing posted to the Marketplace");
            pop();
          }}
        >
          Post Listing
        </FooterButton>
      }
    >
      <ImagePick label="Item Image" value={photo} onChange={setPhoto} />
      <TextField label="Item Name" placeholder="Item Name" value={name} onChange={setName} error={tried && !name.trim() ? "Required Field" : ""} />
      <TextArea label="Item Description" placeholder="Describe your item ..." value={desc} onChange={setDesc} max={5000} />
      <TextField label="Amount" prefix="$" placeholder="0.00" type="number" inputMode="decimal" value={amount} onChange={setAmount} />
    </Form>
  );
}

export function ReportCreate() {
  const { pop, setReports, done } = useStore();
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [countries, setCountries] = useState(["Bahamas", "Anguilla", "Greece", "Australia"]);
  const [desc, setDesc] = useState("");
  const [tried, setTried] = useState(false);
  return (
    <Form
      title="Create Cruising Report"
      onBack={pop}
      footer={
        <FooterButton
          onClick={() => {
            setTried(true);
            if (!title.trim()) return;
            setReports((rs) => [
              {
                id: uid(),
                title: title.trim(),
                summary: desc || `A voyage through ${countries.join(", ") || "open water"}.`,
                tag: countries[0] ?? "Voyage",
                author: { id: "me", name: `${ME.first} ${ME.last}`, avatar: ME.avatar },
                date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                route: `Countries: ${countries.join(", ") || "—"}\nVoyage: ${start ? fmtMonth(start) : "—"} to ${end ? fmtMonth(end) : "—"}\nPosted at ${nowTime()}\n\n${desc}`,
              },
              ...rs,
            ]);
            done("report");
            pop();
          }}
        >
          Create Cruising Report
        </FooterButton>
      }
    >
      <h2 className="text-base text-ink">Report Details</h2>
      <TextField label="Report Title" placeholder="e.g. “My First Cruise”" value={title} onChange={setTitle} error={tried && !title.trim() ? "Required Field" : ""} />
      <MonthField label="Start Year" placeholder="Enter Start Year of Voyage" value={start} onChange={setStart} />
      <MonthField label="End Year" placeholder="Enter End Year of Voyage" value={end} onChange={setEnd} />
      <h2 className="mt-2 text-base text-ink">Route Information</h2>
      <MultiSelect label="Select Countries" options={COUNTRIES} values={countries} onChange={setCountries} />
      <h2 className="mt-2 text-base text-ink">Description</h2>
      <TextArea placeholder="Describe the voyage ..." value={desc} onChange={setDesc} max={10000} tall />
    </Form>
  );
}
