"use client";

import { AnimatePresence, motion, useAnimationControls, type PanInfo } from "motion/react";
import { useId, useState, type CSSProperties, type ReactNode } from "react";

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ icons */

export type IconName =
  | "anchor" | "archive" | "archive-red" | "arrow-left" | "bag" | "banknote" | "calendar" | "certificate"
  | "chevron-down" | "chevron-right" | "clear" | "clipboard-check" | "close-x" | "edit" | "eye" | "eye-slash"
  | "facebook" | "globe" | "image" | "inbox" | "lat" | "lifebuoy" | "lng" | "mail" | "map-pin-alt" | "phone"
  | "pin" | "plus-circle" | "search" | "send" | "settings" | "ship" | "signal" | "sliders" | "square" | "swap"
  | "user" | "x-close";

/** A Figma icon used as a mask, so it takes the text colour */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  return <span aria-hidden className={cn("icon", /(^|\s)size-/.test(className ?? "") ? "" : "size-6", className)} style={{ "--icon": `url(/ic/${name}.svg)` } as CSSProperties} />;
}

/* ------------------------------------------------------------------ device chrome */

export function StatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-13.25 bg-n-100/90 backdrop-blur-xs">
      <img src="/ic/status-left.svg" alt="" width={36} height={14} className="absolute top-6.5 left-13.5 h-3.5 w-9" />
      <img src="/ic/status-right.svg" alt="" width={93} height={14} className="absolute top-6.5 left-68.25 h-3.5 w-23.25" />
    </div>
  );
}

export function HomeIndicator() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-8.5 bg-white">
      <span className="absolute bottom-2 left-1/2 h-1.25 w-33.5 -translate-x-1/2 rounded-full bg-n-900" />
    </div>
  );
}

export type TabKey = "opportunities" | "crew" | "charters" | "marketplace" | "port";

const TABS: { key: TabKey; label: string; icon: IconName }[] = [
  { key: "opportunities", label: "Opportunities", icon: "ship" },
  { key: "crew", label: "Crew", icon: "user" },
  { key: "charters", label: "Charters", icon: "anchor" },
  { key: "marketplace", label: "Marketplace", icon: "bag" },
  { key: "port", label: "Port Info", icon: "pin" },
];

export function TabBar({ active, onSelect }: { active: TabKey; onSelect: (t: TabKey) => void }) {
  return (
    <nav className="absolute inset-x-0 bottom-8.5 z-30 flex h-12.75 items-center bg-white px-4 py-1">
      {TABS.map((t) => {
        const on = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onSelect(t.key)}
            aria-current={on ? "page" : undefined}
            className={cn("flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-1.5", on ? "text-p-600" : "text-n-900")}
          >
            <motion.span animate={on ? { y: [0, -3, 0] } : { y: 0 }} transition={{ duration: 0.35 }} className="flex">
              <Icon name={t.icon} />
            </motion.span>
            <span className="text-tab leading-none">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ headers */

export function BackButton({ onClick, icon = "arrow-left", label = "Back" }: { onClick: () => void; icon?: IconName; label?: string }) {
  return (
    <motion.button type="button" aria-label={label} onClick={onClick} whileTap={{ scale: 0.85 }} className="flex size-6 cursor-pointer text-ink">
      <Icon name={icon} />
    </motion.button>
  );
}

/** White 97px header under the status bar, with a hairline at the bottom */
export function Header({
  title,
  onBack,
  center,
  right,
  titleSlot,
  small,
}: {
  title?: ReactNode;
  onBack?: () => void;
  center?: boolean;
  /** Form screens use the smaller Heading/006 */
  small?: boolean;
  right?: ReactNode;
  titleSlot?: ReactNode;
}) {
  return (
    <header className="relative h-24.25 shrink-0 border-b border-n-200 bg-white">
      {onBack && (
        <div className="absolute top-9.25 left-3.75">
          <BackButton onClick={onBack} />
        </div>
      )}
      {titleSlot ??
        (center ? (
          <h1 className="absolute top-9.5 left-1/2 max-w-60 -translate-x-1/2 truncate text-xl font-medium whitespace-nowrap text-ink">{title}</h1>
        ) : (
          <h1 className={cn("absolute left-13.75 max-w-80 truncate font-medium whitespace-nowrap text-ink", small ? "top-9.5 text-xl" : "top-8.75 text-2xl")}>{title}</h1>
        ))}
      {right && <div className="absolute top-9.25 right-4.25 flex h-6 items-center gap-7.5">{right}</div>}
    </header>
  );
}

export function TextAction({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="cursor-pointer text-sm text-ink transition hover:text-p-600">
      {children}
    </button>
  );
}

export function GreetingHeader({ onAvatar, onInbox, onSettings, unread }: { onAvatar: () => void; onInbox: () => void; onSettings: () => void; unread?: boolean }) {
  return (
    <div className="flex h-24.25 shrink-0 items-start justify-between pt-6.5 pr-4 pl-6.25">
      <button type="button" onClick={onAvatar} className="flex cursor-pointer items-center gap-4" aria-label="Your account">
        <img src="/img/av-andrew.webp" alt="" width={39} height={39} className="size-9.75 rounded-full" />
        <span className="text-xl font-medium text-n-900">Hi, Andrew!</span>
      </button>
      <div className="flex w-19.5 items-center justify-between pt-2">
        <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={onInbox} aria-label="Messages" className="relative flex cursor-pointer text-ink">
          <Icon name="inbox" />
          {unread && <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-p-600 ring-2 ring-n-100" />}
        </motion.button>
        <motion.button type="button" whileTap={{ scale: 0.85, rotate: 30 }} onClick={onSettings} aria-label="Settings" className="flex cursor-pointer text-ink">
          <Icon name="settings" />
        </motion.button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ buttons */

type BtnVariant = "primary" | "outline" | "danger" | "muted" | "link";

export function Button({
  children,
  variant = "primary",
  onClick,
  disabled,
  className,
  type = "button",
}: {
  children: ReactNode;
  variant?: BtnVariant;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const look = disabled
    ? "bg-n-200 text-n-600"
    : {
        primary: "bg-p-700 text-n-100 hover:bg-p-600",
        outline: "border-2 border-p-700 text-p-700 hover:bg-p-100",
        danger: "bg-error text-n-100 hover:bg-error-dark",
        muted: "bg-n-200 text-n-600",
        link: "text-p-700 hover:underline",
      }[variant];
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={cn(
        "flex h-9.75 cursor-pointer items-center justify-center rounded-btn px-4 text-base leading-none font-medium tracking-btn transition-colors disabled:cursor-not-allowed",
        look,
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

/** "Not Interested" + "Message" pair that sits above the tab bar */
export function ActionPair({ left, right, onLeft, onRight }: { left: string; right: string; onLeft: () => void; onRight: () => void }) {
  return (
    <div className="flex h-13 shrink-0 items-center justify-center gap-4 bg-white px-4">
      <Button variant="outline" onClick={onLeft} className="w-43">
        {left}
      </Button>
      <Button onClick={onRight} className="w-43">
        {right}
      </Button>
    </div>
  );
}

/** One full-width button pinned above the tab bar */
export function FooterButton({ children, onClick, disabled, variant }: { children: ReactNode; onClick: () => void; disabled?: boolean; variant?: BtnVariant }) {
  return (
    <div className="shrink-0 px-4 pt-2 pb-2.5">
      <Button onClick={onClick} disabled={disabled} variant={variant} className="w-full">
        {children}
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ form fields */

const box = "flex h-10 w-full items-center gap-2.5 rounded-field px-4 text-sm transition-colors";

export function Label({ children, htmlFor, className }: { children: ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("text-sm text-n-900", className)}>
      {children}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  className,
  prefix,
  inputMode,
  autoFocus,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "month";
  error?: string;
  className?: string;
  prefix?: string;
  inputMode?: "numeric" | "decimal" | "email" | "text";
  autoFocus?: boolean;
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const pw = type === "password";
  const bad = Boolean(error);
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className={cn(box, bad ? "bg-error-bg" : "bg-n-200 focus-within:ring-1 focus-within:ring-p-500")}>
        {prefix && (
          <span className="flex h-5 shrink-0 items-center border-r border-n-500 pr-2.5 text-n-600">{prefix}</span>
        )}
        <input
          id={id}
          type={pw ? (show ? "text" : "password") : type}
          value={value}
          inputMode={inputMode}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={bad}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent outline-none",
            bad ? "text-error placeholder:text-error" : "text-n-900",
            pw && !show && value && "tracking-widest",
          )}
        />
        {pw && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className={cn("flex cursor-pointer", bad ? "text-error-dark" : "text-n-600")}
          >
            <Icon name={show ? "eye-slash" : "eye"} />
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {bad && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-2xs text-error"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  className,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className={cn(box, "relative bg-n-200 focus-within:ring-1 focus-within:ring-p-500")}>
        <span className={cn("min-w-0 flex-1 truncate", value ? "text-n-900" : "text-n-700")}>{value || placeholder}</span>
        <Icon name="chevron-down" className="text-n-900" />
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function MonthField({ label, value, onChange, placeholder = "Month/Year" }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className={cn(box, "relative bg-n-200 focus-within:ring-1 focus-within:ring-p-500")}>
        <span className={cn("flex-1", value ? "text-n-900" : "text-n-600")}>{value ? fmtMonth(value) : placeholder}</span>
        <Icon name="calendar" className="text-n-700" />
        <input id={id} type="month" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
      </div>
    </div>
  );
}

export function DateField({ label, value, onChange, placeholder = "Enter Date" }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const id = useId();
  const shown = value ? value.split("-").reverse().slice(0, 2).reverse().join("/") + "/" + value.slice(0, 4) : "";
  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className={cn(box, "relative bg-n-200 focus-within:ring-1 focus-within:ring-p-500")}>
        <span className={cn("flex-1", value ? "text-n-900" : "text-n-600")}>{shown || placeholder}</span>
        <Icon name="calendar" className="text-n-700" />
        <input id={id} type="date" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
      </div>
    </div>
  );
}

export const fmtMonth = (v: string) => {
  const [y, m] = v.split("-").map(Number);
  if (!y || !m) return v;
  return `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m - 1]} ${y}`;
};

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  max = 500,
  tall,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  max?: number;
  tall?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <textarea
        id={id}
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full resize-y rounded-field bg-n-200 px-4 py-3 text-sm text-n-900 outline-none focus:ring-1 focus:ring-p-500",
          tall ? "h-47.5" : "h-17.5",
        )}
      />
      <span className="self-end text-2xs text-n-900">
        {value.length}/{max}
      </span>
    </div>
  );
}

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} onClick={() => onChange(!checked)} className="flex cursor-pointer items-center gap-2 text-sm text-n-900">
      <span className={cn("flex size-6 items-center justify-center", checked ? "text-p-700" : "text-n-900")}>
        {checked ? (
          <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="flex size-5 items-center justify-center rounded-sm bg-p-700">
            <svg viewBox="0 0 12 12" className="size-3 text-n-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 6.5 5 9l4.5-6" />
            </svg>
          </motion.span>
        ) : (
          <Icon name="square" />
        )}
      </span>
      {label}
    </button>
  );
}

export function Chip({ children, onRemove }: { children: ReactNode; onRemove?: () => void }) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex h-6.5 items-center gap-1.5 rounded-md bg-n-100 px-2 text-xs whitespace-nowrap text-n-700"
    >
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Remove ${children}`} className="flex cursor-pointer text-n-900">
          <Icon name="x-close" className="size-3" />
        </button>
      )}
    </motion.span>
  );
}

/** Chips in a grey well, with a dropdown to add more */
export function MultiSelect({
  label,
  values,
  onChange,
  options,
  placeholder = "Select",
}: {
  label?: string;
  values: string[];
  onChange: (v: string[]) => void;
  options: string[];
  placeholder?: string;
}) {
  const id = useId();
  const left = options.filter((o) => !values.includes(o));
  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative flex min-h-11.25 items-center gap-2.5 rounded-field bg-n-200 py-2.25 pr-4 pl-3.75">
        <div className="flex flex-1 flex-wrap gap-2.5">
          <AnimatePresence initial={false}>
            {values.map((v) => (
              <Chip key={v} onRemove={() => onChange(values.filter((x) => x !== v))}>
                {v}
              </Chip>
            ))}
          </AnimatePresence>
          {values.length === 0 && <span className="text-sm text-n-700">{placeholder}</span>}
        </div>
        <span className="relative flex shrink-0">
          <Icon name="chevron-down" className="text-n-900" />
          {left.length > 0 && (
            <select
              id={id}
              value=""
              onChange={(e) => e.target.value && onChange([...values, e.target.value])}
              className="absolute -inset-2 cursor-pointer opacity-0"
              aria-label={`Add to ${label ?? "list"}`}
            >
              <option value="">Add…</option>
              {left.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          )}
        </span>
      </div>
    </div>
  );
}

export function PillGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-n-900">{label}</span>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const on = o === value;
          return (
            <motion.button
              key={o}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => onChange(o)}
              className={cn(
                "h-7 cursor-pointer rounded-md border px-2 text-xs transition-colors",
                on ? "border-p-700 bg-p-700 text-n-100" : "border-n-500 text-n-700 hover:border-p-500",
              )}
            >
              {o}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/** Read-only value box used on profile cards */
export function ReadField({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <span className="text-base text-p-900">{label}</span>
      <span className="rounded-box bg-n-200 p-2.5 text-base text-n-500">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ tabs */

export function Segmented<T extends string>({ items, value, onChange, className }: { items: readonly { key: T; label: string }[]; value: T; onChange: (v: T) => void; className?: string }) {
  const id = useId();
  return (
    <div className={cn("flex rounded-xl bg-n-200 p-1", className)}>
      {items.map((it) => {
        const on = it.key === value;
        return (
          <button key={it.key} type="button" onClick={() => onChange(it.key)} className="relative flex h-5.75 flex-1 cursor-pointer items-center justify-center">
            {on && <motion.span layoutId={`seg-${id}`} transition={{ duration: 0.3, ease }} className="absolute inset-0 rounded-lg bg-n-100 shadow-seg" />}
            <span className={cn("relative text-xs", on ? "text-p-700" : "text-n-750")}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function IconTabs<T extends string>({ items, value, onChange }: { items: readonly { key: T; label: string; icon: IconName }[]; value: T; onChange: (v: T) => void }) {
  const id = useId();
  return (
    <div className="flex items-center gap-4">
      {items.map((it) => {
        const on = it.key === value;
        return (
          <button key={it.key} type="button" onClick={() => onChange(it.key)} className="relative flex flex-1 cursor-pointer flex-col items-center gap-0.5 py-1.25">
            {on && <motion.span layoutId={`it-${id}`} transition={{ duration: 0.3, ease }} className="absolute inset-0 rounded-xl bg-p-100" />}
            <Icon name={it.icon} className={cn("relative", on ? "text-p-700" : "text-n-600")} />
            <span className={cn("relative text-sm whitespace-nowrap", on ? "text-p-700" : "text-n-600")}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ overlays */

export function Alert({
  open,
  title,
  body,
  cancel,
  confirm,
  onCancel,
  onConfirm,
  cancelTone = "danger",
}: {
  open: boolean;
  title: string;
  body: string;
  cancel: string;
  confirm: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelTone?: "danger" | "plain";
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-ink/20">
          <motion.div
            role="alertdialog"
            aria-label={title}
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="w-59.5 overflow-hidden rounded-2xl bg-white/95 text-center shadow-alert backdrop-blur-md"
          >
            <div className="flex flex-col gap-2 px-4 pt-4 pb-3.5">
              <p className="text-sm text-n-900">{title}</p>
              <p className="text-2xs text-n-700">{body}</p>
            </div>
            <div className="grid grid-cols-2 border-t border-n-200 text-xs">
              <button type="button" onClick={onCancel} className={cn("h-9.5 cursor-pointer border-r border-n-200 hover:bg-n-200", cancelTone === "danger" ? "text-error" : "text-n-900")}>
                {cancel}
              </button>
              <button type="button" onClick={onConfirm} className="h-9.5 cursor-pointer text-p-600 hover:bg-n-200">
                {confirm}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Sheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-ink/10" onClick={onClose}>
          <motion.div
            role="dialog"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease }}
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white px-6 pt-8 pb-12 shadow-sheet"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl text-ink">{title}</h2>
              <BackButton icon="x-close" label="Close" onClick={onClose} />
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Swipe a row left to reveal edit + archive, like the Figma list rows */
export function SwipeRow({ children, onEdit, onArchive, editIcon = "edit" }: { children: ReactNode; onEdit?: () => void; onArchive: () => void; editIcon?: IconName }) {
  const controls = useAnimationControls();
  const [open, setOpen] = useState(false);
  const snap = (to: boolean) => {
    setOpen(to);
    void controls.start({ x: to ? -108 : 0, transition: { duration: 0.3, ease } });
  };
  const onEnd = (_: unknown, info: PanInfo) => snap(info.offset.x < -50 || (open && info.offset.x < 30));
  return (
    <div className="relative">
      <div className="absolute inset-y-0 right-0 flex gap-2">
        {onEdit && (
          <button type="button" onClick={() => { snap(false); onEdit(); }} aria-label="Edit" className="flex w-11 cursor-pointer items-center justify-center rounded-2xl bg-n-200 text-ink">
            <Icon name={editIcon} />
          </button>
        )}
        <button type="button" onClick={onArchive} aria-label="Archive" className="flex w-11 cursor-pointer items-center justify-center rounded-2xl bg-error-soft text-error">
          <Icon name="archive" />
        </button>
      </div>
      <motion.div drag="x" dragConstraints={{ left: -108, right: 0 }} dragElastic={0.1} onDragEnd={onEnd} animate={controls} className="relative touch-pan-y bg-n-100">
        {children}
      </motion.div>
    </div>
  );
}

export function Empty({ text, action, onAction }: { text: string; action: string; onAction: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col items-center gap-4 px-10 pt-32.5 text-center">
      <p className="text-sm whitespace-pre-line text-n-900">{text}</p>
      <Button onClick={onAction} className="w-55">
        {action}
      </Button>
    </motion.div>
  );
}
