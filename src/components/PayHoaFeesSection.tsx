"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { AccountInformationSection } from "@/components/AccountInformationSection";
import { HoaAuthPortal } from "@/components/HoaAuthPortal";
import {
  fetchPayHoaFeesContent,
  KNACK_APP_ID,
  type HoaDueItem,
  type HoaPaidDueItem,
  type HoaPropertySummary,
  type PayHoaFeesContent,
} from "@/lib/knack-session";

const PAY_PROFILES = ["profile_5"];

export function PayHoaFeesSection() {
  return (
    <HoaAuthPortal
      requireGoodStanding={false}
      allowedProfiles={PAY_PROFILES}
      description="Enter the email and password for your HOA portal account to review dues and pay online."
      load={fetchPayHoaFeesContent}
    >
      {(data) => <PayHoaFeesDashboard content={data} />}
    </HoaAuthPortal>
  );
}

function PayHoaFeesDashboard({ content }: { content: PayHoaFeesContent }) {
  const [payingDue, setPayingDue] = useState<HoaDueItem | null>(null);
  const [account, setAccount] = useState(content.account);

  useEffect(() => {
    setAccount(content.account);
  }, [content.account]);

  return (
    <div className="space-y-14">
      <section>
        <p className="max-w-3xl text-base leading-relaxed text-forest-mid">
          {content.notice}
        </p>
      </section>

      {account ? (
        <AccountInformationSection
          account={account}
          onAccountChange={setAccount}
        />
      ) : null}

      {content.properties.length > 0 ? (
        <section>
          <h3 className="font-display text-3xl text-forest-deep">
            Your properties
          </h3>
          <div className="brick-rule mt-4" />
          <ul className="mt-6 divide-y divide-forest/12 border-y border-forest/12">
            {content.properties.map((property) => (
              <PropertyRow key={property.id} property={property} />
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-display text-3xl text-forest-deep">
              Current dues
            </h3>
            <div className="brick-rule mt-4" />
          </div>
          {content.currentDues.length > 0 ? (
            <p className="text-sm text-forest-mid">
              Choose Pay to open the secure PayPal checkout.
            </p>
          ) : null}
        </div>

        {content.currentDues.length === 0 ? (
          <p className="mt-6 text-sm leading-relaxed text-forest-mid">
            You have no outstanding dues right now. Thank you for keeping your
            account current.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {content.currentDues.map((due) => (
              <li
                key={due.id}
                className="border border-forest/12 bg-white/45 px-4 py-5 sm:px-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <p className="font-display text-3xl text-forest-deep">
                      {due.amountLabel || "Amount pending"}
                    </p>
                    {due.propertyLabel ? (
                      <p className="text-base text-forest-deep">
                        {due.propertyLabel}
                      </p>
                    ) : null}
                    <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-forest-mid">
                      {due.yearLabel ? (
                        <div>
                          <dt className="inline text-xs uppercase tracking-[0.16em]">
                            Year{" "}
                          </dt>
                          <dd className="inline">{due.yearLabel}</dd>
                        </div>
                      ) : null}
                      {due.earlyBirdDeadlineLabel ? (
                        <div>
                          <dt className="inline text-xs uppercase tracking-[0.16em]">
                            Early bird{" "}
                          </dt>
                          <dd className="inline">{due.earlyBirdDeadlineLabel}</dd>
                        </div>
                      ) : null}
                      {(due.customDueDateLabel || due.dueDateLabel) && (
                        <div>
                          <dt className="inline text-xs uppercase tracking-[0.16em]">
                            Due{" "}
                          </dt>
                          <dd className="inline">
                            {due.customDueDateLabel || due.dueDateLabel}
                          </dd>
                        </div>
                      )}
                    </dl>
                    {due.description ? (
                      <p className="text-sm text-forest-mid">{due.description}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPayingDue(due)}
                    className="btn btn-brick shrink-0 self-start"
                  >
                    Pay
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {payingDue ? (
        <PaymentCheckout
          due={payingDue}
          distributionKey={content.paymentDistributionKey}
          onClose={() => setPayingDue(null)}
        />
      ) : null}

      <section>
        <h3 className="font-display text-3xl text-forest-deep">
          Payment history
        </h3>
        <div className="brick-rule mt-4" />
        {content.paidDues.length === 0 ? (
          <p className="mt-6 text-sm leading-relaxed text-forest-mid">
            No completed payments are listed for your account yet.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-forest/12 border-y border-forest/12">
            {content.paidDues.map((due) => (
              <PaidDueRow key={due.id} due={due} />
            ))}
          </ul>
        )}
      </section>

      <section className="max-w-3xl">
        <h3 className="font-display text-3xl text-forest-deep">
          How online payment works
        </h3>
        <div className="brick-rule mt-4" />
        <div className="prose-hoa mt-6 space-y-4">
          <p>
            We use PayPal as our secure digital cashier. You do{" "}
            <strong>not</strong> need a PayPal account — it works like the card
            machine at a store. Your card details stay encrypted and are never
            seen or stored by the HOA.
          </p>
          <ol>
            <li>
              Click <strong>Pay</strong> on an outstanding due above.
            </li>
            <li>
              In the checkout, choose <strong>Check out with PayPal</strong> and
              enter your card and billing details.
            </li>
            <li>
              To stay a guest, leave{" "}
              <strong>Save info &amp; create your PayPal account</strong>{" "}
              unchecked / off near the bottom of the PayPal page.
            </li>
            <li>
              Finish with <strong>Agree &amp; Pay</strong>.
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}

function PropertyRow({ property }: { property: HoaPropertySummary }) {
  return (
    <li className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
      <p className="text-base font-medium text-forest-deep">
        {property.address || "Wedgewood property"}
      </p>
      {property.totalPayableLabel ? (
        <p className="text-sm text-forest-mid">
          Total payable:{" "}
          <span className="font-medium text-forest-deep">
            {property.totalPayableLabel}
          </span>
        </p>
      ) : null}
    </li>
  );
}

function PaidDueRow({ due }: { due: HoaPaidDueItem }) {
  const amount = due.paypalAmountLabel || due.chequeAmountLabel;
  const date = due.paypalDateLabel || due.chequeDateLabel;
  const method = due.paypalAmountLabel
    ? "PayPal"
    : due.chequeAmountLabel
      ? "Cheque"
      : undefined;

  return (
    <li className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
      <div className="min-w-0">
        <p className="text-sm font-medium text-forest-deep">
          {due.yearLabel || "HOA year"}
          {due.propertyLabel ? ` · ${due.propertyLabel}` : ""}
        </p>
        {method ? (
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-forest-mid">
            Paid by {method}
            {date ? ` · ${date}` : ""}
          </p>
        ) : date ? (
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-forest-mid">
            {date}
          </p>
        ) : null}
      </div>
      {amount ? (
        <p className="shrink-0 text-base font-medium text-forest-deep">{amount}</p>
      ) : null}
    </li>
  );
}

function PaymentCheckout({
  due,
  distributionKey,
  onClose,
}: {
  due: HoaDueItem;
  distributionKey: string;
  onClose: () => void;
}) {
  const mountId = useId().replace(/:/g, "");
  const loadedKey = useRef<string | null>(null);

  useEffect(() => {
    const key = `${KNACK_APP_ID}-${distributionKey}`;
    window.app_id = KNACK_APP_ID;
    window.distribution_key = distributionKey;
    window.location.hash = due.paymentUrl;

    if (loadedKey.current === key) return;
    loadedKey.current = key;

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-knack-pay="${key}"]`,
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = `https://loader.knack.com/${KNACK_APP_ID}/${distributionKey}/knack.js`;
    script.async = true;
    script.dataset.knackPay = key;
    document.body.appendChild(script);
  }, [distributionKey, due.paymentUrl]);

  useEffect(() => {
    const node = document.getElementById(`pay-checkout-${mountId}`);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [mountId]);

  return (
    <section id={`pay-checkout-${mountId}`} className="scroll-mt-28">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-brick">
            Secure checkout
          </p>
          <h3 className="font-display mt-2 text-3xl text-forest-deep">
            Pay {due.amountLabel || "dues"}
          </h3>
          <div className="brick-rule mt-4" />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-mid">
            {due.propertyLabel ? `${due.propertyLabel}. ` : ""}
            Complete payment in the checkout below. If prompted, sign in with the
            same HOA email and password.
          </p>
        </div>
        <button type="button" onClick={onClose} className="btn btn-outline shrink-0">
          Close checkout
        </button>
      </div>

      <div className="knack-shell mt-6 p-2 sm:p-4">
        <div id={`knack-${distributionKey}`} className="min-h-[720px]">
          Loading secure checkout…
        </div>
      </div>
    </section>
  );
}
