// 'use client';

// import ExampleTheme from '../utils/themes/ExampleTheme';
// import { LexicalComposer } from '@lexical/react/LexicalComposer';
// import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
// import { ContentEditable } from '@lexical/react/LexicalContentEditable';
// import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
// import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
// import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
// import TreeViewPlugin from '../utils/plugins/TreeViewPlugin';
// import ToolbarPlugin from '../utils/plugins/ToolbarPlugin';
// import { HeadingNode, QuoteNode } from '@lexical/rich-text';
// import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
// import { ListItemNode, ListNode } from '@lexical/list';
// import { CodeHighlightNode, CodeNode } from '@lexical/code';
// import { AutoLinkNode, LinkNode } from '@lexical/link';
// import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
// import { ListPlugin } from '@lexical/react/LexicalListPlugin';
// import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
// import { TRANSFORMERS } from '@lexical/markdown';

// import ListMaxIndentLevelPlugin from '../utils/plugins/ListMaxIndentLevelPlugin';
// import CodeHighlightPlugin from '../utils/plugins/CodeHighlightPlugin';
// import AutoLinkPlugin from '../utils/plugins/AutoLinkPlugin';

// function Placeholder() {
//   return <div className="editor-placeholder">Enter some rich text...</div>;
// }

// const editorConfig = {
//   // The editor theme
//   theme: ExampleTheme,
//   // Handling of errors during update
//   onError(error: any) {
//     throw error;
//   },
//   // Any custom nodes go here
//   nodes: [
//     HeadingNode,
//     ListNode,
//     ListItemNode,
//     QuoteNode,
//     CodeNode,
//     CodeHighlightNode,
//     TableNode,
//     TableCellNode,
//     TableRowNode,
//     AutoLinkNode,
//     LinkNode,
//   ],
// };

// export default function LexicalEditor() {
//   return (
//     <LexicalComposer
//       initialConfig={{ ...editorConfig, namespace: 'your-namespace' }}
//     >
//       <div className="editor-container">
//         <ToolbarPlugin />
//         <div className="editor-inner">
//           <RichTextPlugin
//             contentEditable={<ContentEditable className="editor-input" />}
//             placeholder={<Placeholder />}
//             ErrorBoundary={LexicalErrorBoundary}
//           />
//           <HistoryPlugin />
//           <TreeViewPlugin />
//           <AutoFocusPlugin />
//           <CodeHighlightPlugin />
//           <ListPlugin />
//           <LinkPlugin />
//           <AutoLinkPlugin />
//           <ListMaxIndentLevelPlugin maxDepth={7} />
//           <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
//         </div>
//       </div>
//     </LexicalComposer>
//   );
// }
