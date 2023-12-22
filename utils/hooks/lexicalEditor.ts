// 'use client';

// import { useState, useEffect } from 'react';
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// export const useLexicalContent = () => {
//   const [editor] = useLexicalComposerContext();
//   const [content, setContent] = useState('');

//   useEffect(() => {
//     if (!editor) return;

//     const removeListener = editor.registerUpdateListener(() => {
//       editor.getEditorState().read(() => {
//         // Replace with actual content extraction logic.
//         const extractedContent = ''; // For example: editor.getText()
//         setContent(extractedContent);
//       });
//     });

//     return () => {
//       removeListener();
//     };
//   }, [editor]);

//   return content;
// };
