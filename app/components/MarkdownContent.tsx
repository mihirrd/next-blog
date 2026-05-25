'use client';
import Markdown from 'markdown-to-jsx';
import CodeBlock from './CodeBlock';

export default function MarkdownContent({ children }: { children: string }) {
  return (
    <Markdown
      options={{
        overrides: {
          pre: { component: CodeBlock },
        },
      }}
    >
      {children}
    </Markdown>
  );
}
