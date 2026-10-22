"use client";

import {
  memo,
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
  releaseEmbeddedKnackRuntime,
  syncKnackRuntimeSession,
} from "@/lib/knack-session";
import {
  fetchVarianceApplicationContext,
  fetchVarianceApplicationStatus,
  submitVarianceApplication,
  type VarianceApplicationContext,
  type VarianceApplicationResult,
  type VariancePaymentStatus,
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

  useEffect(() => {
    // Sign-in probes the Town Hall & AGM embed. Remove it before this form
    // so that app cannot take over the payment step.
    releaseEmbeddedKnackRuntime();
  }, []);

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
  const [applicationNumber, setApplicationNumber] = useState(
    result.applicationNumber,
  );
  const [paymentStatus, setPaymentStatus] =
    useState<VariancePaymentStatus>("unpaid");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const paid = paymentStatus === "complete";

  useEffect(() => {
    document
      .getElementById(`variance-checkout-${mountId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [mountId]);

  useEffect(() => {
    let cancelled = false;
    const distributionKey = result.paymentDistributionKey;
    const paymentHash = result.paymentUrl.replace(/^#/, "");
    const mountElementId = `knack-${distributionKey}`;
    const session = loadSession();

    function hashValue() {
      return window.location.hash.replace(/^#/, "");
    }

    function hashAllowsCheckout(hash: string) {
      return (
        hash.includes("formcharge-payment") ||
        hash.includes("variance-application-confirmation") ||
        hash.includes("variance-application-form-login")
      );
    }

    function forcePaymentHash() {
      if (cancelled) return;
      const hash = hashValue();
      if (hash.includes("variance-application-confirmation")) {
        setPaymentStatus("complete");
        return;
      }
      if (hashAllowsCheckout(hash)) return;
      if (window.location.hash !== `#${paymentHash}`) {
        window.location.hash = paymentHash;
      }
    }

    async function mountCheckout() {
      setCheckoutError(null);
      releaseEmbeddedKnackRuntime();
      document.getElementById("knack-dist_17")?.remove();

      window.app_id = KNACK_APP_ID;
      window.distribution_key = distributionKey;
      window.location.hash = paymentHash;

      const mount = document.getElementById(mountElementId);
      if (mount && mount.childElementCount === 0) {
        mount.textContent = "Loading secure checkout…";
      }

      const key = `${KNACK_APP_ID}-${distributionKey}`;
      document
        .querySelectorAll<HTMLScriptElement>(`script[data-knack-pay="${key}"]`)
        .forEach((script) => script.remove());

      try {
        await loadKnackPayScript(distributionKey, key);
      } catch {
        if (!cancelled) {
          setCheckoutError(
            "Secure checkout failed to load. Please refresh and try again.",
          );
        }
        return;
      }

      const readyDeadline = Date.now() + 8000;
      while (!cancelled && Date.now() < readyDeadline && !window.Knack) {
        await wait(50);
      }
      if (cancelled) return;

      if (session?.token) {
        await syncKnackRuntimeSession(session);
      }
      forcePaymentHash();
    }

    void mountCheckout();

    function onHashChange() {
      const hash = hashValue();
      if (hash.includes("variance-application-confirmation")) {
        setPaymentStatus("complete");
        return;
      }
      const mount = document.getElementById(mountElementId);
      if (mount?.querySelector("#kn-scene_268, [id*='scene_268']")) {
        forcePaymentHash();
        return;
      }
      if (!hashAllowsCheckout(hash)) forcePaymentHash();
    }

    window.addEventListener("hashchange", onHashChange);
    const guard = window.setInterval(() => {
      document.getElementById("knack-dist_17")?.remove();
      const hash = hashValue();
      if (hash.includes("variance-application-confirmation")) {
        setPaymentStatus("complete");
        return;
      }
      if (
        hash.includes("town-hall") ||
        hash.includes("meetings") ||
        document
          .getElementById(mountElementId)
          ?.querySelector("#kn-scene_268, [id*='scene_268']")
      ) {
        forcePaymentHash();
      }
    }, 500);

    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", onHashChange);
      window.clearInterval(guard);
    };
  }, [result.paymentDistributionKey, result.paymentUrl]);

  useEffect(() => {
    let cancelled = false;
    const session = loadSession();
    if (!session?.token) return;

    async function poll() {
      try {
        const status = await fetchVarianceApplicationStatus(
          session!.token,
          result.id,
        );
        if (cancelled) return;
        if (status.applicationNumber) {
          setApplicationNumber(status.applicationNumber);
        }
        if (status.paymentStatus === "unpaid") return;
        setPaymentStatus((current) =>
          current === "complete" ? current : status.paymentStatus,
        );
      } catch (error) {
        if (cancelled || !(error instanceof AuthExpiredError)) return;
        clearSession();
        setCheckoutError("Your session has expired. Please sign in again.");
      }
    }

    void poll();
    const timer = window.setInterval(() => {
      void poll();
    }, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [result.id]);

  const numberLabel = applicationNumber
    ? `Variance application #${applicationNumber}`
    : "Variance application";

  return (
    <div className="space-y-12" id={`variance-checkout-${mountId}`}>
      <section>
        <p className="text-xs uppercase tracking-[0.22em] text-brick">
          {paid ? "Payment received" : "Payment required"}
        </p>
        <h2 className="font-display mt-2 text-3xl text-forest-deep">
          {numberLabel}
        </h2>
        <div className="brick-rule mt-4" />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-mid">
          {paid
            ? "Your application fee has been received. Use the number below when you drop off your material sample."
            : `${result.feeLabel}. The application is not complete until this payment is received.`}
        </p>
        {!applicationNumber && !paid ? (
          <p className="mt-3 text-sm text-forest-mid">
            Your variance application number will appear here shortly.
          </p>
        ) : null}
        {paymentStatus === "failed" ? (
          <p className="mt-3 text-sm text-brick-deep">
            The payment did not go through. You can try the checkout again.
          </p>
        ) : null}
        {paymentStatus === "pending" ? (
          <p className="mt-3 text-sm text-forest-mid">
            PayPal is still confirming this payment. Keep this page open.
          </p>
        ) : null}
      </section>

      {paid ? (
        <section>
          <h3 className="font-display text-2xl text-forest-deep">
            One last step
          </h3>
          <div className="brick-rule mt-3" />
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-forest-mid">
            <li>
              Attach variance application number{" "}
              <span className="font-medium text-forest-deep">
                {applicationNumber ? `#${applicationNumber}` : "shown above"}
              </span>{" "}
              to your building material sample.
            </li>
            <li>Drop your samples off at 783 Wells Wynd.</li>
          </ol>
        </section>
      ) : (
        <section>
          <p className="text-xs uppercase tracking-[0.22em] text-brick">
            Secure checkout
          </p>
          <h3 className="font-display mt-2 text-3xl text-forest-deep">
            Submit application fee
          </h3>
          <div className="brick-rule mt-4" />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-mid">
            Complete payment in the checkout below. If prompted, sign in with
            the same HOA email and password. You do not need a PayPal account.
          </p>
        </section>
      )}

      <FormError message={checkoutError} />
      <CheckoutFrame distributionKey={result.paymentDistributionKey} />
    </div>
  );
}

const CheckoutFrame = memo(function CheckoutFrame({
  distributionKey,
}: {
  distributionKey: string;
}) {
  return (
    <div className="knack-shell mt-6 p-2 sm:p-4">
      <div
        id={`knack-${distributionKey}`}
        className="min-h-[720px]"
        suppressHydrationWarning
      />
    </div>
  );
});

function loadKnackPayScript(distributionKey: string, key: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://loader.knack.com/${KNACK_APP_ID}/${distributionKey}/knack.js`;
    script.async = true;
    script.dataset.knackPay = key;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Secure checkout failed to load."));
    document.body.appendChild(script);
  });
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
