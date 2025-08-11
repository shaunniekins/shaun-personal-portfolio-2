<script lang="ts">
  import portfolioData from "$lib/portfolio-data.json";
  import { onMount } from "svelte";
  import { sineInOut } from "svelte/easing";
  import { crossfade, fly, slide, scale } from "svelte/transition";

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),
    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;
      return {
        duration: 600,
        easing: sineInOut,
        css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
      };
    },
  });

  let activeSection = "hero";
  const sections = ["hero", "about", "experience", "projects", "contact"];
  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenuAndScroll(sectionId: string) {
    scrollToSection(sectionId);
    menuOpen = false;
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Create a map to store intersection data
        const intersectingEntries = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => ({
            id: entry.target.id,
            ratio: entry.intersectionRatio,
            boundingRect: entry.boundingClientRect,
            rootBounds: entry.rootBounds,
          }));

        if (intersectingEntries.length > 0) {
          // Find the section that's most centered in the viewport
          const viewportCenter = window.innerHeight / 2;

          let bestSection = intersectingEntries[0];
          let bestDistance = Infinity;

          intersectingEntries.forEach((entry) => {
            // Calculate distance from section center to viewport center
            const sectionCenter =
              entry.boundingRect.top + entry.boundingRect.height / 2;
            const distance = Math.abs(sectionCenter - viewportCenter);

            if (distance < bestDistance) {
              bestDistance = distance;
              bestSection = entry;
            }
          });

          activeSection = bestSection.id;
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-50px 0px -50px 0px",
      }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    // Backup scroll listener for more accurate navigation highlighting
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            if (activeSection !== sections[i]) {
              activeSection = sections[i];
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial call to set correct section
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (typeof document !== "undefined") {
        document.body.classList.remove("body-no-scroll");
      }
    };
  });

  $: if (typeof document !== "undefined") {
    if (menuOpen) {
      document.body.classList.add("body-no-scroll");
    } else {
      document.body.classList.remove("body-no-scroll");
    }
  }

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
</script>

<svelte:head>
  <title>{portfolioData.name} - {portfolioData.role}</title>
  <meta
    name="description"
    content={`Personal portfolio of ${portfolioData.name}, ${portfolioData.role}`}
  />
</svelte:head>

<div
  class="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-purple-200 min-h-screen font-sans leading-relaxed"
>
  <!-- Header / Navigation -->
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    class:glass-nav={activeSection !== "hero" || menuOpen}
    class:shadow-lg={activeSection !== "hero" || menuOpen}
  >
    <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
      <a
        href="#hero"
        on:click|preventDefault={() => closeMenuAndScroll("hero")}
        class="invisible md:visible text-2xl font-bold text-purple-400 hover:text-purple-200 transition-colors"
      >
        {portfolioData.name}
      </a>
      <!-- Desktop Navigation -->
      <ul class="hidden md:flex space-x-6">
        {#each sections as section}
          <li>
            <a
              href="#{section}"
              on:click|preventDefault={() => scrollToSection(section)}
              class="capitalize hover:text-purple-100 transition-colors relative"
              class:text-purple-400={activeSection === section}
              class:text-purple-300={activeSection !== section}
            >
              {section === "hero" ? "Home" : section}
            </a>
          </li>
        {/each}
      </ul>
      <!-- Mobile Menu Button -->
      <div class="md:hidden">
        <button
          on:click={toggleMenu}
          aria-label="Toggle menu"
          class="text-purple-300 hover:text-purple-100 focus:outline-none z-[51]"
        >
          {#if menuOpen}
            <svg
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path></svg
            >
          {:else}
            <svg
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path></svg
            >
          {/if}
        </button>
      </div>
    </nav>

    <!-- Mobile Navigation Menu -->
    {#if menuOpen}
      <div
        transition:fly={{ y: -20, duration: 200, easing: sineInOut }}
        class="md:hidden absolute top-full left-0 right-0 bg-gray-800 bg-opacity-95 backdrop-blur-md shadow-xl py-4"
        style="z-index: 49;"
      >
        <ul class="flex flex-col items-center space-y-4">
          {#each sections as section}
            <li>
              <a
                href="#{section}"
                on:click|preventDefault={() => closeMenuAndScroll(section)}
                class="block py-2 capitalize text-lg hover:text-purple-100 transition-colors"
                class:text-purple-400={activeSection === section}
                class:text-purple-300={activeSection !== section}
              >
                {section === "hero" ? "Home" : section}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </header>

  <!-- Hero Section -->
  <section
    id="hero"
    class="min-h-screen flex items-center justify-center pt-20 md:pt-0 relative overflow-hidden"
    in:fly={{ y: 50, duration: 800, easing: sineInOut }}
  >
    <!-- Background decoration elements -->
    <div
      class="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"
    ></div>
    <div
      class="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-700 rounded-full opacity-10 blur-3xl"
    ></div>

    <div
      class="container mx-auto px-6 flex flex-col md:flex-row items-center relative z-10"
    >
      <div class="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
        <p
          class="text-xl md:text-2xl text-purple-400 mb-2 mt-16"
          transition:fly={{ y: -20, delay: 200, duration: 500 }}
        >
          {portfolioData.hero.greeting}
        </p>
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-4">
          {portfolioData.name}.
        </h1>
        <div class="text-2xl md:text-3xl text-purple-300 mb-6">
          {#each portfolioData.subtitles as subtitle, i (subtitle)}
            <span
              in:fly={{ y: 20, delay: 300 + i * 100, duration: 500 }}
              out:fly={{ y: -20, duration: 300 }}>{subtitle}</span
            >
            {#if i < portfolioData.subtitles.length - 1}
              <span
                class="mx-2"
                in:fly={{ y: 20, delay: 350 + i * 100, duration: 500 }}
                >&bull;</span
              >
            {/if}
          {/each}
        </div>
        <p
          class="text-lg md:text-xl text-gray-400 mb-8 max-w-xl text-justify"
          transition:fly={{ y: 20, delay: 600, duration: 500 }}
        >
          {portfolioData.hero.introduction}
        </p>
        <button
          on:click={() => scrollToSection("contact")}
          class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-opacity-80"
          transition:fly={{ y: 20, delay: 700, duration: 500 }}
        >
          Get in Touch
        </button>
      </div>
      <div
        class="md:w-2/5 flex justify-center md:justify-end"
        transition:fly={{ x: 50, delay: 400, duration: 800 }}
      >
        <img
          src={portfolioData.hero.imageUrl}
          alt={portfolioData.name}
          class="rounded-full shadow-2xl w-72 h-72 sm:w-80 sm:h-80 md:w-[27rem] md:h-[27rem] object-cover object-[center_25%] border-4 border-purple-500 glass-effect"
        />
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section
    id="about"
    class="py-20 bg-gray-800 bg-opacity-50 relative overflow-hidden"
    in:fly={{ y: 50, duration: 600, easing: sineInOut }}
  >
    <!-- Background blur elements -->
    <div
      class="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-600 rounded-full opacity-20 blur-3xl"
    ></div>
    <div
      class="absolute bottom-1/3 left-1/4 w-80 h-80 bg-indigo-800 rounded-full opacity-20 blur-3xl"
    ></div>

    <div class="container mx-auto px-6 relative z-10">
      <h2
        class="text-4xl font-bold text-center text-white mb-12"
        transition:slide={{ delay: 200 }}
      >
        {portfolioData.about.title}
      </h2>
      <div class="grid md:grid-cols-2 gap-10 items-start">
        <!-- Image Column -->
        <div
          class="flex justify-center items-center p-4 md:p-0"
          transition:fly={{
            x: -30,
            delay: 250,
            duration: 500,
            easing: sineInOut,
          }}
        >
          <img
            src={portfolioData.about.imageUrl ||
              "/placeholder-about-image.webp"}
            alt="About {portfolioData.name}"
            class="rounded-xl shadow-2xl w-full max-w-sm md:max-w-md h-auto object-cover glass-effect"
          />
        </div>

        <!-- Text and Skills Column -->
        <div class="space-y-8">
          <div class="text-gray-300 space-y-6 glass-effect p-8 rounded-xl">
            <p
              transition:fly={{
                x: 30,
                delay: 300,
                duration: 500,
                easing: sineInOut,
              }}
            >
              {portfolioData.about.paragraph1}
            </p>
            <p
              transition:fly={{
                x: 30,
                delay: 400,
                duration: 500,
                easing: sineInOut,
              }}
            >
              {portfolioData.about.paragraph2}
            </p>
          </div>
          <div class="glass-effect p-8 rounded-xl">
            <h3
              class="text-2xl font-semibold text-purple-300 mb-6"
              transition:fly={{
                y: -20,
                delay: 500,
                duration: 500,
                easing: sineInOut,
              }}
            >
              Skills
            </h3>
            <div class="flex flex-wrap gap-3">
              {#each portfolioData.about.skills as skill, i (skill)}
                <span
                  class="bg-purple-600 bg-opacity-50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-md"
                  in:scale={{
                    start: 0.5,
                    opacity: 0,
                    delay: 600 + i * 50,
                    duration: 300,
                    easing: sineInOut,
                  }}
                >
                  {skill}
                </span>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Experience Section -->
  <section
    id="experience"
    class="py-20 relative overflow-hidden"
    in:fly={{ y: 50, duration: 600, easing: sineInOut }}
  >
    <!-- Background elements -->
    <div
      class="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-700 rounded-full opacity-10 blur-3xl"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/3 w-60 h-60 bg-indigo-600 rounded-full opacity-10 blur-3xl"
    ></div>

    <div class="container mx-auto px-6 relative z-10">
      <h2
        class="text-4xl font-bold text-center text-white mb-16"
        transition:slide={{ delay: 200 }}
      >
        {portfolioData.experience.title}
      </h2>
      <div class="relative">
        <!-- Timeline line for desktop -->
        <div
          class="hidden md:block absolute top-0 bottom-0 left-1/2 w-1 bg-purple-700 transform -translate-x-1/2"
        ></div>

        {#each portfolioData.experience.jobs as job, i (`${job.company}-${job.period}`)}
          <div
            class="relative mb-10 w-full block md:flex md:items-start {i % 2 !==
            0
              ? 'md:flex-row-reverse'
              : ''}"
            in:fly={{
              y: 30,
              delay: 300 + i * 150,
              duration: 600,
            }}
          >
            <!-- Content Side -->
            <div class="w-full md:w-1/2 {i % 2 === 0 ? 'md:pr-6' : 'md:pl-6'}">
              <div class="glass-card p-6 rounded-lg text-left">
                <h3 class="text-2xl font-semibold text-purple-300 mb-1">
                  {job.role}
                </h3>
                <p class="text-lg text-white mb-2">{job.company}</p>
                <p class="text-sm text-purple-200 mb-3">{job.period}</p>
                <ul
                  class="list-disc list-inside text-gray-300 space-y-1 text-sm text-left"
                >
                  {#each job.responsibilities as responsibility}
                    <li>{responsibility}</li>
                  {/each}
                </ul>
              </div>
            </div>
            <!-- Timeline circle (Desktop only) -->
            <div
              class="hidden md:flex absolute left-1/2 top-8 w-6 h-6 bg-purple-500 rounded-full border-4 border-gray-900 transform -translate-x-1/2 items-center justify-center z-20"
            >
              <div class="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <!-- Spacer Side (for desktop layout) -->
            <div
              class="hidden md:block md:w-1/2 {i % 2 === 0
                ? 'md:pl-6'
                : 'md:pr-6'}"
            ></div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Projects Section -->
  <section
    id="projects"
    class="py-20 bg-gray-800 bg-opacity-50 relative overflow-hidden"
    in:fly={{ y: 50, duration: 600, easing: sineInOut }}
  >
    <!-- Background decoration elements -->
    <div
      class="absolute -top-24 right-1/4 w-80 h-80 bg-purple-800 rounded-full opacity-10 blur-3xl"
    ></div>
    <div
      class="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-900 rounded-full opacity-10 blur-3xl"
    ></div>

    <div class="container mx-auto px-6 relative z-10">
      <h2
        class="text-4xl font-bold text-center text-white mb-16"
        transition:slide={{ delay: 200 }}
      >
        {portfolioData.projects.title}
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each portfolioData.projects.items as project, i (project.name)}
          <div
            class="glass-card rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 h-full flex flex-col"
            in:fly={{ y: 50, delay: 300 + i * 100, duration: 500 }}
          >
            <div class="p-6 flex-1 flex flex-col">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-2xl font-semibold text-purple-300">
                  {project.name}
                </h3>
                {#if project.repoUrl !== "#"}
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-purple-300 hover:text-purple-100 transition-colors"
                    aria-label="GitHub Repository"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      ><path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.372-12-11.999-12z"
                      /></svg
                    >
                  </a>
                {/if}
              </div>
              <p class="text-gray-200 mb-4 text-sm leading-relaxed flex-1">
                {project.description}
              </p>
              <div class="mt-auto">
                <div class="mb-4">
                  {#each project.technologies as tech}
                    <span
                      class="inline-block bg-purple-700 bg-opacity-50 text-white text-xs font-semibold mr-2 mb-2 px-2.5 py-1 rounded-full"
                      >{tech}</span
                    >
                  {/each}
                </div>
                <!-- {#if project.link !== "#"}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-block text-purple-300 hover:text-purple-100 font-medium transition-colors group"
                  >
                    View Project <span
                      class="inline-block transition-transform group-hover:translate-x-1"
                      >&rarr;</span
                    >
                  </a>
                {/if} -->
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section
    id="contact"
    class="py-20 relative overflow-hidden flex flex-col items-center justify-center"
    in:fly={{ y: 50, duration: 600, easing: sineInOut }}
  >
    <!-- Background elements -->
    <div
      class="absolute top-1/4 left-1/5 w-64 h-64 bg-purple-600 rounded-full opacity-10 blur-3xl"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/5 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl"
    ></div>

    <div class="container mx-auto px-6 text-center relative z-10">
      <h2
        class="text-4xl font-bold text-white mb-8"
        transition:slide={{ delay: 200 }}
      >
        {portfolioData.contact.title}
      </h2>
      <p
        class="text-lg text-gray-300 mb-10 max-w-2xl mx-auto"
        transition:fly={{ y: 20, delay: 300, duration: 500 }}
      >
        {portfolioData.contact.intro}
      </p>
      <div
        class="glass-effect inline-block px-8 py-6 rounded-xl mb-8"
        transition:fly={{ y: 20, delay: 400, duration: 500 }}
      >
        <a
          href="mailto:{portfolioData.contact.email}"
          class="text-2xl text-purple-300 hover:text-purple-100 transition-colors border-b-2 border-purple-500 hover:border-purple-300 pb-1"
        >
          {portfolioData.contact.email}
        </a>
      </div>
      <div
        class="mt-12 flex justify-center space-x-8"
        transition:fly={{ y: 20, delay: 500, duration: 500 }}
      >
        {#each portfolioData.contact.socials as social (social.name)}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            class="text-purple-300 hover:text-purple-100 transition-colors transform hover:scale-110 p-3 glass-card rounded-full"
          >
            <!-- Social icons -->
            {#if social.icon === "github"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
                ><path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.372-12-11.999-12z"
                /></svg
              >
            {:else if social.icon === "linkedin"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
                ><path
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                /></svg
              >
            {:else if social.icon === "twitter"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
                ><path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.728-.666 1.581-.666 2.477 0 1.61.823 3.027 2.071 3.858-.766-.024-1.483-.234-2.11-.583v.06c0 2.256 1.606 4.135 3.737 4.568-.39.106-.803.164-1.227.164-.3 0-.593-.028-.877-.082.593 1.85 2.307 3.198 4.342 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.099 13.255-13.254 0-.202-.005-.403-.014-.602.91-.658 1.7-1.475 2.323-2.41z"
                /></svg
              >
            {:else if social.icon === "resume"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4.5 11a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4.5 13a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z"
                />
              </svg>
            {/if}
          </a>
        {/each}
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-8 glass-nav">
    <div class="container mx-auto px-6 text-center text-gray-400">
      <p>
        &copy; {new Date().getFullYear()}
        {portfolioData.name}. All rights reserved.
      </p>
      <!-- <p class="text-sm">Built with SvelteKit & Tailwind CSS</p> -->
    </div>
  </footer>
</div>

<style>
  /* Smooth scrolling for anchor links */
  :global(html) {
    scroll-behavior: smooth;
    /* text cannot be hightlighted */
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }

  :global(body.body-no-scroll) {
    overflow: hidden;
  }

  /* Custom scrollbar for a more polished look */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #1a202c;
  }
  ::-webkit-scrollbar-thumb {
    background: #6b46c1;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #553c9a;
  }

  /* Ensure full height for sections for intersection observer to work well */
  section {
    min-height: calc(100vh - 5rem);
    padding-top: 5rem;
    padding-bottom: 2rem;
  }
  #hero {
    min-height: 100vh;
    padding-top: 0;
  }

  /* Animation for active nav link */
  nav a.text-purple-400 {
    position: relative;
  }
  nav a.text-purple-400::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #a78bfa;
    transform: scaleX(1);
    transition: transform 0.3s ease-in-out;
  }
  nav a:not(.text-purple-400)::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #a78bfa;
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
  }
  nav a.hover\:text-purple-100:hover::after {
    transform: scaleX(1);
  }
</style>
