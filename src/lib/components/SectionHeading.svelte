<script lang="ts">
  import { reveal } from "$lib/reveal";
  import { sections } from "$lib/sections";

  let { id, title }: { id: string; title: string } = $props();

  const meta = $derived(sections.find((section) => section.id === id));
</script>

<div class="flex items-baseline gap-4 border-b border-line pb-5" data-reveal use:reveal={0}>
  <span class="eyebrow tabular-nums text-violet-soft" aria-hidden="true">
    {meta?.index}
  </span>
  <h2 class="font-display text-3xl font-semibold tracking-[-0.02em] text-balance text-text sm:text-4xl">
    {title}
  </h2>
</div>
