export type Section = {
  /** Element id and hash fragment. */
  id: string;
  /** Label shown in the index rail. */
  label: string;
  /** Position in the dossier. The page is read in order, so the number means something. */
  index: string;
};

/**
 * Source of truth for the page's sections. IndexRail observes exactly these ids.
 * Adding a <section id="..."> to the page without registering it here means the
 * rail ignores it — silently, with no error.
 */
export const sections: Section[] = [
  { id: "hero", label: "Intro", index: "01" },
  { id: "about", label: "About", index: "02" },
  { id: "experience", label: "Experience", index: "03" },
  { id: "projects", label: "Work", index: "04" },
  { id: "contact", label: "Contact", index: "05" }
];

export const sectionIds = sections.map((s) => s.id);
