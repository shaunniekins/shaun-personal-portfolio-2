<script lang="ts">
  import Icon, { type IconName } from "$lib/components/Icon.svelte";
  import { flushSync } from "svelte";
  import {
    name,
    title,
    encodedPhone,
    contacts,
    experience,
    skills,
    projects,
    education
  } from "$lib/resume";
  import { emphasis } from "$lib/text";

  /**
   * The phone number is print-only. It ships base64-encoded and is decoded into the
   * DOM only for the duration of a print, so it never appears in the HTML that
   * scrapers read. This deters harvesting; it is not secrecy.
   */
  let printing = $state(false);

  const phone = $derived.by(() => {
    if (!printing) return null;
    const number = atob(encodedPhone);
    return { label: number, url: `tel:${number.replace(/-/g, "")}`, icon: "phone" };
  });

  // The phone sits second, after LinkedIn, as in the original.
  const shownContacts = $derived(phone ? [contacts[0], phone, ...contacts.slice(1)] : [...contacts]);

  // Print events fire for both the button and Ctrl/Cmd+P. flushSync puts the number in
  // the DOM before the browser lays out the printed page.
  function beforePrint() {
    flushSync(() => (printing = true));
  }

  function afterPrint() {
    flushSync(() => (printing = false));
  }

  $effect(() => {
    addEventListener("beforeprint", beforePrint);
    addEventListener("afterprint", afterPrint);
    return () => {
      removeEventListener("beforeprint", beforePrint);
      removeEventListener("afterprint", afterPrint);
    };
  });

  /**
   * The original sets Arabic in Jomhuria and Japanese in SimSun inside otherwise
   * Latin company names. Tag those runs so each gets its own face.
   */
  function scripts(text: string) {
    return text
      .split(/([؀-ۿ]+|[぀-ヿ一-鿿]+)/)
      .filter(Boolean)
      .map((part) => ({
        text: part,
        script: /[؀-ۿ]/.test(part) ? "arabic" : /[぀-鿿]/.test(part) ? "cjk" : null
      }));
  }

  const fonts =
    "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,700;1,400&family=Spectral&display=swap";
  // Only the handful of non-Latin glyphs the sheet uses, via the `text=` subset.
  const scriptFonts =
    "https://fonts.googleapis.com/css2?family=Jomhuria&family=Noto+Serif+JP:wght@700&display=swap&text=" +
    encodeURIComponent("سندباد.تك株式会社");
</script>

<svelte:head>
  <title>{name} — Resume</title>
  <meta name="description" content="{name} — {title}. One-page resume." />
  <link rel="stylesheet" href={fonts} />
  <link rel="stylesheet" href={scriptFonts} />
</svelte:head>

<div class="min-h-dvh px-4 py-6 sm:py-10 print:p-0">
  <nav
    class="mx-auto mb-6 flex max-w-[8.5in] items-center justify-between gap-4 print:hidden"
    aria-label="Resume actions"
  >
    <a
      href="/"
      class="-my-2 py-2.5 font-mono text-xs text-muted transition-colors duration-200 hover:text-text"
    >
      &larr; Portfolio
    </a>
    <button
      type="button"
      onclick={() => {
        beforePrint();
        window.print();
      }}
      class="inline-flex items-center gap-2 rounded-sm border border-line px-4 py-2.5 font-mono text-xs text-muted transition-colors duration-200 hover:border-violet hover:text-text"
    >
      <Icon name="resume" size={14} />
      Save as PDF
    </button>
  </nav>

  <article class="sheet mx-auto">
    <!-- Sits at the 11in mark. The sheet clips it unless content runs past one page, so
         it only shows when a portfolio edit has pushed the resume onto a second page. -->
    <p class="overflow-marker" aria-hidden="true">Page 2 starts here — the resume no longer fits one page</p>
    <header class="text-center">
      <h1 class="name">{name}</h1>
      <p class="title">{title}</p>
      <p class="contacts">
        {#each shownContacts as contact, i (contact.icon)}
          {#if i > 0}<span class="sep" aria-hidden="true">{"  |  "}</span>{/if}
          <span class="contact">
            <Icon
              name={contact.icon as IconName}
              size={contact.icon === "github" ? 7.92 : 7.2}
              class="icon"
            />
            <a href={contact.url} target="_blank" rel="noopener noreferrer">{contact.label}</a>
          </span>
        {/each}
      </p>
    </header>

    <section aria-labelledby="r-experience">
      <h2 id="r-experience">Experience</h2>
      {#each experience as job (job.company + job.period)}
        <div class="job">
          <p class="job-line">
            <span>
              <strong>
                {#each scripts(job.company) as run, i (i)}<span class={run.script}>{run.text}</span>{/each}
              </strong>
              - {job.where}
            </span>
            <em class="period">{job.period}</em>
          </p>
          <p class="role">{job.role}</p>
          <ul>
            {#each job.bullets as bullet, i (i)}
              <li>
                {#each emphasis(bullet) as run, j (j)}{#if run.bold}<strong>{run.text}</strong>{:else}{run.text}{/if}{/each}
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </section>

    <section aria-labelledby="r-skills">
      <h2 id="r-skills">Skills</h2>
      <p class="justify">
        {#each skills as skill, i (skill)}{#if i > 0}{" | "}{/if}<strong>{skill}</strong>{/each}
      </p>
    </section>

    <section aria-labelledby="r-projects">
      <h2 id="r-projects">Projects</h2>
      {#each projects as project (project.name)}
        <p class="justify">
          {#if project.url}
            <a href={project.url} target="_blank" rel="noopener noreferrer" class="plain"
              ><strong>{project.name}</strong></a
            >{:else}<strong>{project.name}</strong>{/if}: {project.summary}
        </p>
      {/each}
    </section>

    <section aria-labelledby="r-education">
      <h2 id="r-education">Education</h2>
      <p><strong>{education.degree}</strong></p>
      <p>{education.school}</p>
    </section>
  </article>
</div>

<style>
  /* Every measurement mirrors OchavoSN-Resume.docx (US Letter, single spacing). */
  @page {
    size: letter;
    margin: 0;
  }

  @media print {
    :global(html),
    :global(body) {
      background: var(--color-paper);
      color-scheme: light;
    }
  }

  .sheet {
    box-sizing: border-box;
    max-width: 8.5in;
    min-height: 11in;
    padding: 0.1in 0.31in 0.06in 0.3in;
    background: var(--color-paper);
    color: var(--color-paper-ink);
    font-family: var(--font-resume);
    font-size: 9pt;
    line-height: 1.15;
    box-shadow: 0 1.5rem 4rem -1rem rgb(0 0 0 / 0.6);
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .sheet {
    position: relative;
    overflow: clip;
  }

  .overflow-marker {
    position: absolute;
    top: 11in;
    right: 0;
    left: 0;
    border-top: 1pt dashed var(--color-paper-heading);
    color: var(--color-paper-heading);
    font-size: 7pt;
    text-align: center;
  }

  /* Phones get a fluid sheet instead of a scaled-down page. */
  @media screen and (max-width: 8.5in) {
    .sheet {
      min-height: 0;
      padding: 1rem;
    }

    /* The fluid layout doesn't paginate like Letter, so the 11in marker means nothing. */
    .overflow-marker {
      display: none;
    }

    /* Justified text rivers badly in a narrow column. */
    .sheet li,
    .sheet .justify {
      text-align: left;
    }

    .sheet ul {
      padding-left: 1.25rem;
    }

    .sheet li::before {
      left: -1rem;
    }
  }

  @media print {
    .sheet {
      width: 8.5in;
      max-width: none;
      min-height: 0;
      overflow: visible;
      box-shadow: none;
    }

    .overflow-marker {
      display: none;
    }
  }

  .sheet ::selection {
    background-color: color-mix(in srgb, var(--color-paper-heading) 30%, transparent);
    color: var(--color-paper-ink);
  }

  .sheet a:focus-visible {
    outline-color: var(--color-paper-link);
  }

  .name {
    margin-top: 6pt;
    font-size: 20pt;
    font-weight: 700;
  }

  .title {
    margin-bottom: 5pt;
    font-size: 10pt;
  }

  .contacts {
    font-family: var(--font-resume-serif);
    font-size: 10pt;
  }

  .contact {
    white-space: nowrap;
  }

  .contact :global(.icon) {
    display: inline;
    margin-right: 0.25em;
    vertical-align: -0.05em;
  }

  .sep {
    white-space: pre;
  }

  .contacts a {
    color: var(--color-paper-link);
    text-decoration: underline;
  }

  /* The .docx used 15pt / 10pt. Tightened once the skills list became derived from the
     portfolio's groups and grew a line, to keep the sheet on one page. */
  h2 {
    margin: 12pt 0 8pt;
    padding-bottom: 2pt;
    border-bottom: 1pt solid var(--color-paper-ink);
    color: var(--color-paper-heading);
    font-size: 10pt;
    font-weight: 700;
    text-transform: uppercase;
  }

  .job + .job {
    margin-top: 10.8pt;
  }

  /* Company/location left, date flush right — the original fakes this with tabs. */
  .job-line {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    column-gap: 1em;
  }

  .period {
    font-size: 7pt;
  }

  .role {
    font-size: 8pt;
    font-weight: 700;
  }

  .arabic {
    font-family: var(--font-resume-arabic);
  }

  .cjk {
    font-family: var(--font-resume-cjk);
  }

  ul {
    margin-top: 4pt;
    padding-left: 0.5in;
  }

  li {
    position: relative;
    text-align: justify;
  }

  li::before {
    content: "●";
    position: absolute;
    left: -0.25in;
  }

  .justify {
    text-align: justify;
  }

  .plain {
    color: inherit;
  }
</style>
