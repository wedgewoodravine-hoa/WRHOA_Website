"use client";

import { type FormEvent, useId, useState } from "react";
import {
  FieldLabel,
  FormError,
  FormSuccess,
  fieldClassName,
} from "@/components/forms/FormFields";
import {
  submitVolunteerSignup,
  type VolunteerOpportunity,
} from "@/lib/knack-forms";

export function VolunteerSection({
  opportunities,
}: {
  opportunities: VolunteerOpportunity[];
}) {
  const formId = useId();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (selected.length === 0) {
        throw new Error("Please choose at least one volunteer opportunity.");
      }

      await submitVolunteerSignup({
        firstName,
        lastName,
        email,
        phone,
        note,
        opportunityIds: selected,
      });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your volunteer interest.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-14">
      {opportunities.length > 0 ? (
        <section>
          <h2 className="font-display text-3xl text-forest-deep">
            Current opportunities
          </h2>
          <div className="brick-rule mt-4" />
          <ul className="mt-8 divide-y divide-forest/12 border-y border-forest/12">
            {opportunities.map((opportunity) => (
              <li key={opportunity.id} className="py-6">
                <h3 className="font-display text-2xl text-forest-deep">
                  {opportunity.title}
                </h3>
                {opportunity.description ? (
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-forest-mid whitespace-pre-line">
                    {opportunity.description}
                  </p>
                ) : null}
                {opportunity.linkUrl ? (
                  <a
                    href={opportunity.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm text-brick transition hover:text-brick-deep"
                  >
                    {opportunity.linkLabel || "Learn more"} →
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="font-display text-3xl text-forest-deep">
          Volunteer interest form
        </h2>
        <div className="brick-rule mt-4" />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-mid">
          Tell us how you&apos;d like to help. Someone from the community league
          will follow up.
        </p>

        {done ? (
          <div className="mt-8">
            <FormSuccess body="Thank you. We received your volunteer interest." />
          </div>
        ) : (
          <form
            onSubmit={(event) => void onSubmit(event)}
            className="mt-8 mx-auto max-w-2xl space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <FieldLabel htmlFor={`${formId}-first`}>First name</FieldLabel>
                <input
                  id={`${formId}-first`}
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className={fieldClassName}
                  autoComplete="given-name"
                />
              </label>
              <label className="block">
                <FieldLabel htmlFor={`${formId}-last`}>Last name</FieldLabel>
                <input
                  id={`${formId}-last`}
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className={fieldClassName}
                  autoComplete="family-name"
                />
              </label>
            </div>

            <fieldset>
              <legend className="text-xs uppercase tracking-[0.16em] text-forest-mid">
                What volunteer opportunities are you interested in?
              </legend>
              <div className="mt-3 space-y-2">
                {opportunities.map((opportunity) => {
                  const checked = selected.includes(opportunity.id);
                  return (
                    <label
                      key={opportunity.id}
                      className="flex items-start gap-3 text-sm text-forest-deep"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelected((current) =>
                            checked
                              ? current.filter((id) => id !== opportunity.id)
                              : [...current, opportunity.id],
                          );
                        }}
                        className="mt-1"
                      />
                      <span>{opportunity.title}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <label className="block">
              <FieldLabel htmlFor={`${formId}-email`}>Email</FieldLabel>
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
              <FieldLabel htmlFor={`${formId}-note`}>Note</FieldLabel>
              <textarea
                id={`${formId}-note`}
                rows={5}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className={fieldClassName}
              />
            </label>

            <FormError message={error} />

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-brick disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
