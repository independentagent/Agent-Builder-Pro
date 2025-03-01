import { useEffect, useRef } from 'react';

export function CodeEditor({ value, onChange, language, height }) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadEditor = async () => {
      const { EditorView, basicSetup } = await import('codemirror');
      const { javascript } = await import('@codemirror/lang-javascript');
      const { oneDark } = await import('@codemirror/theme-one-dark');

      editorRef.current = new EditorView({
        doc: value,
        extensions: [
          basicSetup,
          javascript(),
          oneDark,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChange(update.state.doc.toString());
            }
          })
        ],
        parent: containerRef.current
      });
    };

    loadEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && editorRef.current.state.doc.toString() !== value) {
      editorRef.current.dispatch({
        changes: {
          from: 0,
          to: editorRef.current.state.doc.length,
          insert: value
        }
      });
    }
  }, [value]);

  return (
    <div 
      ref={containerRef}
      style={{ height }}
      className="overflow-auto"
    />
  );
}
