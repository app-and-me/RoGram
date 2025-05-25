import theme from '@/styles/theme';
import typo from '@/styles/typo';
import React from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownContent = styled.div`
  max-height: 100%;
  overflow-y: auto;

  h1 {
    ${typo.Title.Strong};
    margin-bottom: ${theme.Component.Spacing[400]}px;
    color: ${theme.Color.Content.Standard.Primary};
  }

  h2 {
    ${typo.Heading.Strong};
    margin-bottom: ${theme.Component.Spacing[400]}px;
    padding-bottom: ${theme.Component.Spacing[400]}px;
    border-bottom: 1px solid ${theme.Color.Line.Divider};
    color: ${theme.Color.Content.Standard.Primary};
  }

  h3 {
    ${typo.Body.Strong};
    margin-top: ${theme.Component.Spacing[400]}px;
    margin-bottom: ${theme.Component.Spacing[400]}px;
    color: ${theme.Color.Content.Standard.Primary};
  }

  p {
    ${typo.Body.Regular};
    margin-bottom: ${theme.Component.Spacing[400]}px;
    color: ${theme.Color.Content.Standard.Secondary};
  }

  ul,
  ol {
    margin-bottom: ${theme.Component.Spacing[400]}px;
    padding-left: 1.5rem;
  }

  li {
    ${typo.Body.Regular};
    margin-bottom: 0.5rem;
    list-style-type: disc;
    color: ${theme.Color.Content.Standard.Secondary};
  }

  code {
    ${typo.Label.CodeRegular};
    padding: 2px 5px;
    background-color: ${theme.Color.Components.Translucent.Tertiary};
    border-radius: 4px;
    color: ${theme.Color.Syntax.Keyword};
  }

  pre {
    margin-bottom: ${theme.Component.Spacing[400]}px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid ${theme.Color.Line.Outline};
  }

  pre code {
    padding: 0;
    background-color: transparent;
    color: inherit;
  }

  blockquote {
    margin: 0 0 1.5rem 0;
    padding: 0.75rem 1.25rem;
    border-left: 4px solid ${theme.Color.Line.Divider};
    color: ${theme.Color.Content.Standard.Secondary};
    background-color: ${theme.Color.Components.Translucent.Tertiary};
    border-radius: 0 4px 4px 0;
  }

  a {
    color: ${theme.Color.Core.Accent};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 1rem 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
    border: 1px solid ${theme.Color.Line.Divider};
    border-radius: 8px;
    overflow: hidden;
  }

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${theme.Color.Line.Divider};
  }

  th {
    ${typo.Label.Strong};
    background-color: ${theme.Color.Components.Translucent.Secondary};
    color: ${theme.Color.Content.Standard.Primary};
  }

  td {
    ${typo.Label.Regular};
    color: ${theme.Color.Content.Standard.Primary};
  }

  tr:last-child td {
    border-bottom: none;
  }
`;
export const customSyntaxHighlighterStyle = {
  ...oneLight,
  'code[class*="language-"]': {
    ...oneLight['code[class*="language-"]'],
    fontSize: typo.Label.CodeRegular.fontSize,
    fontWeight: typo.Label.CodeRegular.fontWeight,
    fontFamily: typo.Label.CodeRegular.fontFamily,
    lineHeight: typo.Label.CodeRegular.lineHeight,
  },
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    margin: 0,
    borderRadius: 0,
    fontSize: typo.Label.CodeRegular.fontSize,
    fontWeight: typo.Label.CodeRegular.fontWeight,
    fontFamily: typo.Label.CodeRegular.fontFamily,
    lineHeight: typo.Label.CodeRegular.lineHeight,
    background: theme.Color.Components.Translucent.Tertiary,
  },
  comment: {
    color: theme.Color.Syntax.Comment,
  },
  function: {
    color: theme.Color.Syntax.Function,
  },
  'function-variable': {
    color: theme.Color.Syntax.Function,
  },
  method: {
    color: theme.Color.Syntax.Function,
  },
  keyword: {
    color: theme.Color.Syntax.Keyword,
  },
  string: {
    color: theme.Color.Syntax.String,
  },
  'template-string': {
    color: theme.Color.Syntax.String,
  },
  number: {
    color: theme.Color.Syntax.Constant,
  },
  boolean: {
    color: theme.Color.Syntax.Constant,
  },
  operator: {
    color: theme.Color.Syntax.Operator,
  },
  variable: {
    color: theme.Color.Syntax.Variable,
  },
  parameter: {
    color: theme.Color.Syntax.Variable,
  },
  punctuation: {
    color: theme.Color.Solid.Black,
  },
  property: {
    color: theme.Color.Syntax.Variable,
  },
};

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <MarkdownContent>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !props.inline && match ? (
              <SyntaxHighlighter
                style={customSyntaxHighlighterStyle}
                language={match[1]}
                PreTag='div'
                showLineNumbers={false}
                wrapLines={true}
                useInlineStyles={true}
                customStyle={{
                  backgroundColor: theme.Color.Components.Translucent.Tertiary,
                  borderRadius: theme.Component.Radius[300],
                  padding: `${theme.Component.Spacing[400]}px`,
                  margin: '0',
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </MarkdownContent>
  );
};

export default MarkdownRenderer;
