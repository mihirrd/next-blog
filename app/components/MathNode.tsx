'use client';

// Decodes the base64 KaTeX HTML produced by renderMath and injects it verbatim.
// Decoding the same payload on the server (SSG) and client yields identical
// markup, so hydration stays in sync.
function decodeBase64Utf8(payload: string): string {
  const binary = atob(payload);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function MathNode({ ...props }: { 'data-html'?: string }) {
  const payload = props['data-html'];
  if (!payload) return null;
  return <span dangerouslySetInnerHTML={{ __html: decodeBase64Utf8(payload) }} />;
}
