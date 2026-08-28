<script lang="ts">
  import Icon, { type IconName } from "./Icon.svelte";
  import SectionHeading from "./SectionHeading.svelte";
  import { reveal } from "$lib/reveal";
  import data from "$lib/portfolio-data.json";

  const { contact } = data;
</script>

<section id="contact" class="relative overflow-hidden border-t border-line py-24 sm:py-32">
  <div class="mx-auto max-w-6xl px-5 sm:px-8 lg:pl-32 xl:pl-36">
    <SectionHeading id="contact" title={contact.title} />

    <div class="mt-14 max-w-3xl">
      <p class="text-lg text-pretty text-muted sm:text-xl" data-reveal use:reveal={1}>
        {contact.intro}
      </p>

      <div class="mt-12 border-y border-line py-8" data-reveal use:reveal={2}>
        <p class="eyebrow text-muted">Email</p>
        <a
          href="mailto:{contact.email}"
          class="mt-3 inline-block font-display text-[clamp(1.5rem,5vw,2.75rem)] leading-tight font-semibold tracking-[-0.02em] break-all text-text transition-colors duration-200 hover:text-violet-soft"
          translate="no"
        >
          {contact.email}
        </a>
      </div>

      <div class="mt-12" data-reveal use:reveal={3}>
        <h3 class="eyebrow text-muted">Elsewhere</h3>
        <ul class="mt-5 flex flex-wrap gap-3">
          {#each contact.socials as social (social.name)}
            <li>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-3 rounded-sm border border-line px-5 py-3.5 text-muted transition-colors duration-200 hover:border-violet hover:text-text"
                style="touch-action: manipulation"
              >
                <Icon name={social.icon as IconName} size={18} />
                <span class="font-mono text-xs">{social.name}</span>
                <span class="sr-only">, opens in a new tab</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</section>
