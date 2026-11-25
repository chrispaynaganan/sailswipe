"use client";

import { createContext, useContext } from "react";
import type { Listing, Opportunity, Report, Thread } from "@/lib/data";
import type { TabKey } from "./ui";

export type Route =
  | { s: "splash" }
  | { s: "login" }
  | { s: "register" }
  | { s: "forgotEmail" }
  | { s: "forgotVerify" }
  | { s: "forgotReset" }
  | { s: "forgotDone" }
  | { s: "opportunities" }
  | { s: "crew" }
  | { s: "charters" }
  | { s: "marketplace" }
  | { s: "port"; view?: "formalities" | "reports" | "business" }
  | { s: "messages" }
  | { s: "archive" }
  | { s: "chat"; id: string }
  | { s: "account" }
  | { s: "myAccount" }
  | { s: "sailingProfile" }
  | { s: "profileCreate"; from?: "crew" | "account" }
  | { s: "profileDone" }
  | { s: "qualAdd" }
  | { s: "voyageAdd" }
  | { s: "boats" }
  | { s: "boatView"; id: string }
  | { s: "boatCreate" }
  | { s: "boatDone" }
  | { s: "myOpps" }
  | { s: "oppCreate" }
  | { s: "oppDone" }
  | { s: "listings" }
  | { s: "listingCreate" }
  | { s: "marketItem"; id: string }
  | { s: "marketSearch" }
  | { s: "reportView"; id: string }
  | { s: "reportCreate" }
  | { s: "formality" }
  | { s: "settings" }
  | { s: "changePassword" }
  | { s: "about" };

export type ScreenName = Route["s"];

/** Screens that show the tab bar, and which tab they belong to when it isn't the current one */
export const CHROME: Partial<Record<ScreenName, TabKey | "current">> = {
  opportunities: "opportunities",
  crew: "crew",
  charters: "charters",
  marketplace: "marketplace",
  port: "port",
  marketItem: "marketplace",
  reportView: "port",
  reportCreate: "port",
  formality: "port",
  messages: "crew",
  archive: "crew",
  chat: "crew",
  account: "crew",
  myAccount: "crew",
  sailingProfile: "crew",
  profileCreate: "crew",
  qualAdd: "crew",
  voyageAdd: "crew",
  boats: "crew",
  boatView: "crew",
  boatCreate: "crew",
  myOpps: "crew",
  oppCreate: "crew",
  listings: "crew",
  listingCreate: "crew",
  settings: "crew",
  changePassword: "crew",
  about: "crew",
};

export type SailingProfile = {
  first: string;
  last: string;
  birth: string;
  gender: string;
  nationality: string;
  residence: string;
  smoker: boolean;
  languages: string[];
  activeAs: string;
  available: string[];
  years: string;
  ocean: string;
  coastal: string;
  nights: string;
  experienced: string;
  skills: { name: string; level: string }[];
  nautical: string[];
  regions: string[];
  rallies: string[];
};

export type Boat = { id: string; name: string; model: string; manufacturer: string; length: string; unit: string; hull: string; website: string; facebook: string; description: string; photo?: string };
export type Qualification = { id: string; org: string; level: string };
export type Voyage = { id: string; from: string; to: string; year: string };

export type Goal = "signin" | "swipe" | "message" | "profile" | "boat" | "opportunity" | "archive" | "market" | "report" | "reset";

export const GOALS: { key: Goal; label: string }[] = [
  { key: "signin", label: "Sign in (or register)" },
  { key: "swipe", label: "Swipe an opportunity away" },
  { key: "profile", label: "Create your sailing profile" },
  { key: "message", label: "Message a crew member" },
  { key: "boat", label: "Add a boat profile" },
  { key: "opportunity", label: "Post a sailing opportunity" },
  { key: "archive", label: "Archive a conversation" },
  { key: "market", label: "Read a marketplace listing" },
  { key: "report", label: "Write a cruising report" },
  { key: "reset", label: "Reset your password" },
];

export type Store = {
  route: Route;
  push: (r: Route) => void;
  pop: () => void;
  /** Replace the whole stack (used by tabs and success screens) */
  reset: (r: Route | Route[]) => void;
  replace: (r: Route) => void;
  /** Go back to the nearest screen with this name; false if it isn't in the stack */
  popTo: (s: ScreenName) => boolean;
  goTab: (t: TabKey) => void;
  done: (g: Goal) => void;
  toast: (msg: string) => void;

  threads: Thread[];
  setThreads: (fn: (t: Thread[]) => Thread[]) => void;
  /** Open (or start) a conversation with someone */
  openChat: (contact: { id: string; name: string; avatar: string }) => void;

  profile: SailingProfile | null;
  setProfile: (p: SailingProfile | null) => void;
  quals: Qualification[];
  setQuals: (fn: (q: Qualification[]) => Qualification[]) => void;
  voyages: Voyage[];
  setVoyages: (fn: (v: Voyage[]) => Voyage[]) => void;
  boats: Boat[];
  setBoats: (fn: (b: Boat[]) => Boat[]) => void;
  myOpps: Opportunity[];
  setMyOpps: (fn: (o: Opportunity[]) => Opportunity[]) => void;
  myListings: Listing[];
  setMyListings: (fn: (l: Listing[]) => Listing[]) => void;
  reports: Report[];
  setReports: (fn: (r: Report[]) => Report[]) => void;
  /** Swipe decks remember where you got to */
  deck: Record<string, number>;
  setDeck: (key: string, n: number) => void;
};

export const StoreCtx = createContext<Store | null>(null);

export function useStore() {
  const s = useContext(StoreCtx);
  if (!s) throw new Error("useStore outside SailSwipe");
  return s;
}

export const uid = () => Math.random().toString(36).slice(2, 9);

export const nowTime = () =>
  new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();
