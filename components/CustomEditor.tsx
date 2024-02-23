'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface CustomEditorProps {
  onChange: (content: string, editor: any) => void;

  value: string;
}

export default function CustomEditor({ onChange, value }: CustomEditorProps) {
  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      value={value} // Controlled component: editor content driven by component state
      onEditorChange={(newValue, editor) => {
        if (onChange) {
          onChange(newValue, editor); // Propagate changes up as needed
        }
      }}
      init={{
        plugins: [
          'advlist',
          'autolink',
          'autosave',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
        ],
        toolbar:
          'restoredraft | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',

        tinycomments_author: 'Author name',
        autosave_ask_before_unload: true,
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (
          request: any,
          respondWith: { string: (arg0: () => Promise<never>) => any }
        ) =>
          respondWith.string(() =>
            Promise.reject('See docs to implement AI Assistant')
          ),
      }}
      // eslint-disable-next-line react/jsx-no-duplicate-props
    />
  );
}
