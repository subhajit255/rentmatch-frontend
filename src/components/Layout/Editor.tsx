"use client";

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Heading,
  Link,
  List,
  Indent,
  BlockQuote,
  SourceEditing
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

interface EditorProps {
  value: string;
  onChange: (data: string) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {
  return (
    <div className="w-full custom-editor-container">
      <style>{`
        .ck-editor__editable_inline {
          min-height: 600px;
          padding: 0 30px !important;
        }
        .ck-editor {
          width: 100% !important;
        }
      `}</style>
    <CKEditor
      editor={ClassicEditor}
      config={{
        licenseKey: 'GPL',

        plugins: [
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Link,
          List,
          Indent,
          BlockQuote,
          SourceEditing,
        ],

        toolbar: [
          'undo', 'redo', '|',
          'heading',
          '|',
          'bold', 'italic', '|',
          'link',
          '|',
          'bulletedList', 'numberedList',
          '|',
          'outdent', 'indent',
          '|',
          'blockQuote', '|',
          'sourceEditing',
        ],
        sourceEditing: {
          allowCollaborationFeatures: false,
        },

        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
          ]
        },
      }}
      data={value}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
    </div>
  );
};

export default Editor;
