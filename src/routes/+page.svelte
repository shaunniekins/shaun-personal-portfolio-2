<script lang="ts">
  import IndexRail from "$lib/components/IndexRail.svelte";
  import Hero from "$lib/components/Hero.svelte";
  import About from "$lib/components/About.svelte";
  import Timeline from "$lib/components/Timeline.svelte";
  import Projects from "$lib/components/Projects.svelte";
  import Contact from "$lib/components/Contact.svelte";
  import data from "$lib/portfolio-data.json";

  const { name, role, hero } = data;
  const description = `${name} — ${role}. ${hero.introduction}`;
  const year = new Date().getFullYear();
</script>

<svelte:head>
  <title>{name} — {role}</title>
  <meta name="description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{name} — {role}" />
  <meta property="og:description" content={description} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<a
  href="#main"
  class="sr-only rounded-sm bg-violet px-4 py-2 font-mono text-sm text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60]"
>
  Skip to content
</a>

<IndexRail {name} />

<main id="main">
  <Hero />
  <About />
  <Timeline />
  <Projects />
  <Contact />
</main>

<footer class="border-t border-line bg-surface">
  <div
    class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-10 sm:px-8 lg:pl-32 xl:pl-36"
    style="padding-bottom: calc(2.5rem + env(safe-area-inset-bottom, 0px))"
  >
    <p class="font-mono text-xs text-muted">
      &copy; {year} {name}
    </p>
    <a
      href="#hero"
      class="-my-2 py-2.5 font-mono text-xs text-muted transition-colors duration-200 hover:text-text"
    >
      Back to top
    </a>
  </div>
</footer>
