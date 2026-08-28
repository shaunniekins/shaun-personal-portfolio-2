import type { Action } from "svelte/action";

/**
 * One IntersectionObserver shared by every revealing element on the page.
 * Elements are unobserved once revealed — the effect only ever plays forwards.
 */
let observer: IntersectionObserver | undefined;

function sharedObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries, self) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        self.unobserve(entry.target);
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );
  return observer;
}

/**
 * `use:reveal` or `use:reveal={index}` to stagger by position in a list.
 * Delay is capped so late items in a long grid never feel stalled.
 */
export const reveal: Action<HTMLElement, number | undefined> = (node, order) => {
  const setDelay = (value: number | undefined) => {
    const step = Math.min(Math.max(value ?? 0, 0), 8) * 60;
    node.style.setProperty("--reveal-delay", `${step}ms`);
  };

  setDelay(order);
  const io = sharedObserver();
  io.observe(node);

  return {
    update: setDelay,
    destroy: () => io.unobserve(node)
  };
};
