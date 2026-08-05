import type { ReactNode } from "react";
import type { FormAddress } from "@/lib/knack-forms";

export const fieldClassName =
  "mt-2 w-full border border-forest/20 bg-white/70 px-3 py-2.5 text-sm text-forest-deep outline-none transition focus:border-brick";

export function FieldLabel({
  children,
  htmlFor,
  hint,
}: {
  children: ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <label
        htmlFor={htmlFor}
        className="text-xs uppercase tracking-[0.16em] text-forest-mid"
      >
        {children}
      </label>
      {hint ? <span className="text-xs text-forest-mid/80">{hint}</span> : null}
    </div>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p className="border border-brick/30 bg-parchment/70 px-4 py-3 text-sm text-brick-deep">
      {message}
    </p>
  );
}

export function FormSuccess({
  title = "Form successfully submitted.",
  body = "Thank you. The HOA has received your message.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="border border-forest/20 bg-white/60 px-5 py-6">
      <p className="text-xs uppercase tracking-[0.22em] text-brick">Sent</p>
      <h3 className="font-display mt-2 text-2xl text-forest-deep">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-forest-mid">{body}</p>
    </div>
  );
}

export function AddressFields({
  idPrefix,
  value,
  onChange,
  required,
}: {
  idPrefix: string;
  value: FormAddress;
  onChange: (next: FormAddress) => void;
  required?: boolean;
}) {
  function set<K extends keyof FormAddress>(key: K, next: FormAddress[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <FieldLabel htmlFor={`${idPrefix}-street`}>Street address</FieldLabel>
        <input
          id={`${idPrefix}-street`}
          required={required}
          value={value.street}
          onChange={(event) => set("street", event.target.value)}
          className={fieldClassName}
          autoComplete="street-address"
        />
      </label>
      <label className="block sm:col-span-2">
        <FieldLabel htmlFor={`${idPrefix}-street2`}>
          Address line 2
        </FieldLabel>
        <input
          id={`${idPrefix}-street2`}
          value={value.street2}
          onChange={(event) => set("street2", event.target.value)}
          className={fieldClassName}
          autoComplete="address-line2"
        />
      </label>
      <label className="block">
        <FieldLabel htmlFor={`${idPrefix}-city`}>City</FieldLabel>
        <input
          id={`${idPrefix}-city`}
          required={required}
          value={value.city}
          onChange={(event) => set("city", event.target.value)}
          className={fieldClassName}
          autoComplete="address-level2"
        />
      </label>
      <label className="block">
        <FieldLabel htmlFor={`${idPrefix}-state`}>Province</FieldLabel>
        <input
          id={`${idPrefix}-state`}
          required={required}
          value={value.state}
          onChange={(event) => set("state", event.target.value)}
          className={fieldClassName}
          autoComplete="address-level1"
        />
      </label>
      <label className="block">
        <FieldLabel htmlFor={`${idPrefix}-zip`}>Postal code</FieldLabel>
        <input
          id={`${idPrefix}-zip`}
          required={required}
          value={value.zip}
          onChange={(event) => set("zip", event.target.value)}
          className={fieldClassName}
          autoComplete="postal-code"
        />
      </label>
      <label className="block">
        <FieldLabel htmlFor={`${idPrefix}-country`}>Country</FieldLabel>
        <input
          id={`${idPrefix}-country`}
          required={required}
          value={value.country}
          onChange={(event) => set("country", event.target.value)}
          className={fieldClassName}
          autoComplete="country-name"
        />
      </label>
    </div>
  );
}
