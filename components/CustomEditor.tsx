'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface CustomEditorProps {
  onChange: (content: string, editor: any) => void;
  initialValue: string;
}

export default function CustomEditor({
  onChange,
  initialValue,
}: CustomEditorProps) {
  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onEditorChange={onChange}
      initialValue={initialValue}
      init={{
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
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
