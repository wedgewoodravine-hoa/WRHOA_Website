"use client";

import { type FormEvent, useEffect, useState } from "react";
import {
  AuthExpiredError,
  clearSession,
  loadSession,
  saveSession,
  updateHomeownerAccount,
  updateHomeownerCredentials,
  type HomeownerAccount,
  type HomeownerAddress,
} from "@/lib/knack-session";

type Props = {
  account: HomeownerAccount;
  onAccountChange: (account: HomeownerAccount) => void;
  /** Shown under the section title. Defaults to a pay-dues reminder. */
  description?: string;
};

export function AccountInformationSection({
  account,
  onAccountChange,
  description = "Please confirm your contact details are current before paying dues.",
}: Props) {
  const [editing, setEditing] = useState(false);
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [draft, setDraft] = useState(account);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(() => {
    if (!editing) setDraft(account);
  }, [account, editing]);

  async function onSaveDetails(event: FormEvent) {
    event.preventDefault();
    const session = loadSession();
    if (!session?.token) {
      clearSession();
      setError("Your session has expired. Please sign in again.");
      return;
    }

    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const saved = await updateHomeownerAccount(
        session.token,
        account.id,
        draft,
      );
      onAccountChange(saved);
      if (saved.email && saved.email !== session.email) {
        saveSession({ ...session, email: saved.email });
      }
      setEditing(false);
      setNotice("Account information updated.");
    } catch (err) {
      if (err instanceof AuthExpiredError) {
        clearSession();
        setError(err.message);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update account information.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function onSaveCredentials(event: FormEvent) {
    event.preventDefault();
    if (password && password !== passwordConfirm) {
      setError("Password confirmation does not match.");
      return;
    }

    const session = loadSession();
    if (!session?.token) {
      clearSession();
      setError("Your session has expired. Please sign in again.");
      return;
    }

    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      await updateHomeownerCredentials(session.token, account.id, {
        email: draft.email,
        password: password || undefined,
      });
      const next = { ...account, email: draft.email.trim() };
      onAccountChange(next);
      saveSession({ ...session, email: next.email });
      setPassword("");
      setPasswordConfirm("");
      setCredentialsOpen(false);
      setNotice(password ? "Email and password updated." : "Email updated.");
    } catch (err) {
      if (err instanceof AuthExpiredError) {
        clearSession();
        setError(err.message);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update login details.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  const fullName = [account.firstName, account.lastName]
    .filter(Boolean)
    .join(" ");
  const secondName = [account.secondOwnerFirstName, account.secondOwnerLastName]
    .filter(Boolean)
    .join(" ");
  const mailingLabel = account.mailingSameAsProperty
    ? "Same as property address"
    : formatAddressDisplay(account.mailingAddress) || "Not provided";

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-display text-3xl text-forest-deep">
            Update account information
          </h3>
          <div className="brick-rule mt-4" />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-mid">
            {description}
          </p>
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setNotice(null);
              setError(null);
            }}
            className="btn btn-outline shrink-0"
          >
            Edit details
          </button>
        ) : null}
      </div>

      {!editing ? (
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoItem label="Property" value={account.propertyLabel} />
          <InfoItem label="Name" value={fullName || undefined} />
          <InfoItem label="Phone" value={account.phone || undefined} />
          <InfoItem label="Email" value={account.email || undefined} />
          <InfoItem label="Mailing address" value={mailingLabel} />
          <InfoItem
            label="Second owner"
            value={
              secondName
                ? `${secondName}${account.secondOwnerPhone ? ` · ${account.secondOwnerPhone}` : ""}`
                : "None listed"
            }
          />
          <InfoItem
            label="Email updates"
            value={
              account.communicationAgreement
                ? "Agreed to receive HOA email correspondence"
                : "Not opted in"
            }
          />
        </dl>
      ) : (
        <form
          onSubmit={(event) => void onSaveDetails(event)}
          className="mt-6 space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="First name"
              value={draft.firstName}
              onChange={(value) => setDraft({ ...draft, firstName: value })}
              required
            />
            <Field
              label="Last name"
              value={draft.lastName}
              onChange={(value) => setDraft({ ...draft, lastName: value })}
              required
            />
            <Field
              label="Phone"
              value={draft.phone}
              onChange={(value) => setDraft({ ...draft, phone: value })}
            />
            <Field
              label="Email"
              type="email"
              value={draft.email}
              onChange={(value) => setDraft({ ...draft, email: value })}
              required
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-forest-deep">
            <input
              type="checkbox"
              checked={draft.mailingSameAsProperty}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  mailingSameAsProperty: event.target.checked,
                })
              }
              className="mt-1"
            />
            <span>Mailing address is the same as my property address</span>
          </label>

          {!draft.mailingSameAsProperty ? (
            <AddressFields
              value={draft.mailingAddress}
              onChange={(mailingAddress) =>
                setDraft({ ...draft, mailingAddress })
              }
            />
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Second owner first name"
              value={draft.secondOwnerFirstName}
              onChange={(value) =>
                setDraft({ ...draft, secondOwnerFirstName: value })
              }
            />
            <Field
              label="Second owner last name"
              value={draft.secondOwnerLastName}
              onChange={(value) =>
                setDraft({ ...draft, secondOwnerLastName: value })
              }
            />
            <Field
              label="Second owner phone"
              value={draft.secondOwnerPhone}
              onChange={(value) =>
                setDraft({ ...draft, secondOwnerPhone: value })
              }
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-forest-deep">
            <input
              type="checkbox"
              checked={draft.communicationAgreement}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  communicationAgreement: event.target.checked,
                })
              }
              className="mt-1"
            />
            <span>
              I agree to receive email correspondence for dues notifications,
              newsletters, and related HOA updates.
            </span>
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-brick disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save details"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setEditing(false);
                setDraft(account);
                setError(null);
              }}
              className="btn btn-outline disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 border-t border-forest/12 pt-6">
        <button
          type="button"
          onClick={() => {
            setCredentialsOpen((open) => !open);
            setError(null);
            setNotice(null);
            setDraft((current) => ({ ...current, email: account.email }));
          }}
          className="text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep"
        >
          {credentialsOpen ? "Hide login settings" : "Update email / password"}
        </button>

        {credentialsOpen ? (
          <form
            onSubmit={(event) => void onSaveCredentials(event)}
            className="mt-5 grid max-w-xl gap-4"
          >
            <Field
              label="Login email"
              type="email"
              value={draft.email}
              onChange={(value) => setDraft({ ...draft, email: value })}
              required
            />
            <Field
              label="New password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
            />
            <Field
              label="Confirm new password"
              type="password"
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              autoComplete="new-password"
            />
            <p className="text-sm text-forest-mid">
              Leave the password fields blank to change only your email.
            </p>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-brick justify-self-start disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save login details"}
            </button>
          </form>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 text-sm text-brick-deep" role="alert">
          {error}
        </p>
      ) : null}
      {notice && !error ? (
        <p className="mt-4 text-sm text-forest-mid" role="status">
          {notice}
        </p>
      ) : null}
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.16em] text-forest-mid">
        {label}
      </dt>
      <dd className="mt-1 text-base text-forest-deep">{value || "—"}</dd>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.16em] text-forest-mid">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border border-forest/20 bg-white/70 px-3 py-2.5 text-sm text-forest-deep outline-none transition focus:border-brick"
      />
    </label>
  );
}

function AddressFields({
  value,
  onChange,
}: {
  value: HomeownerAddress;
  onChange: (value: HomeownerAddress) => void;
}) {
  function set<K extends keyof HomeownerAddress>(key: K, next: string) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field
          label="Street address"
          value={value.street}
          onChange={(street) => set("street", street)}
        />
      </div>
      <div className="sm:col-span-2">
        <Field
          label="Address line 2"
          value={value.street2}
          onChange={(street2) => set("street2", street2)}
        />
      </div>
      <Field
        label="City"
        value={value.city}
        onChange={(city) => set("city", city)}
      />
      <Field
        label="Province"
        value={value.state}
        onChange={(state) => set("state", state)}
      />
      <Field
        label="Postal code"
        value={value.zip}
        onChange={(zip) => set("zip", zip)}
      />
      <Field
        label="Country"
        value={value.country}
        onChange={(country) => set("country", country)}
      />
    </div>
  );
}

function formatAddressDisplay(address: HomeownerAddress) {
  return [
    address.street,
    address.street2,
    [address.city, address.state].filter(Boolean).join(", "),
    address.zip,
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}
