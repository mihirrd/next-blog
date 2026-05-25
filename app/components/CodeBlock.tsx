'use client';
import { useEffect, useState, Children, isValidElement } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ children }: { children?: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark'));
    });
    observer.observe(root, { attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  let language = 'text';
  let code = '';

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === 'code') {
      const props = child.props as { className?: string; children?: React.ReactNode };
      const className = props.className || '';
      language = className.replace(/lang(uage)?-/, '') || 'text';
      code = String(props.children ?? '').trim();
    }
  });

  return (
    <SyntaxHighlighter
      language={language}
      style={isDark ? oneDark : oneLight}
      className="not-prose"
      customStyle={{
        margin: '1.5rem 0',
        borderRadius: '0.5rem',
        fontSize: '0.8125rem',
        lineHeight: '1.75',
        padding: '1.25rem 1.5rem',
      }}
      codeTagProps={{
        style: {
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: 'inherit',
        },
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
