"use client";

import Image from "next/image";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HoaAuthPortal } from "@/components/HoaAuthPortal";
import {
  AuthExpiredError,
  clearSession,
  fetchLeagueMembership,
  loadSession,
  updateLeagueHouseholdMembers,
  type LeagueMembershipContent,
} from "@/lib/knack-session";

const MEMBERSHIP_PROFILES = ["profile_5"];

export function LeagueMembershipSection() {
  return (
    <HoaAuthPortal
      requireGoodStanding
      allowedProfiles={MEMBERSHIP_PROFILES}
      description="Enter the email and password for your HOA portal account to view your Community League membership number."
      duesMessage="Membership numbers are available to members in good standing. To pay your HOA fees, visit Pay HOA Fees."
      load={fetchLeagueMembership}
    >
      {(data) => <MembershipDetails content={data} />}
    </HoaAuthPortal>
  );
}

function MembershipDetails({ content }: { content: LeagueMembershipContent }) {
  const owners = [content.owner, content.owner2].filter(Boolean) as string[];
  const [members, setMembers] = useState(content.additionalMembers);

  useEffect(() => {
    setMembers(content.additionalMembers);
  }, [content.additionalMembers]);

  return (
    <>
      <div className="membership-screen space-y-14">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          <div>
            <div className="relative overflow-hidden border border-forest/12 bg-white/40">
              <Image
                src={content.cardImageSrc}
                alt="Wedgewood Residents Community League membership card"
                width={1200}
                height={750}
                className="h-auto w-full"
                priority
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-brick"
              >
                Print membership card
              </button>
              <p className="text-sm text-forest-mid">
                Opens a single-page, wallet-size card for your printer.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-brick">
              {content.expiresLabel}
            </p>
            <h3 className="font-display mt-3 text-3xl leading-tight text-forest-deep sm:text-4xl">
              {content.seasonTitle}
            </h3>
            <div className="brick-rule mt-4" />

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.22em] text-forest-mid">
                Membership number
              </p>
              {content.membershipNumber ? (
                <p className="font-display mt-3 text-5xl tracking-wide text-forest-deep sm:text-6xl">
                  {content.membershipNumber}
                </p>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-forest-mid">
                  No membership number is on file for your property yet. Contact
                  support if you believe this is an error.
                </p>
              )}
            </div>

            {owners.length > 0 ? (
              <dl className="mt-8 space-y-3 border-t border-forest/12 pt-6">
                {owners.map((name, index) => (
                  <div key={`${name}-${index}`}>
                    <dt className="text-xs uppercase tracking-[0.18em] text-forest-mid">
                      {index === 0 ? "Owner" : "Owner 2"}
                    </dt>
                    <dd className="mt-1 text-lg text-forest-deep">{name}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <HouseholdMembersEditor
              recordId={content.householdRecordId}
              members={members}
              onMembersChange={setMembers}
            />
          </div>
        </div>

        <section>
          <h3 className="font-display text-3xl text-forest-deep">
            Community League membership benefits
          </h3>
          <div className="brick-rule mt-4" />
          <div className="prose-hoa mt-6 max-w-3xl space-y-4">
            <p>
              Membership in the Wedgewood Ravine Community League is included in
              your Homeowners&apos; Association annual fees and provides many
              benefits for your family including perks, deals, and discounts
              through the{" "}
              <a
                href="https://efcl.org/membership-purchase/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Edmonton Federation of Community Leagues (EFCL)
              </a>
              .
            </p>
            <ul>
              <li>
                <strong>Community League Wellness Program</strong> — discounts on
                City of Edmonton recreation memberships and multi-admission
                passes
              </li>
              <li>
                <strong>Free skating</strong> at outdoor community league rinks —
                request{" "}
                <a
                  href="https://www.wedgewoodcl.ca/community-league/membership2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  skate tags
                </a>{" "}
                here
              </li>
              <li>
                <strong>U of A Technology Training Centre</strong> — 25% off
                Microsoft and Adobe courses (
                <a
                  href="https://ualberta.ca/technology-training"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  course listings
                </a>
                )
              </li>
              <li>
                <strong>U of A Bookstore</strong> — 10% off clothing and giftware
                (online code: <strong>EFCL10</strong>)
              </li>
            </ul>
            <p>
              Full details and current offers:{" "}
              <a
                href="https://efcl.org/membership-purchase/"
                target="_blank"
                rel="noopener noreferrer"
              >
                efcl.org/membership-purchase
              </a>
            </p>
          </div>
        </section>
      </div>

      <PrintableMembershipCard
        content={content}
        owners={owners}
        members={members}
      />
    </>
  );
}

function PrintableMembershipCard({
  content,
  owners,
  members,
}: {
  content: LeagueMembershipContent;
  owners: string[];
  members: string[];
}) {
  const household = [...owners, ...members];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="membership-print-sheet" aria-hidden="true">
      <p className="membership-print-hint">
        Wallet size · cut along the dashed line · colour print if available
      </p>
      <div className="membership-print-card">
        {/* eslint-disable-next-line @next/next/no-img-element -- print sheet needs a plain img for reliable output */}
        <img
          src={content.cardImageSrc}
          alt=""
          className="membership-print-art"
        />
        <div className="membership-print-details">
          {content.membershipNumber ? (
            <p className="membership-print-number">
              #{content.membershipNumber}
            </p>
          ) : (
            <p className="membership-print-number membership-print-number--muted">
              Membership number unavailable
            </p>
          )}
          {household.length > 0 ? (
            <p className="membership-print-names">{household.join(" · ")}</p>
          ) : null}
          <p className="membership-print-expiry">{content.expiresLabel}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function HouseholdMembersEditor({
  recordId,
  members,
  onMembersChange,
}: {
  recordId?: string;
  members: string[];
  onMembersChange: (members: string[]) => void;
}) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function persist(next: string[]) {
    if (!recordId) {
      setError("No property record is available to update.");
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
      const saved = await updateLeagueHouseholdMembers(
        session.token,
        recordId,
        next,
      );
      onMembersChange(saved);
      setNotice("Household members updated.");
    } catch (err) {
      if (err instanceof AuthExpiredError) {
        clearSession();
        setError(err.message);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update household members.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function onAdd(event: FormEvent) {
    event.preventDefault();
    const name = draft.trim();
    if (!name || saving) return;

    const exists = members.some(
      (member) => member.toLowerCase() === name.toLowerCase(),
    );
    if (exists) {
      setError("That name is already listed.");
      return;
    }

    setDraft("");
    await persist([...members, name]);
  }

  async function onDelete(name: string) {
    if (saving) return;
    await persist(members.filter((member) => member !== name));
  }

  function onDraftKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setDraft("");
      setError(null);
    }
  }

  const canEdit = Boolean(recordId);

  return (
    <div className="mt-8 border-t border-forest/12 pt-6">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="group flex w-full items-start justify-between gap-4 text-left transition"
      >
        <span>
          <span className="text-xs uppercase tracking-[0.18em] text-forest-mid">
            Additional household members
          </span>
          <span className="mt-2 block text-sm leading-relaxed text-forest-mid group-hover:text-forest">
            {open
              ? "Add or remove names for your household."
              : members.length > 0
                ? `${members.length} listed — click to edit`
                : "None listed — click to add names"}
          </span>
        </span>
        <span
          aria-hidden
          className={`mt-1 text-brick transition ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>

      {!open && members.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {members.map((member) => (
            <li key={member} className="text-base text-forest-deep">
              {member}
            </li>
          ))}
        </ul>
      ) : null}

      {open ? (
        <div id={panelId} className="mt-5 space-y-5">
          {!canEdit ? (
            <p className="text-sm leading-relaxed text-forest-mid">
              Household members could not be loaded for editing. Try signing out
              and back in, or contact support.
            </p>
          ) : (
            <>
              {members.length > 0 ? (
                <ul className="space-y-2">
                  {members.map((member) => (
                    <li
                      key={member}
                      className="flex items-center justify-between gap-3 border-b border-forest/10 py-2.5"
                    >
                      <span className="text-base text-forest-deep">{member}</span>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void onDelete(member)}
                        className="shrink-0 text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-forest-mid">
                  No additional household members yet.
                </p>
              )}

              <form
                onSubmit={(event) => void onAdd(event)}
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
              >
                <label className="block min-w-0 flex-1">
                  <span className="text-xs uppercase tracking-[0.16em] text-forest-mid">
                    Add a name
                  </span>
                  <input
                    type="text"
                    value={draft}
                    disabled={saving}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={onDraftKeyDown}
                    placeholder="First and last name"
                    autoComplete="off"
                    className="mt-2 w-full border border-forest/20 bg-white/70 px-3 py-2.5 text-sm text-forest-deep outline-none transition focus:border-brick disabled:opacity-60"
                  />
                </label>
                <button
                  type="submit"
                  disabled={saving || !draft.trim()}
                  className="btn btn-brick shrink-0 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Add"}
                </button>
              </form>
            </>
          )}

          {error ? (
            <p className="text-sm text-brick-deep" role="alert">
              {error}
            </p>
          ) : null}
          {notice && !error ? (
            <p className="text-sm text-forest-mid" role="status">
              {notice}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
