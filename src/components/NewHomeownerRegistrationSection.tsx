"use client";

import { type FormEvent, useId, useState } from "react";
import {
  AddressFields,
  FieldLabel,
  FormError,
  FormSuccess,
  fieldClassName,
} from "@/components/forms/FormFields";
import {
  emptyAddress,
  submitNewHomeownerRegistration,
  type FormAddress,
} from "@/lib/knack-forms";

export function NewHomeownerRegistrationSection() {
  const formId = useId();
  const [owner1First, setOwner1First] = useState("");
  const [owner1Last, setOwner1Last] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [owner2First, setOwner2First] = useState("");
  const [owner2Last, setOwner2Last] = useState("");
  const [owner2Phone, setOwner2Phone] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [propertyAddress, setPropertyAddress] = useState<FormAddress>(
    emptyAddress,
  );
  const [mailingSameAsProperty, setMailingSameAsProperty] = useState(true);
  const [mailingAddress, setMailingAddress] =
    useState<FormAddress>(emptyAddress);
  const [emailConsent, setEmailConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await submitNewHomeownerRegistration({
        owner1First,
        owner1Last,
        phone,
        email,
        temporaryPassword,
        owner2First,
        owner2Last,
        owner2Phone,
        closingDate,
        propertyAddress,
        mailingSameAsProperty,
        mailingAddress,
        emailConsent,
      });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your registration.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <FormSuccess
        title="Registration submitted"
        body="Thank you. The HOA has received your registration and will follow up with your welcome package."
      />
    );
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="mx-auto max-w-2xl space-y-8"
    >
      <section className="space-y-5">
        <div>
          <h2 className="font-display text-2xl text-forest-deep">
            Primary owner
          </h2>
          <div className="brick-rule mt-3" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <FieldLabel htmlFor={`${formId}-o1-first`}>
              First name (Owner 1)
            </FieldLabel>
            <input
              id={`${formId}-o1-first`}
              required
              value={owner1First}
              onChange={(event) => setOwner1First(event.target.value)}
              className={fieldClassName}
              autoComplete="given-name"
            />
          </label>
          <label className="block">
            <FieldLabel htmlFor={`${formId}-o1-last`}>
              Last name (Owner 1)
            </FieldLabel>
            <input
              id={`${formId}-o1-last`}
              required
              value={owner1Last}
              onChange={(event) => setOwner1Last(event.target.value)}
              className={fieldClassName}
              autoComplete="family-name"
            />
          </label>
        </div>

        <label className="block">
          <FieldLabel htmlFor={`${formId}-phone`}>Phone</FieldLabel>
          <input
            id={`${formId}-phone`}
            type="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={fieldClassName}
            autoComplete="tel"
          />
        </label>

        <label className="block">
          <FieldLabel htmlFor={`${formId}-email`}>
            Email address (primary contact)
          </FieldLabel>
          <input
            id={`${formId}-email`}
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClassName}
            autoComplete="email"
          />
        </label>

        <label className="block">
          <FieldLabel htmlFor={`${formId}-password`}>
            Temporary password
          </FieldLabel>
          <input
            id={`${formId}-password`}
            type="text"
            required
            value={temporaryPassword}
            onChange={(event) => setTemporaryPassword(event.target.value)}
            className={fieldClassName}
            autoComplete="new-password"
          />
        </label>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-display text-2xl text-forest-deep">
            Second owner (optional)
          </h2>
          <div className="brick-rule mt-3" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <FieldLabel htmlFor={`${formId}-o2-first`}>
              First name (Owner 2)
            </FieldLabel>
            <input
              id={`${formId}-o2-first`}
              value={owner2First}
              onChange={(event) => setOwner2First(event.target.value)}
              className={fieldClassName}
            />
          </label>
          <label className="block">
            <FieldLabel htmlFor={`${formId}-o2-last`}>
              Last name (Owner 2)
            </FieldLabel>
            <input
              id={`${formId}-o2-last`}
              value={owner2Last}
              onChange={(event) => setOwner2Last(event.target.value)}
              className={fieldClassName}
            />
          </label>
        </div>

        <label className="block">
          <FieldLabel htmlFor={`${formId}-o2-phone`}>
            Phone number (Owner 2)
          </FieldLabel>
          <input
            id={`${formId}-o2-phone`}
            type="tel"
            value={owner2Phone}
            onChange={(event) => setOwner2Phone(event.target.value)}
            className={fieldClassName}
          />
        </label>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-display text-2xl text-forest-deep">Property</h2>
          <div className="brick-rule mt-3" />
        </div>

        <label className="block">
          <FieldLabel htmlFor={`${formId}-closing`}>
            Property closing date
          </FieldLabel>
          <input
            id={`${formId}-closing`}
            type="date"
            required
            value={closingDate}
            onChange={(event) => setClosingDate(event.target.value)}
            className={fieldClassName}
          />
        </label>

        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-forest-mid">
            Wedgewood address
          </p>
          <div className="mt-3">
            <AddressFields
              idPrefix={`${formId}-property`}
              value={propertyAddress}
              onChange={setPropertyAddress}
              required
            />
          </div>
        </div>

        <label className="block">
          <FieldLabel htmlFor={`${formId}-mailing-same`}>
            Is this your mailing address?
          </FieldLabel>
          <select
            id={`${formId}-mailing-same`}
            value={mailingSameAsProperty ? "yes" : "no"}
            onChange={(event) =>
              setMailingSameAsProperty(event.target.value === "yes")
            }
            className={fieldClassName}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        {!mailingSameAsProperty ? (
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-forest-mid">
              Alternate mailing address
            </p>
            <div className="mt-3">
              <AddressFields
                idPrefix={`${formId}-mailing`}
                value={mailingAddress}
                onChange={setMailingAddress}
                required
              />
            </div>
          </div>
        ) : null}
      </section>

      <section className="space-y-4 border-t border-forest/12 pt-6">
        <h2 className="font-display text-2xl text-forest-deep">
          Stay informed by email
        </h2>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-forest-deep">
          <input
            type="checkbox"
            checked={emailConsent}
            onChange={(event) => setEmailConsent(event.target.checked)}
            className="mt-1"
          />
          <span>
            I agree to receive electronic correspondence from the Wedgewood
            Ravine HOA for such purposes, but not limited to, dues
            notifications, newsletters, community updates, and other relevant
            homeowner communications.
          </span>
        </label>
      </section>

      <FormError message={error} />

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-brick disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
