import type { Metadata } from "next";
import { BoardMembersSection } from "@/components/BoardMembersSection";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";
import { fetchBoardMembers, type BoardMember } from "@/lib/knack";

export const metadata: Metadata = { title: "Board Members" };

export const revalidate = 300;

export default async function Page() {
  let members: BoardMember[] = [];
  let error: string | null = null;

  try {
    members = await fetchBoardMembers();
  } catch {
    error = "Board members could not be loaded right now.";
  }

  return (
    <>
      <PageHero
        eyebrow="My HOA"
        title="Board Members"
        description="Current Home Owners Association board members."
      />
      <ContentSection band={0}>
        <BoardMembersSection members={members} error={error} />
      </ContentSection>
    </>
  );
}
