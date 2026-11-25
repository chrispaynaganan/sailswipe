"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ME } from "@/lib/data";
import { useStore } from "../store";
import { BackButton, Button, TextField, cn, ease } from "../ui";

const fade = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease } };

function Logo({ className }: { className?: string }) {
  return <img src="/img/logo.png" alt="SailSwipe" width={146} height={146} className={cn("size-36.5 object-cover", className)} />;
}

export function Splash() {
  const { reset } = useStore();
  useEffect(() => {
    const t = setTimeout(() => reset({ s: "login" }), 1900);
    return () => clearTimeout(t);
  }, [reset]);
  return (
    <button type="button" onClick={() => reset({ s: "login" })} className="absolute inset-0 flex cursor-pointer items-center justify-center bg-n-100" aria-label="Continue">
      <Logo className="-mt-1 animate-splash" />
    </button>
  );
}

const required = (v: string) => (v.trim() ? "" : "Required Field");

export function Register() {
  const { reset, done } = useStore();
  const [f, setF] = useState({ first: "", last: "", email: "", pw: "", pw2: "" });
  const [tried, setTried] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const err = {
    first: "",
    last: "",
    email: required(f.email) || (/^\S+@\S+\.\S+$/.test(f.email) ? "" : "Enter a valid email address"),
    pw: required(f.pw) || (f.pw.length < 8 ? "Use at least 8 characters" : ""),
    pw2: required(f.pw2) || (f.pw2 !== f.pw ? "Passwords don’t match" : ""),
  };
  const ok = !err.email && !err.pw && !err.pw2;
  const submit = () => {
    setTried(true);
    if (!ok) return;
    done("signin");
    reset({ s: "opportunities" });
  };
  const e = (k: keyof typeof err) => (tried ? err[k] : "");

  return (
    <div className="absolute inset-0 overflow-y-auto bg-n-100 scrollbar-none">
      <motion.div {...fade} className="flex flex-col items-center px-12 pt-19.25 pb-12">
        <Logo />
        <h1 className="mt-px text-3xl font-medium text-n-900">Welcome to SailSwipe</h1>
        <form className="mt-7 flex w-full flex-col gap-4" onSubmit={(ev) => { ev.preventDefault(); submit(); }}>
          <div className="flex gap-2">
            <TextField className="flex-1" label="First Name" placeholder="First Name" value={f.first} onChange={set("first")} />
            <TextField className="flex-1" label="Last Name" placeholder="Last Name" value={f.last} onChange={set("last")} />
          </div>
          <TextField label="Email Address" placeholder="Email Address" type="email" value={f.email} onChange={set("email")} error={e("email")} />
          <TextField label="Password" placeholder="Password" type="password" value={f.pw} onChange={set("pw")} error={e("pw")} />
          <TextField label="Retype Password" placeholder="Retype Password" type="password" value={f.pw2} onChange={set("pw2")} error={e("pw2")} />
          <div className="mt-5.75 flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Register
            </Button>
            <button type="button" onClick={() => reset({ s: "login" })} className="cursor-pointer text-xs text-n-900 underline decoration-from-font hover:text-p-600">
              Already have an account? Login
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function Login() {
  const { reset, push, done } = useStore();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = () => {
    if (busy) return;
    setBusy(true);
    // Empty form? Fill the demo account in so the prototype is never a dead end
    if (!email || !pw) {
      setEmail(email || ME.email);
      setPw(pw || ME.password);
    }
    setTimeout(() => {
      done("signin");
      reset({ s: "opportunities" });
    }, !email || !pw ? 650 : 250);
  };

  return (
    <div className="absolute inset-0 overflow-y-auto bg-n-100 scrollbar-none">
      <motion.div {...fade} className="flex min-h-full flex-col items-center px-12 pt-19.25 pb-11">
        <Logo />
        <h1 className="mt-px text-3xl font-medium text-n-900">Welcome to SailSwipe</h1>
        <form className="mt-11.25 flex w-full flex-col gap-4" onSubmit={(ev) => { ev.preventDefault(); submit(); }}>
          <TextField label="Email Address" placeholder="Email Address" type="email" value={email} onChange={setEmail} />
          <TextField label="Password" placeholder="Password" type="password" value={pw} onChange={setPw} />
          <div className="mt-5.75 flex flex-col gap-4">
            <Button type="submit" className="w-full">
              {busy ? "Logging in…" : "Login"}
            </Button>
            <button type="button" onClick={() => reset({ s: "register" })} className="cursor-pointer text-xs text-n-900 underline decoration-from-font hover:text-p-600">
              Don’t have an account yet? Register for Free
            </button>
          </div>
        </form>
        <button type="button" onClick={() => push({ s: "forgotEmail" })} className="mt-auto cursor-pointer text-xs text-n-900 underline decoration-from-font hover:text-p-600">
          Forgot Password?
        </button>
      </motion.div>
    </div>
  );
}

function ForgotFrame({ title, sub, onClose, children }: { title: string; sub?: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-y-auto bg-n-100 scrollbar-none">
      <div className="absolute top-22 left-10.5">
        <BackButton icon="x-close" label="Close" onClick={onClose} />
      </div>
      <motion.div {...fade} className="flex flex-col items-center px-6.75 pt-42.75">
        <h1 className="text-3xl font-medium text-n-900">{title}</h1>
        {sub && <p className="mt-2.5 min-h-8 text-center text-sm text-n-900">{sub}</p>}
        <div className="mt-13.75 flex w-full flex-col px-5.25">{children}</div>
      </motion.div>
    </div>
  );
}

const masked = (e: string) => {
  const [u, d = ""] = e.split("@");
  const [host, ...tld] = d.split(".");
  return `${u[0] ?? ""}***@${host[0] ?? ""}${"*".repeat(Math.max(host.length - 1, 3))}.${tld.join(".") || "com"}`;
};

export function ForgotEmail() {
  const { pop, push } = useStore();
  const [email, setEmail] = useState(ME.email);
  const ok = /^\S+@\S+\.\S+$/.test(email);
  return (
    <ForgotFrame title="Forgot your password?" sub="Enter your email, and we’ll send you a code to update your password." onClose={pop}>
      <TextField label="Email Address" placeholder="Email Address" type="email" value={email} onChange={setEmail} />
      <Button className="mt-9.5 w-full" disabled={!ok} onClick={() => push({ s: "forgotVerify" })}>
        Send Verification Code
      </Button>
    </ForgotFrame>
  );
}

export function ForgotVerify() {
  const { reset, push } = useStore();
  const [code, setCode] = useState("");
  const [left, setLeft] = useState(179);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const full = code.length === 6;

  return (
    <ForgotFrame title="Verify your Email" sub={`Enter the 6-digit code we sent to your email: ${masked(ME.email)}.`} onClose={() => reset({ s: "login" })}>
      <div className="relative w-72.75 self-center" onClick={() => input.current?.focus()}>
        <div className="flex gap-2.5">
          {Array.from({ length: 6 }, (_, i) => {
            const ch = code[i];
            const caret = i === code.length;
            return (
              <motion.span
                key={i}
                animate={ch ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cn("relative flex h-14.25 flex-1 items-center justify-center rounded-lg bg-n-200 text-2xl", ch ? "text-n-900" : "text-n-500")}
              >
                {ch ?? "0"}
                {caret && <span className="absolute h-7 w-px animate-caret bg-n-900" />}
              </motion.span>
            );
          })}
        </div>
        <input
          ref={input}
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label="6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
      <div className="mt-2.25 h-3.25 w-72.75 self-center text-xs text-n-900">
        {left > 0 ? (
          <span>
            Resend code in {mm}:{ss}
          </span>
        ) : (
          <button type="button" onClick={() => { setLeft(179); setCode(""); }} className="cursor-pointer underline decoration-from-font hover:text-p-600">
            Resend code
          </button>
        )}
      </div>
      <Button className="mt-5.25 w-full" disabled={!full} onClick={() => push({ s: "forgotReset" })}>
        Verify
      </Button>
      <p className="mt-4 text-center text-2xs text-n-600">Prototype: any 6 digits will do.</p>
    </ForgotFrame>
  );
}

export function ForgotReset() {
  const { reset, push } = useStore();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [tried, setTried] = useState(false);
  const errA = tried && a.length < 8 ? "Use at least 8 characters" : "";
  const errB = tried && b !== a ? "Passwords don’t match" : "";
  return (
    <ForgotFrame title="Reset Password" sub="Set up a new password to secure your account." onClose={() => reset({ s: "login" })}>
      <div className="flex flex-col gap-4">
        <TextField label="Create New Password" type="password" placeholder="New Password" value={a} onChange={setA} error={errA} />
        <TextField label="Retype New Password" type="password" placeholder="Retype New Password" value={b} onChange={setB} error={errB} />
      </div>
      <Button
        className="mt-9.75 w-full"
        onClick={() => {
          setTried(true);
          if (a.length >= 8 && a === b) push({ s: "forgotDone" });
        }}
      >
        Save Changes
      </Button>
    </ForgotFrame>
  );
}

export function ForgotDone() {
  const { reset, done } = useStore();
  useEffect(() => done("reset"), [done]);
  return (
    <div className="absolute inset-0 bg-n-100">
      <div className="absolute top-22 left-10.5">
        <BackButton icon="x-close" label="Close" onClick={() => reset({ s: "login" })} />
      </div>
      <motion.div {...fade} className="absolute inset-x-4 top-93.25 flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-medium text-n-900">Password has been changed</h1>
        <p className="px-2.75 text-sm text-n-900">
          Your password has been successfully updated. You can now use your new password to access your account securely.
        </p>
      </motion.div>
      <Button className="absolute bottom-9.75 left-12 w-74.25" onClick={() => reset({ s: "login" })}>
        Return to Login
      </Button>
    </div>
  );
}
