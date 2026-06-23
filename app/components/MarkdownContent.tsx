'use client';
import Markdown from 'markdown-to-jsx';
import CodeBlock from './CodeBlock';
import MathNode from './MathNode';

export default function MarkdownContent({ children }: { children: string }) {
  return (
    <Markdown
      options={{
        overrides: {
          pre: { component: CodeBlock },
          mathnode: { component: MathNode },
        },
      }}
    >
      {children}
    </Markdown>
  );
}
