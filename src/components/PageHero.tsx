type Props = {
  title: string;
  description?: string;
  eyebrow?: string;
};

export function PageHero({ title, description, eyebrow }: Props) {
  return (
    <section className="relative z-0 isolate overflow-hidden border-b border-forest/10">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center brightness-[1.06] contrast-[1.05]"
        style={{ backgroundImage: "url('/images/FountainNEW.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/78 via-forest/55 to-bark/35" />
      <div className="glow-orb absolute -right-16 top-0 -z-10 h-56 w-56 rounded-full bg-brick/30 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {eyebrow ? (
          <p className="hero-text-shadow animate-fade-up text-xs uppercase tracking-[0.24em] text-gold">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="hero-text-shadow animate-fade-up-delay-1 font-display mt-3 max-w-3xl text-4xl text-cream-text sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="hero-text-shadow animate-fade-up-delay-2 mt-4 max-w-2xl text-base leading-relaxed text-cream-text/85 sm:text-lg">
            {description}
          </p>
        ) : null}
        <div className="animate-fade-up-delay-3 brick-rule mt-6" />
      </div>
    </section>
  );
}
