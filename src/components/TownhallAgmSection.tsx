"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { ExpandableText } from "@/components/ExpandableText";
import {
  AuthExpiredError,
  categoryLabel,
  logoutSession,
  decideTownhallAccess,
  enrichSessionUser,
  fetchTownhallAgmContent,
  loginToKnack,
  requestKnackPasswordReset,
  resolveExistingSession,
  saveSession,
  syncKnackRuntimeSession,
  type KnackSessionUser,
  type TownhallAgmContent,
  type TownhallAgmItem,
} from "@/lib/knack-session";

type Status =
  | { kind: "loading" }
  | { kind: "login"; error?: string }
  | { kind: "dues"; email?: string }
  | { kind: "denied" }
  | { kind: "ready"; email?: string; content: TownhallAgmContent }
  | { kind: "content-error"; email?: string; message: string };

export function TownhallAgmSection() {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const existing = await resolveExistingSession();
      if (cancelled) return;

      if (!existing) {
        setStatus({ kind: "login" });
        return;
      }

      await restoreSession(existing);
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  async function restoreSession(user: KnackSessionUser) {
    const enriched = await enrichSessionUser(user);
    const access = decideTownhallAccess(enriched);
    if (access === "dues") {
      setStatus({ kind: "dues", email: enriched.email });
      return;
    }
    if (access === "denied") {
      await logoutSession();
      setStatus({ kind: "denied" });
      return;
    }

    try {
      const content = await fetchTownhallAgmContent(enriched.token);
      saveSession(enriched);
      await syncKnackRuntimeSession(enriched);
      setStatus({ kind: "ready", email: enriched.email, content });
    } catch (error) {
      if (error instanceof AuthExpiredError) {
        await logoutSession();
        setStatus({
          kind: "login",
          error: "Your session has expired. Please sign in again.",
        });
        return;
      }
      setStatus({
        kind: "content-error",
        email: enriched.email,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load Townhall & AGM materials.",
      });
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const user = await loginToKnack(email.trim(), password);
      const withEmail: KnackSessionUser = {
        ...user,
        email: user.email || readEmailFromValues(user) || email.trim(),
      };
      const enriched = await enrichSessionUser(withEmail);
      const access = decideTownhallAccess(enriched);
      saveSession(enriched);
      await syncKnackRuntimeSession(enriched);
      setPassword("");

      if (access === "denied") {
        await logoutSession();
        setStatus({ kind: "denied" });
        return;
      }

      if (access === "dues") {
        setStatus({ kind: "dues", email: enriched.email });
        return;
      }

      const content = await fetchTownhallAgmContent(enriched.token);
      setStatus({
        kind: "ready",
        email: enriched.email,
        content,
      });
    } catch (error) {
      await logoutSession();
      setStatus({
        kind: "login",
        error:
          error instanceof Error
            ? error.message
            : "Unable to sign in right now.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function onLogout() {
    await logoutSession();
    setEmail("");
    setPassword("");
    setStatus({ kind: "login" });
  }

  if (status.kind === "loading") {
    return (
      <p className="text-sm text-forest-mid">
        Checking for an existing HOA session…
      </p>
    );
  }

  if (status.kind === "login") {
    return (
      <LoginPanel
        email={email}
        password={password}
        error={status.error}
        submitting={submitting}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={onSubmit}
      />
    );
  }

  if (status.kind === "denied") {
    return (
      <GateMessage
        title="Access restricted"
        body="This area is available to registered Wedgewood homeowners only."
        onLogout={onLogout}
      />
    );
  }

  if (status.kind === "dues") {
    return (
      <GateMessage
        title="Dues must be current"
        body="Townhall and AGM materials are available after HOA dues are paid in full."
        email={status.email}
        onLogout={onLogout}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/pay-hoa-fees" className="btn btn-brick">
            Pay HOA fees
          </Link>
          <Link href="/contact/homeowner" className="btn btn-outline">
            Contact support
          </Link>
        </div>
      </GateMessage>
    );
  }

  if (status.kind === "content-error") {
    return (
      <GateMessage
        title="Unable to load materials"
        body={status.message}
        email={status.email}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center justify-end gap-3 text-sm text-forest-mid">
        {status.email ? <span>Signed in as {status.email}</span> : null}
        <button
          type="button"
          onClick={onLogout}
          className="text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep"
        >
          Sign out
        </button>
      </div>

      <div className="grid gap-14 lg:grid-cols-2 lg:gap-12">
        <MaterialsColumn
          eyebrow="Town Halls"
          title="Meeting links & recordings"
          empty="No townhall materials are posted right now."
          items={status.content.townhalls}
        />
        <MaterialsColumn
          eyebrow="Annual General Meeting"
          title="Registration, minutes & files"
          empty="No AGM materials are posted right now."
          items={status.content.agms}
        />
      </div>
    </div>
  );
}

function LoginPanel({
  email,
  password,
  error,
  submitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: {
  email: string;
  password: string;
  error?: string;
  submitting: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState(email);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!forgotOpen) setForgotEmail(email);
  }, [email, forgotOpen]);

  async function onForgotSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setForgotSubmitting(true);
    setForgotError(null);
    setForgotNotice(null);

    try {
      await requestKnackPasswordReset(forgotEmail);
      setForgotNotice(
        "If that email is on file, Knack will send password reset instructions shortly.",
      );
    } catch (err) {
      setForgotError(
        err instanceof Error
          ? err.message
          : "Unable to send a password reset email.",
      );
    } finally {
      setForgotSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="text-xs uppercase tracking-[0.22em] text-brick">
        Homeowner login
      </p>
      <h2 className="font-display mt-2 text-3xl text-forest-deep">
        Sign in to continue
      </h2>
      <div className="brick-rule mt-4" />
      <p className="mt-5 text-sm leading-relaxed text-forest-mid">
        Enter the email and password for your HOA portal account. Materials are
        shown only when your dues are paid in full.
      </p>

      {!forgotOpen ? (
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.16em] text-forest-mid">
              Email
            </span>
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              className="mt-2 w-full border border-forest/20 bg-white/70 px-3 py-2.5 text-sm text-forest-deep outline-none transition focus:border-brick"
            />
          </label>
          <label className="block">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.16em] text-forest-mid">
                Password
              </span>
              <button
                type="button"
                onClick={() => {
                  setForgotOpen(true);
                  setForgotError(null);
                  setForgotNotice(null);
                }}
                className="text-xs text-brick underline decoration-brick/35 underline-offset-2 hover:text-brick-deep"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              className="mt-2 w-full border border-forest/20 bg-white/70 px-3 py-2.5 text-sm text-forest-deep outline-none transition focus:border-brick"
            />
          </label>

          {error ? (
            <p className="border border-brick/30 bg-parchment/70 px-4 py-3 text-sm text-brick-deep">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-brick w-full disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={(event) => void onForgotSubmit(event)}
          className="mt-8 space-y-5"
        >
          <p className="text-sm leading-relaxed text-forest-mid">
            Enter your HOA account email and we&apos;ll send Knack&apos;s
            password reset link.
          </p>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.16em] text-forest-mid">
              Email
            </span>
            <input
              type="email"
              autoComplete="username"
              required
              value={forgotEmail}
              onChange={(event) => setForgotEmail(event.target.value)}
              className="mt-2 w-full border border-forest/20 bg-white/70 px-3 py-2.5 text-sm text-forest-deep outline-none transition focus:border-brick"
            />
          </label>

          {forgotError ? (
            <p className="border border-brick/30 bg-parchment/70 px-4 py-3 text-sm text-brick-deep">
              {forgotError}
            </p>
          ) : null}
          {forgotNotice && !forgotError ? (
            <p className="border border-forest/20 bg-white/60 px-4 py-3 text-sm text-forest-mid">
              {forgotNotice}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={forgotSubmitting}
            className="btn btn-brick w-full disabled:cursor-wait disabled:opacity-70"
          >
            {forgotSubmitting ? "Sending…" : "Send reset email"}
          </button>
          <button
            type="button"
            onClick={() => setForgotOpen(false)}
            className="btn btn-outline w-full"
          >
            Back to sign in
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-forest-mid">
        Need help with your account?{" "}
        <Link
          href="/contact/homeowner"
          className="text-brick underline decoration-brick/35 underline-offset-2 hover:text-brick-deep"
        >
          Contact the HOA
        </Link>
        .
      </p>
    </div>
  );
}

function GateMessage({
  title,
  body,
  email,
  onLogout,
  children,
}: {
  title: string;
  body: string;
  email?: string;
  onLogout: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <p className="text-xs uppercase tracking-[0.22em] text-brick">
        Access check
      </p>
      <h2 className="font-display mt-2 text-3xl text-forest-deep">{title}</h2>
      <div className="brick-rule mt-4" />
      <p className="mt-5 text-sm leading-relaxed text-forest-mid">{body}</p>
      {children}
      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-forest-mid">
        {email ? <span>Signed in as {email}</span> : null}
        <button
          type="button"
          onClick={onLogout}
          className="text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function MaterialsColumn({
  eyebrow,
  title,
  empty,
  items,
}: {
  eyebrow: string;
  title: string;
  empty: string;
  items: TownhallAgmItem[];
}) {
  return (
    <section>
      <p className="text-xs uppercase tracking-[0.22em] text-brick">{eyebrow}</p>
      <h3 className="font-display mt-2 text-2xl text-forest-deep">{title}</h3>
      <div className="brick-rule mt-3" />

      {items.length === 0 ? (
        <p className="mt-5 text-sm leading-relaxed text-forest-mid">{empty}</p>
      ) : (
        <div className="mt-5 divide-y divide-forest/15 border-y border-forest/15">
          {items.map((item) => (
            <MaterialItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function MaterialItem({ item }: { item: TownhallAgmItem }) {
  return (
    <article className="py-5 first:pt-4 last:pb-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {item.dateLabel ? (
          <time
            dateTime={item.dateISO}
            className="text-xs uppercase tracking-[0.18em] text-forest-mid"
          >
            {item.dateLabel}
          </time>
        ) : null}
        <span className="text-xs uppercase tracking-[0.18em] text-brick">
          {categoryLabel(item.category)}
        </span>
      </div>
      <h4 className="font-display mt-2 text-xl leading-snug text-forest-deep">
        {item.title}
      </h4>
      {item.message ? (
        <ExpandableText text={item.message} className="mt-3" />
      ) : null}
      {(item.link || item.file) && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {item.link ? (
            <a
              href={item.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep"
            >
              {item.link.label} →
            </a>
          ) : null}
          {item.file ? (
            <a
              href={item.file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep"
            >
              Download PDF →
            </a>
          ) : null}
        </div>
      )}
    </article>
  );
}

function readEmailFromValues(user: KnackSessionUser) {
  const values = user.values ?? {};
  const candidates = [values.field_20, values["field_20"], values.email];
  for (const value of candidates) {
    if (typeof value === "string" && value.includes("@")) return value;
    if (value && typeof value === "object") {
      const email = (value as { email?: string }).email;
      if (typeof email === "string" && email.includes("@")) return email;
    }
  }
  return undefined;
}
