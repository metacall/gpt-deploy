import React, { useEffect, useRef } from 'react';
import Prism,{ highlight } from 'prismjs';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import './TextViewer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
// Import other language packages as needed

const CodeDisplay = ({ text, fileName, onClose }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    let language = 'markup'; // Default language if extension detection fails

    if (fileName) {
      const extension = fileName.split('.').pop();
      language = Prism.languages[extension] ? extension : 'markup';
    }

    if (codeRef.current) {
      console.log(highlight(text, Prism.languages[language], language))
      codeRef.current.innerHTML = highlight(text, Prism.languages[language], language);
    }
  }, [text, fileName]);

  return (
      <div className='h-full w-full primary-border border-separate overflow-hidden whitespace-break-spaces no-scrollbar bg-transparent'>

        <div className='text-white text-xl font-bold flex p-2 h-15 bg-slate-800'>
          <span>{fileName.split('/').at(-1)}</span>
          <FontAwesomeIcon icon={faTimes} className='ml-auto items-center place-content-center box-border p-1' title = {'Close'} onClick={onClose}/>
          </div>

        <div ref={codeRef} className='p-2'></div>
      </div>
  );
};

export default CodeDisplay;
