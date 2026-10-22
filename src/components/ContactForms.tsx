"use client";

import {
  type FormEvent,
  useEffect,
  useId,
  useState,
} from "react";
import {
  AddressFields,
  FieldLabel,
  FormError,
  FormSuccess,
  fieldClassName,
} from "@/components/forms/FormFields";
import { HoaAuthPortal } from "@/components/HoaAuthPortal";
import {
  LEGAL_CONFIRMATION_OPTIONS,
  LEGAL_DOCUMENTATION_CATEGORY,
  LEGAL_REPRESENT_OPTIONS,
  SUPPORT_CATEGORIES,
  isCommunityLeagueCategory,
  isLegalDocumentationCategory,
} from "@/lib/contact-forms";
import {
  fetchContactPropertyOptions,
  fetchHomeownerContactProperties,
  searchContactProperties,
  submitHomeownerContact,
  submitNonHomeownerContact,
  type KnackConnectionOption,
} from "@/lib/knack-forms";
import {
  AuthExpiredError,
  clearSession,
  loadSession,
} from "@/lib/knack-session";

const CONTACT_PROFILES = ["profile_5"];

type PublicContactMode = "general" | "legal";

export function NonHomeownerContactSection({
  mode = "general",
}: {
  mode?: PublicContactMode;
}) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <FormSuccess body="Thank you. The HOA has received your inquiry and will follow up as needed." />
    );
  }

  return (
    <PublicContactForm
      mode={mode}
      onSuccess={() => setDone(true)}
    />
  );
}

type HomeownerContactOptions = {
  ownProperties: KnackConnectionOption[];
  communityProperties: KnackConnectionOption[];
};

async function loadHomeownerContactOptions(
  token: string,
): Promise<HomeownerContactOptions> {
  const ownProperties = await fetchHomeownerContactProperties(token);
  try {
    const communityProperties = await fetchContactPropertyOptions();
    return { ownProperties, communityProperties };
  } catch {
    return { ownProperties, communityProperties: [] };
  }
}

export function HomeownerContactSection() {
  return (
    <HoaAuthPortal
      requireGoodStanding={false}
      allowedProfiles={CONTACT_PROFILES}
      description="Sign in with your HOA portal account to send a message to the association."
      load={loadHomeownerContactOptions}
    >
      {(options) => (
        <HomeownerContactForm
          ownProperties={options.ownProperties}
          communityProperties={options.communityProperties}
        />
      )}
    </HoaAuthPortal>
  );
}

function PublicContactForm({
  mode,
  onSuccess,
}: {
  mode: PublicContactMode;
  onSuccess: () => void;
}) {
  const formId = useId();
  const [category, setCategory] = useState(
    mode === "legal" ? LEGAL_DOCUMENTATION_CATEGORY : "",
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [property, setProperty] = useState<KnackConnectionOption | null>(null);
  const [represent, setRepresent] = useState("");
  const [clientNameOnTitle, setClientNameOnTitle] = useState("");
  const [purchaserName, setPurchaserName] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [lawOfficeName, setLawOfficeName] = useState("");
  const [confirmations, setConfirmations] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showProperty = !isCommunityLeagueCategory(category);
  const showLegal = isLegalDocumentationCategory(category);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!category) {
        throw new Error("Please choose a support category.");
      }
      if (showProperty && !property) {
        throw new Error("Please select the property this inquiry is about.");
      }
      if (showLegal && confirmations.length === 0) {
        throw new Error("Please select at least one confirmation item.");
      }

      await submitNonHomeownerContact({
        category,
        firstName,
        lastName,
        email,
        phone,
        message,
        propertyId: showProperty ? property?.id : undefined,
        represent: showLegal ? represent : undefined,
        clientNameOnTitle: showLegal ? clientNameOnTitle : undefined,
        purchaserName: showLegal ? purchaserName : undefined,
        closingDate: showLegal ? closingDate : undefined,
        lawOfficeName: showLegal ? lawOfficeName : undefined,
        confirmations: showLegal ? confirmations : undefined,
      });
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to submit your message.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="mx-auto max-w-2xl space-y-5">
      <label className="block">
        <FieldLabel htmlFor={`${formId}-category`}>Support category</FieldLabel>
        <select
          id={`${formId}-category`}
          required
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={fieldClassName}
        >
          <option value="">Select…</option>
          {SUPPORT_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

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

      {showProperty ? (
        <PropertySearchField
          id={`${formId}-property`}
          label="Regarding which property?"
          value={property}
          onChange={setProperty}
          required
        />
      ) : null}

      {showLegal ? (
        <div className="space-y-5 border-t border-forest/12 pt-5">
          <p className="text-xs uppercase tracking-[0.22em] text-brick">
            Closing documentation
          </p>

          <label className="block">
            <FieldLabel htmlFor={`${formId}-represent`}>
              Who do you represent?
            </FieldLabel>
            <select
              id={`${formId}-represent`}
              required
              value={represent}
              onChange={(event) => setRepresent(event.target.value)}
              className={fieldClassName}
            >
              <option value="">Select…</option>
              {LEGAL_REPRESENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <FieldLabel htmlFor={`${formId}-client`}>
              Client name on title
            </FieldLabel>
            <input
              id={`${formId}-client`}
              required
              value={clientNameOnTitle}
              onChange={(event) => setClientNameOnTitle(event.target.value)}
              className={fieldClassName}
            />
          </label>

          <label className="block">
            <FieldLabel htmlFor={`${formId}-purchaser`}>
              Purchaser&apos;s name
            </FieldLabel>
            <input
              id={`${formId}-purchaser`}
              value={purchaserName}
              onChange={(event) => setPurchaserName(event.target.value)}
              className={fieldClassName}
            />
          </label>

          <label className="block">
            <FieldLabel htmlFor={`${formId}-closing`}>Closing date</FieldLabel>
            <input
              id={`${formId}-closing`}
              required
              value={closingDate}
              onChange={(event) => setClosingDate(event.target.value)}
              className={fieldClassName}
              placeholder="e.g. 09/15/2026"
            />
          </label>

          <label className="block">
            <FieldLabel htmlFor={`${formId}-office`}>
              Name of law office or requestor
            </FieldLabel>
            <input
              id={`${formId}-office`}
              required
              value={lawOfficeName}
              onChange={(event) => setLawOfficeName(event.target.value)}
              className={fieldClassName}
            />
          </label>

          <fieldset>
            <legend className="text-xs uppercase tracking-[0.16em] text-forest-mid">
              What do you need confirmation of?
            </legend>
            <div className="mt-3 space-y-2">
              {LEGAL_CONFIRMATION_OPTIONS.map((option) => {
                const checked = confirmations.includes(option);
                return (
                  <label
                    key={option}
                    className="flex items-start gap-3 text-sm text-forest-deep"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setConfirmations((current) =>
                          checked
                            ? current.filter((item) => item !== option)
                            : [...current, option],
                        );
                      }}
                      className="mt-1"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      ) : null}

      <label className="block">
        <FieldLabel htmlFor={`${formId}-message`}>Message</FieldLabel>
        <textarea
          id={`${formId}-message`}
          required
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
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
  );
}

function HomeownerContactForm({
  ownProperties,
  communityProperties,
}: {
  ownProperties: KnackConnectionOption[];
  communityProperties: KnackConnectionOption[];
}) {
  const formId = useId();
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const showContactDetails = isCommunityLeagueCategory(category);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const session = loadSession();
      if (!session?.token) {
        throw new AuthExpiredError();
      }

      await submitHomeownerContact(session.token, {
        category,
        message,
        propertyId: propertyId || undefined,
        email: showContactDetails ? email : undefined,
        phone: showContactDetails ? phone : undefined,
      });
      setDone(true);
    } catch (err) {
      if (err instanceof AuthExpiredError) {
        clearSession();
        setError("Your session has expired. Please sign in again.");
        return;
      }
      setError(
        err instanceof Error ? err.message : "Unable to submit your message.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <FormSuccess body="Thank you. The HOA has received your message." />
    );
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="mx-auto max-w-2xl space-y-5">
      <label className="block">
        <FieldLabel htmlFor={`${formId}-category`}>Support category</FieldLabel>
        <select
          id={`${formId}-category`}
          required
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={fieldClassName}
        >
          <option value="">Select…</option>
          {SUPPORT_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      {showContactDetails ? (
        <>
          <label className="block">
            <FieldLabel
              htmlFor={`${formId}-email`}
              hint="For Community League follow-up"
            >
              Email
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
            <p className="mt-2 text-xs leading-relaxed text-forest-mid">
              Please enter an email address that the Wedgewood Ravine Community
              League can reach you at.
            </p>
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
        </>
      ) : null}

      <label className="block">
        <FieldLabel htmlFor={`${formId}-message`}>Message</FieldLabel>
        <textarea
          id={`${formId}-message`}
          required
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={fieldClassName}
        />
      </label>

      <PropertySelectField
        id={`${formId}-property`}
        ownProperties={ownProperties}
        communityProperties={communityProperties}
        value={propertyId}
        onChange={setPropertyId}
      />

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

function PropertySelectField({
  id,
  ownProperties,
  communityProperties,
  value,
  onChange,
}: {
  id: string;
  ownProperties: KnackConnectionOption[];
  communityProperties: KnackConnectionOption[];
  value: string;
  onChange: (propertyId: string) => void;
}) {
  const ownIds = new Set(ownProperties.map((property) => property.id));
  const otherProperties = communityProperties.filter(
    (property) => !ownIds.has(property.id),
  );
  const hasCommunityList = communityProperties.length > 0;

  return (
    <label className="block">
      <FieldLabel htmlFor={id} hint="Any Wedgewood address">
        Property in question
      </FieldLabel>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClassName}
      >
        <option value="">Select a property…</option>
        {ownProperties.length > 0 ? (
          <optgroup label="Your properties">
            {ownProperties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.label}
              </option>
            ))}
          </optgroup>
        ) : null}
        {otherProperties.length > 0 ? (
          <optgroup label="Neighboring properties">
            {otherProperties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.label}
              </option>
            ))}
          </optgroup>
        ) : null}
      </select>
      {hasCommunityList ? null : (
        <p className="mt-2 text-xs text-brick-deep">
          Other Wedgewood addresses could not be loaded. Refresh the page to
          try again.
        </p>
      )}
    </label>
  );
}

function PropertySearchField({
  id,
  label,
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  value: KnackConnectionOption | null;
  onChange: (next: KnackConnectionOption | null) => void;
  required?: boolean;
}) {
  const [query, setQuery] = useState(value?.label || "");
  const [options, setOptions] = useState<KnackConnectionOption[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (value?.label && value.label !== query) {
      setQuery(value.label);
    }
    // Keep selected label in sync when parent resets value.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to value changes
  }, [value?.id, value?.label]);

  useEffect(() => {
    if (value && query === value.label) {
      setOptions([]);
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setOptions([]);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        setSearching(true);
        setSearchError(null);
        try {
          const results = await searchContactProperties(trimmed);
          if (!cancelled) setOptions(results);
        } catch (err) {
          if (!cancelled) {
            setOptions([]);
            setSearchError(
              err instanceof Error
                ? err.message
                : "Unable to search properties.",
            );
          }
        } finally {
          if (!cancelled) setSearching(false);
        }
      })();
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, value]);

  return (
    <div className="relative block">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        required={required && !value}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          onChange(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        className={fieldClassName}
        placeholder="Start typing a street address…"
        autoComplete="off"
        role="combobox"
        aria-expanded={open && options.length > 0}
        aria-controls={`${id}-options`}
        aria-autocomplete="list"
      />
      {value ? (
        <p className="mt-2 text-xs text-forest-mid">
          Selected: {value.label}
        </p>
      ) : searching ? (
        <p className="mt-2 text-xs text-forest-mid">Searching…</p>
      ) : searchError ? (
        <p className="mt-2 text-xs text-brick-deep">{searchError}</p>
      ) : null}

      {open && options.length > 0 ? (
        <ul
          id={`${id}-options`}
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto border border-forest/20 bg-white shadow-sm"
        >
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                className="w-full px-3 py-2.5 text-left text-sm text-forest-deep transition hover:bg-parchment/80"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option);
                  setQuery(option.label);
                  setOpen(false);
                  setOptions([]);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
