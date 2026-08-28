<script lang="ts">
  import SectionHeading from "./SectionHeading.svelte";
  import { reveal } from "$lib/reveal";
  import data from "$lib/portfolio-data.json";

  const { about, name } = data;
</script>

<section id="about" class="border-t border-line bg-surface py-24 sm:py-28">
  <div class="mx-auto max-w-6xl px-5 sm:px-8 lg:pl-32 xl:pl-36">
    <SectionHeading id="about" title={about.title} />

    <div class="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-12">
      <div class="lg:col-span-5" data-reveal use:reveal={1}>
        <div class="relative">
          <img
            src={about.imageUrl}
            alt="{name} at work"
            width={about.imageWidth}
            height={about.imageHeight}
            loading="lazy"
            decoding="async"
            class="aspect-[4/5] w-full border border-line object-cover grayscale-[0.15]"
          />
          <div
            class="pointer-events-none absolute -bottom-3 -left-3 size-16 border-b border-l border-amber/60"
            aria-hidden="true"
          ></div>
        </div>
      </div>

      <div class="lg:col-span-7">
        <div class="space-y-5 text-base text-pretty text-muted sm:text-lg" data-reveal use:reveal={2}>
          <p>{about.paragraph1}</p>
          <p>{about.paragraph2}</p>
        </div>

        <h3 class="eyebrow mt-14 text-muted" data-reveal use:reveal={3}>Toolkit</h3>

        <dl class="mt-6 divide-y divide-line border-y border-line">
          {#each about.skillGroups as group, i (group.name)}
            <div
              class="grid gap-3 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6"
              data-reveal
              use:reveal={4 + i}
            >
              <dt class="eyebrow pt-1 text-violet-soft">{group.name}</dt>
              <dd class="flex flex-wrap gap-2">
                {#each group.items as item (item)}
                  <span
                    class="rounded-sm border border-line bg-raised px-2.5 py-1 font-mono text-xs whitespace-nowrap text-text"
                  >
                    {item}
                  </span>
                {/each}
              </dd>
            </div>
          {/each}
        </dl>
      </div>
    </div>
  </div>
</section>
