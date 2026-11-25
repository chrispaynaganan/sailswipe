"use client";

import type { ReactNode } from "react";
import { Icon } from "../ui";

export const SKILL_DEFAULT = [{ name: "Steer by Compass", level: "Basic" }];

export const SUBS = [
  { key: "about", label: "About" },
  { key: "work", label: "Work" },
  { key: "expertise", label: "Expertise" },
  { key: "destinations", label: "Destinations" },
] as const satisfies readonly { key: string; label: string }[];

export const CREW_TABS = [
  { key: "profile", label: "Profile & Skills", icon: "user" },
  { key: "quals", label: "Qualifications", icon: "certificate" },
  { key: "voyages", label: "Voyage History", icon: "pin" },
] as const;

export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-n-200 p-4">
      <h3 className="text-xl text-ink">{title}</h3>
      {children}
    </div>
  );
}

export function SkillsCard({ skills }: { skills: { name: string; level: string }[] }) {
  return (
    <InfoCard title="Skills">
      <ul className="flex flex-col gap-3">
        {skills.map((s) => (
          <li key={s.name} className="flex items-center justify-between">
            <span className="text-sm text-n-900">{s.name}</span>
            <span className="text-2xs text-n-700">{s.level}</span>
          </li>
        ))}
      </ul>
    </InfoCard>
  );
}

export function QualRow({ org, level }: { org: string; level: string }) {
  return (
    <div className="flex h-12.5 items-center gap-2.5 rounded-2xl border border-n-200 bg-n-100 px-4">
      <span className="text-base text-ink">{org}</span>
      <span className="h-4 w-px bg-n-500" />
      <span className="text-sm text-ink">{level}</span>
    </div>
  );
}

export function VoyageRow({ from, to, year }: { from: string; to: string; year: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-n-200 bg-n-100 px-4 pt-4 pb-3.5">
      <span className="flex items-center gap-2.5 text-base text-ink">
        {from} <Icon name="arrow-left" className="size-4 rotate-180 text-n-700" /> {to}
      </span>
      <span className="text-2xs text-n-600">Year {year}</span>
    </div>
  );
}

