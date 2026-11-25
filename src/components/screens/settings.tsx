"use client";

import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { useStore } from "../store";
import { FooterButton, Header, Icon, TextField } from "../ui";

function Frame({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  const { pop } = useStore();
  return (
    <div className="absolute inset-0 flex flex-col pt-13.25 pb-21.25">
      <Header title="Settings" onBack={pop} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 scrollbar-none">{children}</div>
      {footer}
    </div>
  );
}

function Crumb({ parent, here }: { parent: string; here: string }) {
  return (
    <p className="flex items-center gap-2.5 pt-6.25 text-base">
      <span className="text-n-600">{parent}</span>
      <Icon name="chevron-right" className="text-n-600" />
      <span className="text-ink">{here}</span>
    </p>
  );
}

function LinkRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-n-500/60 px-4 text-sm text-n-900 transition hover:bg-n-200/60"
    >
      {label}
      <Icon name="chevron-right" className="text-ink" />
    </motion.button>
  );
}

export function Settings() {
  const { push, reset } = useStore();
  return (
    <Frame>
      <h2 className="pt-3 pl-1.25 text-base text-ink">Privacy and Security</h2>
      <div className="mt-3">
        <LinkRow label="Change Password" onClick={() => push({ s: "changePassword" })} />
      </div>
      <h2 className="pt-11 text-base text-ink">Others</h2>
      <div className="mt-3">
        <LinkRow label="About the App" onClick={() => push({ s: "about" })} />
      </div>
      <button type="button" onClick={() => reset({ s: "login" })} className="mt-10 cursor-pointer text-sm text-error hover:underline">
        Log out
      </button>
    </Frame>
  );
}

export function ChangePassword() {
  const { pop, toast } = useStore();
  const [cur, setCur] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [tried, setTried] = useState(false);
  const errs = {
    cur: tried && !cur ? "Required Field" : "",
    a: tried && a.length < 8 ? "Use at least 8 characters" : "",
    b: tried && a !== b ? "Passwords don’t match" : "",
  };
  return (
    <Frame
      footer={
        <FooterButton
          onClick={() => {
            setTried(true);
            if (cur && a.length >= 8 && a === b) {
              toast("Password updated");
              pop();
            }
          }}
        >
          Update Password
        </FooterButton>
      }
    >
      <Crumb parent="Privacy and Security" here="Change Password" />
      <div className="mt-4 flex flex-col gap-4">
        <TextField label="Enter Current Password" type="password" placeholder="Current Password" value={cur} onChange={setCur} error={errs.cur} />
        <TextField label="Create New Password" type="password" placeholder="New Password" value={a} onChange={setA} error={errs.a} />
        <TextField label="Retype New Password" type="password" placeholder="Retype New Password" value={b} onChange={setB} error={errs.b} />
      </div>
    </Frame>
  );
}

export function About() {
  return (
    <Frame>
      <Crumb parent="Others" here="About the App" />
      <div className="mt-8 flex flex-col gap-4 text-sm text-ink">
        <p>
          Designed for skippers, crew, and sailing enthusiasts, our platform connects the global sailing community with the resources they need to navigate, plan, and embark on
          successful voyages.
        </p>
        <p>Whether you’re organizing a sailing opportunity, looking for crew, or managing a charter, our app streamlines the process, ensuring a seamless experience at sea.</p>
        <div>
          <p>Key Features:</p>
          <ul className="list-disc pl-5">
            <li>Sailing Opportunities & Crew Matching – Discover and join voyages or find skilled crew members for your journey.</li>
            <li>Port Information & Formalities – Access up-to-date entry requirements, customs regulations, and local services.</li>
            <li>Cruising Reports – Stay informed with first-hand insights and navigation updates from fellow sailors.</li>
            <li>Charters & Marketplace – Explore available charters or buy, sell, and trade essential sailing gear and services.</li>
          </ul>
        </div>
        <p>Built by sailors, for sailors—this app is your all-in-one tool for safer, more efficient, and well-connected sailing. ⚓🌍</p>
      </div>
    </Frame>
  );
}
