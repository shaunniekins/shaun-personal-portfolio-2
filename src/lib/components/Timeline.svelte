<script lang="ts">
  import Icon from "./Icon.svelte";
  import SectionHeading from "./SectionHeading.svelte";
  import { reveal } from "$lib/reveal";
  import data from "$lib/portfolio-data.json";

  const { experience } = data;

  /** The period text already encodes order, so it labels the rail directly. */
  const isCurrent = (period: string) => /present/i.test(period);
</script>

<section id="experience" class="border-t border-line py-24 sm:py-28">
  <div class="mx-auto max-w-6xl px-5 sm:px-8 lg:pl-32 xl:pl-36">
    <SectionHeading id="experience" title={experience.title} />

    <ol
      class="relative mt-14 max-w-3xl [--rail:0.375rem] sm:[--rail:2.5rem]"
      style="list-style: none"
    >
      <div
        class="absolute top-2 bottom-2 w-px bg-line"
        style="left: var(--rail)"
        aria-hidden="true"
      ></div>

      {#each experience.jobs as job, i (`${job.company}-${job.period}`)}
        {@const current = isCurrent(job.period)}
        <li
          class="relative pb-12 pl-8 last:pb-0 sm:pl-20"
          data-reveal
          use:reveal={i}
        >
          <span
            class="absolute top-2 size-2.5 -translate-x-1/2 rounded-full ring-4 ring-ink"
            class:bg-amber={current}
            class:bg-violet={!current}
            style="left: var(--rail)"
            aria-hidden="true"
          ></span>

          <div class="flex flex-wrap items-center gap-3">
            <p class="eyebrow text-muted" class:text-amber={current}>{job.period}</p>
            {#if current}
              <span
                class="eyebrow rounded-full border border-amber/40 px-2 py-0.5 text-amber"
              >
                Now
              </span>
            {/if}
          </div>

          <h3 class="mt-3 font-display text-xl font-semibold text-text sm:text-2xl">
            {job.role}
          </h3>

          <!-- companyUrl is optional; only linked when the data provides one. -->
          {#if "companyUrl" in job && job.companyUrl}
            <p class="mt-1">
              <a
                href={job.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="group/company inline-flex items-baseline gap-1.5 text-base text-violet-soft transition-colors duration-200 hover:text-text"
                dir="auto"
                translate="no"
              >
                {job.company}
                <span class="shrink-0 self-center opacity-60 transition-opacity duration-200 group-hover/company:opacity-100">
                  <Icon name="external" size={14} />
                </span>
                <span class="sr-only">, opens in a new tab</span>
              </a>
            </p>
          {:else}
            <p class="mt-1 text-base text-violet-soft" dir="auto" translate="no">
              {job.company}
            </p>
          {/if}

          <ul class="mt-5 space-y-2.5" style="list-style: none">
            {#each job.responsibilities as responsibility (responsibility)}
              <li class="flex gap-3 text-sm text-pretty text-muted sm:text-base">
                <span class="mt-2.5 h-px w-3 shrink-0 bg-line-strong" aria-hidden="true"></span>
                <span class="min-w-0">{responsibility}</span>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ol>
  </div>
</section>
