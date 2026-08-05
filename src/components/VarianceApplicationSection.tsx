"use client";

import {
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  FieldLabel,
  FormError,
  fieldClassName,
} from "@/components/forms/FormFields";
import {
  SignaturePad,
  type SignaturePadHandle,
} from "@/components/forms/SignaturePad";
import { HoaAuthPortal } from "@/components/HoaAuthPortal";
import {
  AuthExpiredError,
  KNACK_APP_ID,
  clearSession,
  loadSession,
  syncKnackRuntimeSession,
} from "@/lib/knack-session";
import {
  fetchVarianceApplicationContext,
  submitVarianceApplication,
  type VarianceApplicationContext,
  type VarianceApplicationResult,
} from "@/lib/knack-forms";

const VARIANCE_PROFILES = ["profile_5"];

function todayInputValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function VarianceApplicationSection() {
  return (
    <HoaAuthPortal
      requireGoodStanding={false}
      allowedProfiles={VARIANCE_PROFILES}
      description="Sign in with your HOA portal account to submit a Design Guidelines variance application."
      load={fetchVarianceApplicationContext}
    >
      {(data) => <VarianceApplicationWizard context={data} />}
    </HoaAuthPortal>
  );
}

function VarianceApplicationWizard({
  context,
}: {
  context: VarianceApplicationContext;
}) {
  const [result, setResult] = useState<VarianceApplicationResult | null>(null);

  if (result) {
    return <VariancePaymentStep result={result} />;
  }

  return (
    <VarianceApplicationForm
      context={context}
      onSubmitted={setResult}
    />
  );
}

function VarianceApplicationForm({
  context,
  onSubmitted,
}: {
  context: VarianceApplicationContext;
  onSubmitted: (result: VarianceApplicationResult) => void;
}) {
  const formId = useId();
  const signature1Ref = useRef<SignaturePadHandle>(null);
  const signature2Ref = useRef<SignaturePadHandle>(null);

  const [propertyId, setPropertyId] = useState(
    context.properties[0]?.id || "",
  );
  const [preferredEmail, setPreferredEmail] = useState(
    context.preferredEmail,
  );
  const [homeowner1, setHomeowner1] = useState(context.homeowner1);
  const [homeowner2, setHomeowner2] = useState(context.homeowner2);
  const [existingRoof, setExistingRoof] = useState("");
  const [proposedRoof, setProposedRoof] = useState("");
  const [roofMakeModel, setRoofMakeModel] = useState("");
  const [otherMaterial, setOtherMaterial] = useState("");
  const [existingOther, setExistingOther] = useState("");
  const [proposedOther, setProposedOther] = useState("");
  const [otherMakeModel, setOtherMakeModel] = useState("");
  const [date1, setDate1] = useState(todayInputValue);
  const [date2, setDate2] = useState(todayInputValue);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const session = loadSession();
      if (!session?.token) throw new AuthExpiredError();

      if (!propertyId) {
        throw new Error("Please select the property for this application.");
      }

      const hasRoof = Boolean(
        existingRoof.trim() || proposedRoof.trim() || roofMakeModel.trim(),
      );
      const hasOther = Boolean(
        otherMaterial.trim() ||
          existingOther.trim() ||
          proposedOther.trim() ||
          otherMakeModel.trim(),
      );
      if (!hasRoof && !hasOther) {
        throw new Error(
          "Please complete at least the roof or other building material section.",
        );
      }

      if (signature1Ref.current?.isEmpty()) {
        throw new Error("Registered homeowner 1 must sign the application.");
      }

      const signature1 = await signature1Ref.current?.toBlob();
      if (!signature1) {
        throw new Error("Unable to capture homeowner 1 signature.");
      }

      let signature2: Blob | null = null;
      if (homeowner2.trim()) {
        if (signature2Ref.current?.isEmpty()) {
          throw new Error(
            "Registered homeowner 2 must sign when a second owner is listed.",
          );
        }
        signature2 = (await signature2Ref.current?.toBlob()) || null;
      }

      const result = await submitVarianceApplication(session.token, {
        propertyId,
        preferredEmail,
        homeowner1,
        homeowner2,
        existingRoof,
        proposedRoof,
        roofMakeModel,
        otherMaterial,
        existingOther,
        proposedOther,
        otherMakeModel,
        signature1,
        signature2,
        date1,
        date2: homeowner2.trim() ? date2 : undefined,
      });

      await syncKnackRuntimeSession(session);
      onSubmitted(result);
    } catch (err) {
      if (err instanceof AuthExpiredError) {
        clearSession();
        setError("Your session has expired. Please sign in again.");
        return;
      }
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit the variance application.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="mx-auto max-w-2xl space-y-10"
    >
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-brick">
          Design guidelines
        </p>
        <h2 className="font-display mt-2 text-3xl text-forest-deep">
          Application for substitution to Design Guideline specifications
        </h2>
        <div className="brick-rule mt-4" />
        <p className="mt-4 text-sm leading-relaxed text-forest-mid">
          Application fee is $100.00 + $5.00 GST ($105.00). After you submit,
          you&apos;ll continue to secure PayPal checkout, then drop off material
          samples at 783 Wells Wynd.
        </p>
      </header>

      <section className="space-y-5">
        <label className="block">
          <FieldLabel htmlFor={`${formId}-property`}>Property</FieldLabel>
          <select
            id={`${formId}-property`}
            required
            value={propertyId}
            onChange={(event) => setPropertyId(event.target.value)}
            className={fieldClassName}
          >
            {context.properties.length === 0 ? (
              <option value="">No linked properties found</option>
            ) : (
              context.properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.label}
                </option>
              ))
            )}
          </select>
        </label>

        <label className="block">
          <FieldLabel htmlFor={`${formId}-email`}>
            Preferred email address
          </FieldLabel>
          <input
            id={`${formId}-email`}
            type="email"
            required
            value={preferredEmail}
            onChange={(event) => setPreferredEmail(event.target.value)}
            className={fieldClassName}
            autoComplete="email"
          />
        </label>

        <label className="block">
          <FieldLabel htmlFor={`${formId}-owner1`}>
            Registered homeowner 1
          </FieldLabel>
          <input
            id={`${formId}-owner1`}
            required
            value={homeowner1}
            onChange={(event) => setHomeowner1(event.target.value)}
            className={fieldClassName}
          />
        </label>

        <label className="block">
          <FieldLabel htmlFor={`${formId}-owner2`}>
            Registered homeowner 2
          </FieldLabel>
          <input
            id={`${formId}-owner2`}
            value={homeowner2}
            onChange={(event) => setHomeowner2(event.target.value)}
            className={fieldClassName}
          />
        </label>
      </section>

      <section className="space-y-5">
        <div>
          <h3 className="font-display text-2xl text-forest-deep">
            Building material: Roof
          </h3>
          <div className="brick-rule mt-3" />
        </div>
        <label className="block">
          <FieldLabel htmlFor={`${formId}-existing-roof`}>
            Existing roof material / colour
          </FieldLabel>
          <input
            id={`${formId}-existing-roof`}
            value={existingRoof}
            onChange={(event) => setExistingRoof(event.target.value)}
            className={fieldClassName}
          />
        </label>
        <label className="block">
          <FieldLabel htmlFor={`${formId}-proposed-roof`}>
            Proposed roof material / colour
          </FieldLabel>
          <input
            id={`${formId}-proposed-roof`}
            value={proposedRoof}
            onChange={(event) => setProposedRoof(event.target.value)}
            className={fieldClassName}
          />
          <p className="mt-2 text-xs leading-relaxed text-forest-mid">
            A maximum of two (2) alternative materials may be included on one
            application.
          </p>
        </label>
        <label className="block">
          <FieldLabel htmlFor={`${formId}-roof-make`}>
            Make / model (sample required, photographs not accepted)
          </FieldLabel>
          <input
            id={`${formId}-roof-make`}
            value={roofMakeModel}
            onChange={(event) => setRoofMakeModel(event.target.value)}
            className={fieldClassName}
          />
          <p className="mt-2 text-xs leading-relaxed text-forest-mid">
            You must provide a sample piece of the actual building material
            being considered. Oversize samples may be dropped off at 783 Wells
            Wynd.
          </p>
        </label>
      </section>

      <section className="space-y-5">
        <div>
          <h3 className="font-display text-2xl text-forest-deep">
            Building material: Other
          </h3>
          <div className="brick-rule mt-3" />
        </div>
        <label className="block">
          <FieldLabel htmlFor={`${formId}-other-specify`}>
            Building material – other (specify)
          </FieldLabel>
          <input
            id={`${formId}-other-specify`}
            value={otherMaterial}
            onChange={(event) => setOtherMaterial(event.target.value)}
            className={fieldClassName}
          />
        </label>
        <label className="block">
          <FieldLabel htmlFor={`${formId}-existing-other`}>
            Existing detail or material / colour
          </FieldLabel>
          <input
            id={`${formId}-existing-other`}
            value={existingOther}
            onChange={(event) => setExistingOther(event.target.value)}
            className={fieldClassName}
          />
        </label>
        <label className="block">
          <FieldLabel htmlFor={`${formId}-proposed-other`}>
            Proposed detail or material / colour
          </FieldLabel>
          <input
            id={`${formId}-proposed-other`}
            value={proposedOther}
            onChange={(event) => setProposedOther(event.target.value)}
            className={fieldClassName}
          />
          <p className="mt-2 text-xs leading-relaxed text-forest-mid">
            A maximum of two (2) alternative materials may be included on one
            application.
          </p>
        </label>
        <label className="block">
          <FieldLabel htmlFor={`${formId}-other-make`}>
            Make / model (sample required, no photographs)
          </FieldLabel>
          <input
            id={`${formId}-other-make`}
            value={otherMakeModel}
            onChange={(event) => setOtherMakeModel(event.target.value)}
            className={fieldClassName}
          />
          <p className="mt-2 text-xs leading-relaxed text-forest-mid">
            You must provide a sample piece of the actual building material
            being considered. Oversize samples may be dropped off at 783 Wells
            Wynd.
          </p>
        </label>
      </section>

      <section className="space-y-5">
        <div>
          <h3 className="font-display text-2xl text-forest-deep">
            Applicant acknowledgement
          </h3>
          <div className="brick-rule mt-3" />
          <p className="mt-3 text-sm leading-relaxed text-forest-mid">
            Signed by all registered owners.
          </p>
        </div>

        <SignaturePad
          ref={signature1Ref}
          label="Applicant signature (registered homeowner 1)"
          required
        />
        <label className="block">
          <FieldLabel htmlFor={`${formId}-date1`}>Date</FieldLabel>
          <input
            id={`${formId}-date1`}
            type="date"
            required
            value={date1}
            onChange={(event) => setDate1(event.target.value)}
            className={fieldClassName}
          />
        </label>

        {homeowner2.trim() ? (
          <>
            <SignaturePad
              ref={signature2Ref}
              label="Applicant signature (registered homeowner 2)"
              required
            />
            <label className="block">
              <FieldLabel htmlFor={`${formId}-date2`}>Date</FieldLabel>
              <input
                id={`${formId}-date2`}
                type="date"
                required
                value={date2}
                onChange={(event) => setDate2(event.target.value)}
                className={fieldClassName}
              />
            </label>
          </>
        ) : null}
      </section>

      <FormError message={error} />

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-brick disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? "Submitting…" : "Continue to payment"}
      </button>
    </form>
  );
}

function VariancePaymentStep({
  result,
}: {
  result: VarianceApplicationResult;
}) {
  const mountId = useId().replace(/:/g, "");
  const loadedKey = useRef<string | null>(null);

  useEffect(() => {
    const key = `${KNACK_APP_ID}-${result.paymentDistributionKey}`;
    window.app_id = KNACK_APP_ID;
    window.distribution_key = result.paymentDistributionKey;
    window.location.hash = result.paymentUrl;

    if (loadedKey.current === key) return;
    loadedKey.current = key;

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-knack-pay="${key}"]`,
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = `https://loader.knack.com/${KNACK_APP_ID}/${result.paymentDistributionKey}/knack.js`;
    script.async = true;
    script.dataset.knackPay = key;
    document.body.appendChild(script);
  }, [result.paymentDistributionKey, result.paymentUrl]);

  useEffect(() => {
    document
      .getElementById(`variance-checkout-${mountId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [mountId]);

  return (
    <div className="space-y-12" id={`variance-checkout-${mountId}`}>
      <section>
        <p className="text-xs uppercase tracking-[0.22em] text-brick">
          Application received
        </p>
        <h2 className="font-display mt-2 text-3xl text-forest-deep">
          Variance application #{result.applicationNumber}
        </h2>
        <div className="brick-rule mt-4" />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-mid">
          {result.feeLabel}. Complete payment below to finish the online portion
          of your application.
        </p>
      </section>

      <section>
        <h3 className="font-display text-2xl text-forest-deep">
          One last step after payment
        </h3>
        <div className="brick-rule mt-3" />
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-forest-mid">
          <li>
            Attach variance application number{" "}
            <span className="font-medium text-forest-deep">
              #{result.applicationNumber}
            </span>{" "}
            to your building material sample.
          </li>
          <li>Drop your samples off at 783 Wells Wynd.</li>
        </ol>
      </section>

      <section>
        <p className="text-xs uppercase tracking-[0.22em] text-brick">
          Secure checkout
        </p>
        <h3 className="font-display mt-2 text-3xl text-forest-deep">
          Submit application fee
        </h3>
        <div className="brick-rule mt-4" />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-mid">
          Complete payment in the checkout below. If prompted, sign in with the
          same HOA email and password. You do not need a PayPal account.
        </p>
        <div className="knack-shell mt-6 p-2 sm:p-4">
          <div
            id={`knack-${result.paymentDistributionKey}`}
            className="min-h-[720px]"
          >
            Loading secure checkout…
          </div>
        </div>
      </section>
    </div>
  );
}
