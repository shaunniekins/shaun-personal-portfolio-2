<script lang="ts">
  import Icon, { type IconName } from "./Icon.svelte";
  import { reveal } from "$lib/reveal";
  import data from "$lib/portfolio-data.json";

  const { hero, name, subtitles, about, contact } = data;

  const stackCount = about.skillGroups
    .filter((group) => group.name !== "Focus")
    .reduce((total, group) => total + group.items.length, 0);

  /** The record card beside the portrait. Labels are data, so they are mono. */
  const spec = [
    { label: "Role", value: "Software Engineer" },
    { label: "Base", value: hero.base },
    { label: "Stack", value: `${stackCount} technologies` },
    { label: "Status", value: hero.status, live: true }
  ];

  const primarySocials = contact.socials.filter(
    (social) => social.icon === "github" || social.icon === "linkedin"
  );
</script>

<section id="hero" class="relative flex min-h-svh items-center overflow-hidden pt-24 pb-20 lg:pt-32">
  <div class="grid-field pointer-events-none absolute inset-0" aria-hidden="true"></div>

  <div class="relative mx-auto grid w-full max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:pl-32 xl:pl-36">
    <div class="lg:col-span-7">
      <p class="eyebrow text-violet-soft" data-reveal use:reveal={0}>
        {hero.greeting}
      </p>

      <h1
        class="mt-5 font-display text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.03em] text-balance text-text"
        data-reveal
        use:reveal={1}
      >
        {name}
      </h1>

      <!-- No dividers: the four roles never fit one line, so any separator
           would orphan at the wrap. Space carries the separation instead. -->
      <ul class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1.5" data-reveal use:reveal={2}>
        {#each subtitles as subtitle (subtitle)}
          <li class="font-mono text-xs tracking-wide whitespace-nowrap text-muted sm:text-sm">
            {subtitle}
          </li>
        {/each}
      </ul>

      <p class="mt-8 max-w-xl text-base text-pretty text-muted sm:text-lg" data-reveal use:reveal={3}>
        {hero.introduction}
      </p>

      <div class="mt-10 flex flex-wrap items-center gap-4" data-reveal use:reveal={4}>
        <a
          href="#contact"
          class="group inline-flex items-center gap-2.5 rounded-sm bg-violet px-6 py-3.5 font-medium text-ink transition-colors duration-200 hover:bg-violet-soft"
          style="touch-action: manipulation"
        >
          Get in Touch
          <span class="transition-transform duration-200 ease-out group-hover:translate-x-1">
            <Icon name="arrow-right" size={18} />
          </span>
        </a>

        <ul class="flex items-center gap-3">
          {#each primarySocials as social (social.name)}
            <li>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="{social.name} profile, opens in a new tab"
                class="grid size-12 place-items-center rounded-sm border border-line text-muted transition-colors duration-200 hover:border-violet hover:text-text"
                style="touch-action: manipulation"
              >
                <Icon name={social.icon as IconName} size={20} />
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Portrait and record card share one frame: a dossier entry. -->
    <div class="lg:col-span-5 lg:justify-self-end" data-reveal use:reveal={2}>
      <div class="relative mx-auto w-full max-w-sm">
        <div
          class="pointer-events-none absolute -top-3 -right-3 bottom-3 left-3 border border-violet/40"
          aria-hidden="true"
        ></div>

        <div class="relative border border-line bg-surface">
          <img
            src={hero.imageUrl}
            alt="Portrait of {name}"
            width={hero.imageWidth}
            height={hero.imageHeight}
            fetchpriority="high"
            decoding="async"
            class="aspect-[4/5] w-full object-cover object-[center_20%] grayscale-[0.15]"
          />

          <dl class="divide-y divide-line border-t border-line">
            {#each spec as row (row.label)}
              <div class="flex items-baseline justify-between gap-4 px-4 py-2.5">
                <dt class="eyebrow text-muted">{row.label}</dt>
                <dd
                  class="flex min-w-0 items-center gap-2 truncate font-mono text-xs"
                  class:text-amber={row.live}
                  class:text-text={!row.live}
                >
                  {#if row.live}
                    <span class="size-1.5 shrink-0 rounded-full bg-amber" aria-hidden="true"></span>
                  {/if}
                  {row.value}
                </dd>
              </div>
            {/each}
          </dl>
        </div>
      </div>
    </div>
  </div>
</section>
