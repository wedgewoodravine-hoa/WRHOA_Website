import Image from "next/image";
import type { BoardMember } from "@/lib/knack";

export function BoardMembersSection({
  members,
  error,
}: {
  members: BoardMember[];
  error?: string | null;
}) {
  if (error) {
    return (
      <p className="border border-brick/30 bg-parchment/70 px-5 py-4 text-sm text-brick-deep">
        {error}
      </p>
    );
  }

  if (members.length === 0) {
    return (
      <p className="text-sm text-forest-mid">
        Board member listings are not available right now.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-8 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-brick">
          Leadership
        </p>
        <h2 className="font-display mt-2 text-3xl text-forest-deep">
          Current board
        </h2>
        <div className="brick-rule mt-4" />
        <p className="mt-4 text-sm leading-relaxed text-forest-mid">
          Directors serving the Wedgewood Ravine Home Owners Association.
        </p>
      </div>

      <div className="divide-y divide-forest/15 border-y border-forest/15">
        {members.map((member) => (
          <article
            key={member.id}
            className={
              member.photoUrl
                ? "grid gap-5 py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-8"
                : "py-6"
            }
          >
            {member.photoUrl ? (
              <div className="relative aspect-square w-24 overflow-hidden border border-forest/12 bg-mist/50 sm:w-full">
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="120px"
                  unoptimized
                />
              </div>
            ) : null}
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.18em] text-brick">
                {member.position}
              </p>
              <h3 className="font-display mt-1 text-2xl text-forest-deep">
                {member.name}
              </h3>
              {member.bio ? (
                <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-forest-mid">
                  {member.bio}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
