/**
 * Bullets in portfolio-data.json may mark key terms with `**bold**`. The resume renders
 * the emphasis; the portfolio timeline shows plain text.
 */
export function emphasis(text: string) {
  return text.split("**").map((part, i) => ({ text: part, bold: i % 2 === 1 }));
}

export function plain(text: string) {
  return text.replaceAll("**", "");
}
