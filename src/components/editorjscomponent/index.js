import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const EditorJS = dynamic(
  () => import('@editorjs/editorjs').then(mod => mod.default),
  { ssr: false }
);

const Header = dynamic(
  () => import('@editorjs/header').then(mod => mod.default),
  { ssr: false }
);

const List = dynamic(
  () => import('@editorjs/list').then(mod => mod.default),
  { ssr: false }
);

const EditorjsComponent = ({ data: initialData }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeEditor = async () => {
      try {
        const [EditorJS, Header, List] = await Promise.all([
          import('@editorjs/editorjs').then(mod => mod.default),
          import('@editorjs/header').then(mod => mod.default),
          import('@editorjs/list').then(mod => mod.default)
        ]);

        const editor = new EditorJS({
          holder: 'editorjs-container',
          tools: {
            header: {
              class: Header,
              config: { 
                placeholder: 'Введите заголовок',
                levels: [2, 3],
                defaultLevel: 2
              }
            },
            list: { 
              class: List,
              inlineToolbar: true
            }
          },
          placeholder: 'Начните ввод...',
          data: initialData || undefined,
          onReady: () => {
            // Готово к работе
          }
        });

        editorRef.current = editor;

        // Корректный рендер данных
        if (initialData && editorRef.current?.render) {
          editorRef.current.render(initialData)
            .catch(err => console.error('Ошибка рендеринга:', err));
        }

      } catch (error) {
        console.error('Ошибка инициализации:', error);
      }
    };

    initializeEditor();


    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialData]);


  // Добавьте обработку обновлений данных

  
  useEffect(() => {
    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
      }
    };
  }, []);
  

  return (
    <div
      id="editorjs-container"
      style={{
        minHeight: '200px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '1rem'
      }}
    />
  );
};

export default EditorjsComponent;