<script lang="ts">
  import { page } from "$app/state";
  import Icon from "./Icon.svelte";
  import SectionHeading from "./SectionHeading.svelte";
  import { reveal } from "$lib/reveal";
  import data from "$lib/portfolio-data.json";

  const { projects } = data;
  const items = projects.items;

  const counts = new Map(
    projects.filters.map((stack) => [
      stack,
      items.filter((item) => item.technologies.includes(stack)).length
    ])
  );

  /** Filter state lives in the URL, so a filtered view is linkable. */
  const active = $derived(page.url.searchParams.get("stack"));
  const shown = $derived(
    active ? items.filter((item) => item.technologies.includes(active)) : items
  );

  const hasLink = (value: string) => Boolean(value) && value !== "#";

  function href(stack: string | null) {
    return stack ? `?stack=${encodeURIComponent(stack)}#projects` : "?#projects";
  }
</script>

<section id="projects" class="border-t border-line bg-surface py-24 sm:py-28">
  <div class="mx-auto max-w-6xl px-5 sm:px-8 lg:pl-32 xl:pl-36">
    <SectionHeading id="projects" title={projects.title} />

    <div class="mt-10 flex flex-col gap-6" data-reveal use:reveal={1}>
      <h3 class="eyebrow text-muted" id="stack-filter-label">Filter by stack</h3>

      <ul class="flex flex-wrap gap-2" aria-labelledby="stack-filter-label">
        <li>
          <a
            href={href(null)}
            data-sveltekit-noscroll
            aria-current={active ? undefined : "true"}
            class="inline-block rounded-sm border px-3 py-2 font-mono text-xs transition-colors duration-200"
            class:border-violet={!active}
            class:bg-violet={!active}
            class:text-ink={!active}
            class:border-line={!!active}
            class:text-muted={!!active}
            class:hover:border-line-strong={!!active}
            class:hover:text-text={!!active}
            style="touch-action: manipulation"
          >
            All <span class="tabular-nums opacity-70">{items.length}</span>
          </a>
        </li>

        {#each projects.filters as stack (stack)}
          {@const isActive = active === stack}
          <li>
            <a
              href={href(isActive ? null : stack)}
              data-sveltekit-noscroll
              aria-current={isActive ? "true" : undefined}
              class="inline-block rounded-sm border px-3 py-2 font-mono text-xs whitespace-nowrap transition-colors duration-200"
              class:border-violet={isActive}
              class:bg-violet={isActive}
              class:text-ink={isActive}
              class:border-line={!isActive}
              class:text-muted={!isActive}
              class:hover:border-line-strong={!isActive}
              class:hover:text-text={!isActive}
              style="touch-action: manipulation"
            >
              {stack} <span class="tabular-nums opacity-70">{counts.get(stack)}</span>
            </a>
          </li>
        {/each}
      </ul>

      <p class="font-mono text-xs text-muted tabular-nums" aria-live="polite">
        Showing {shown.length} of {items.length} projects{active ? ` built with ${active}` : ""}
      </p>
    </div>

    {#if shown.length === 0}
      <p class="mt-14 border border-line bg-raised p-8 text-center text-muted">
        No projects use {active} yet. <a href={href(null)} data-sveltekit-noscroll class="text-violet-soft underline underline-offset-4">Show all projects</a>
      </p>
    {:else}
      <ul class="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {#each shown as project, i (project.name)}
          <li
            class="group flex flex-col border border-line bg-raised transition-[border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-line-strong"
            data-reveal
            use:reveal={i}
          >
            <div class="flex flex-1 flex-col p-6">
              <div class="flex items-start justify-between gap-4">
                <h4 class="min-w-0 font-display text-lg leading-snug font-semibold text-pretty text-text">
                  {project.name}
                </h4>

                <div class="flex shrink-0 items-center gap-1">
                  {#if hasLink(project.link)}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open {project.name} live, in a new tab"
                      class="grid size-11 place-items-center rounded-sm text-muted transition-colors duration-200 hover:text-violet-soft"
                      style="touch-action: manipulation"
                    >
                      <Icon name="external" size={18} />
                    </a>
                  {/if}
                  {#if hasLink(project.repoUrl)}
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="{project.name} source on GitHub, opens in a new tab"
                      class="grid size-11 place-items-center rounded-sm text-muted transition-colors duration-200 hover:text-violet-soft"
                      style="touch-action: manipulation"
                    >
                      <Icon name="github" size={18} />
                    </a>
                  {/if}
                </div>
              </div>

              <p class="mt-3 flex-1 text-sm text-pretty text-muted">
                {project.description}
              </p>

              <ul class="mt-6 flex flex-wrap gap-1.5" style="list-style: none">
                {#each project.technologies as tech (tech)}
                  <li
                    class="rounded-sm border border-line px-2 py-0.5 font-mono text-xs whitespace-nowrap text-muted"
                    class:text-amber={active === tech}
                    class:border-amber={active === tech}
                  >
                    {tech}
                  </li>
                {/each}
              </ul>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>
