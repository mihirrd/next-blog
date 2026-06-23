import katex from 'katex';

const katexOptions = {
  throwOnError: false,
  strict: false as const,
  output: 'html' as const,
};

function toMathTag(tex: string, displayMode: boolean): string {
  const html = katex.renderToString(tex.trim(), { ...katexOptions, displayMode });
  // The rendered KaTeX HTML is deeply nested and breaks markdown-to-jsx's
  // inline HTML parser, so we never let it see the markup. Instead we hand it
  // an opaque base64 payload in a custom tag that a component override decodes
  // and injects verbatim (see MarkdownContent / MathNode).
  const payload = Buffer.from(html, 'utf8').toString('base64');
  return `<mathnode data-html="${payload}"></mathnode>`;
}

/**
 * Pre-renders LaTeX math in a markdown string to KaTeX HTML (server-side, so
 * KaTeX stays out of the client bundle). Fenced and inline code are protected
 * so any `$` inside them is left untouched.
 */
export default function renderMath(md: string): string {
  const protectedSegments: string[] = [];
  const protect = (segment: string) => {
    const index = protectedSegments.push(segment) - 1;
    return ` CODE${index} `;
  };

  let out = md
    .replace(/```[\s\S]*?```/g, protect)
    .replace(/`[^`\n]*`/g, protect);

  // Display math: $$ ... $$
  out = out.replace(/\$\$([\s\S]+?)\$\$/g, (_match, tex) => toMathTag(tex, true));

  // Inline math: $ ... $ (single line)
  out = out.replace(/\$([^$\n]+?)\$/g, (_match, tex) => toMathTag(tex, false));

  return out.replace(
    / CODE(\d+) /g,
    (_match, index) => protectedSegments[Number(index)]
  );
}
