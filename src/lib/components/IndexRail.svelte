<script lang="ts">
  import Icon from "./Icon.svelte";
  import { sections } from "$lib/sections";

  let { name }: { name: string } = $props();

  let active = $state(sections[0].id);
  let progress = $state(0);
  let menuOpen = $state(false);

  let openButton = $state<HTMLButtonElement | null>(null);
  let closeButton = $state<HTMLButtonElement | null>(null);

  const current = $derived(sections.find((s) => s.id === active) ?? sections[0]);

  /**
   * Active section: whichever one occupies the middle band of the viewport.
   * A rootMargin band means no per-scroll layout reads — the browser does the
   * geometry. When nothing intersects (over the footer) the last value holds.
   */
  $effect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) active = hit.target.id;
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    for (const { id } of sections) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  });

  /** Scroll progress, read once per frame. */
  $effect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    };

    const onScroll = () => {
      frame ||= requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  });

  /** Keep the address bar honest without writing history on every frame. */
  $effect(() => {
    const id = active;
    if (window.location.hash.slice(1) === id) return;
    history.replaceState(history.state, "", `#${id}`);
  });

  /* Lock the page behind the open sheet, and move focus into it. */
  $effect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  });

  function closeMenu() {
    menuOpen = false;
    openButton?.focus();
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && menuOpen) closeMenu();
  }
</script>

<svelte:window onkeydown={onKeydown} />

<!-- Desktop: the index rail. Sequential, because the page is read in order. -->
<nav
  aria-label="Sections"
  class="pointer-events-none fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 lg:block xl:left-10"
>
  <div class="pointer-events-auto flex gap-5">
    <div class="relative w-px shrink-0 bg-line" aria-hidden="true">
      <div
        class="absolute inset-x-0 top-0 origin-top bg-violet transition-transform duration-150 ease-out"
        style="height: 100%; transform: scaleY({progress})"
      ></div>
    </div>

    <ul class="flex flex-col gap-1">
      {#each sections as section (section.id)}
        {@const isActive = section.id === active}
        <li>
          <a
            href="#{section.id}"
            aria-current={isActive ? "true" : undefined}
            class="group flex items-baseline gap-3 py-2 transition-colors duration-200"
            class:text-text={isActive}
            class:text-muted={!isActive}
          >
            <span
              class="eyebrow tabular-nums transition-colors duration-200"
              class:text-violet-soft={isActive}
              class:text-muted={!isActive}
            >
              {section.index}
            </span>
            <span class="font-mono text-xs tracking-wide group-hover:text-text">
              {section.label}
            </span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>

<!-- Mobile and tablet: compact bar with the same information. -->
<header
  class="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md lg:hidden"
  style="padding-top: env(safe-area-inset-top, 0px)"
>
  <div class="flex h-14 items-center justify-between gap-4 px-5">
    <a href="#hero" class="min-w-0 truncate font-display text-base font-semibold text-text">
      {name}
    </a>
    <div class="flex items-center gap-3">
      <span class="eyebrow text-muted tabular-nums" aria-hidden="true">
        {current.index} / {sections.at(-1)?.index}
      </span>
      <button
        bind:this={openButton}
        type="button"
        onclick={() => (menuOpen = true)}
        aria-label="Open section menu"
        aria-expanded={menuOpen}
        aria-controls="section-menu"
        class="grid size-11 place-items-center rounded-sm border border-line text-muted transition-colors duration-200 hover:border-line-strong hover:text-text"
        style="touch-action: manipulation"
      >
        <Icon name="menu" size={20} />
      </button>
    </div>
  </div>
  <div class="h-px w-full bg-line" aria-hidden="true">
    <div
      class="h-px origin-left bg-violet transition-transform duration-150 ease-out"
      style="transform: scaleX({progress})"
    ></div>
  </div>
</header>

{#if menuOpen}
  <div
    id="section-menu"
    class="fixed inset-0 z-50 flex flex-col bg-ink lg:hidden"
    style="overscroll-behavior: contain; padding-top: env(safe-area-inset-top, 0px)"
  >
    <div class="flex h-14 items-center justify-between px-5">
      <span class="eyebrow text-muted">Sections</span>
      <button
        bind:this={closeButton}
        type="button"
        onclick={closeMenu}
        aria-label="Close section menu"
        class="grid size-11 place-items-center rounded-sm border border-line text-muted transition-colors duration-200 hover:border-line-strong hover:text-text"
        style="touch-action: manipulation"
      >
        <Icon name="close" size={20} />
      </button>
    </div>

    <ul class="flex flex-col border-t border-line">
      {#each sections as section (section.id)}
        {@const isActive = section.id === active}
        <li class="border-b border-line">
          <a
            href="#{section.id}"
            onclick={closeMenu}
            aria-current={isActive ? "true" : undefined}
            class="flex items-baseline gap-4 px-5 py-5 transition-colors duration-200"
            class:text-text={isActive}
            class:text-muted={!isActive}
          >
            <span
              class="eyebrow tabular-nums"
              class:text-violet-soft={isActive}
              class:text-muted={!isActive}
            >
              {section.index}
            </span>
            <span class="font-display text-2xl font-medium">{section.label}</span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
{/if}
