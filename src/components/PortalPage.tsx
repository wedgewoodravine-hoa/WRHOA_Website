import { ContentSection } from "@/components/ContentSection";
import { KnackEmbed } from "@/components/KnackEmbed";
import { PageHero } from "@/components/PageHero";
import type { KnackPrefill } from "@/lib/contact-forms";
import type { KnackEmbed as KnackEmbedConfig } from "@/lib/site";

type Props = {
  title: string;
  description?: string;
  eyebrow?: string;
  embed: KnackEmbedConfig;
  prefill?: KnackPrefill;
};

export function PortalPage({
  title,
  description,
  eyebrow,
  embed,
  prefill,
}: Props) {
  return (
    <>
      <PageHero title={title} description={description} eyebrow={eyebrow} />
      <ContentSection band={0}>
        <KnackEmbed embed={embed} prefill={prefill} />
      </ContentSection>
    </>
  );
}
