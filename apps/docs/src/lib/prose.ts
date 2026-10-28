/*
 * Renders the doc prose subset (decision 0007): paragraphs separated by a
 * blank line, inline code in backticks, and [links](https://example.com).
 * Everything else is escaped, so a stray angle bracket in a doc shows as text
 * rather than becoming markup.
 */

const ESCAPES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char);
}

function linkHtml(text: string): string {
  let html = '';
  let last = 0;
  for (const match of text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)) {
    const [whole, label = '', href = ''] = match;
    html += escapeHtml(text.slice(last, match.index));
    html += `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
    last = match.index + whole.length;
  }
  return html + escapeHtml(text.slice(last));
}

/** One line of prose as inline HTML, for table cells and list items. */
export function inlineHtml(text: string): string {
  // Code spans first, so brackets inside backticks stay literal.
  return text
    .split(/(`[^`]+`)/)
    .map((part) =>
      part.length > 1 && part.startsWith('`') && part.endsWith('`')
        ? `<code>${escapeHtml(part.slice(1, -1))}</code>`
        : linkHtml(part),
    )
    .join('');
}

/** Prose as paragraphs. */
export function proseHtml(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${inlineHtml(paragraph.trim())}</p>`)
    .join('');
}
