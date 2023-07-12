import React, { useEffect, useRef } from 'react';
import Prism,{ highlight } from 'prismjs';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import './CodeDisplay.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const CodeDisplay = ({ text, fileName, onClose }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    let language = 'markup'; // Default language if extension detection fails

    if (fileName) {
      const extension = fileName.split('.').pop();
      language = Prism.languages[extension] ? extension : 'markup';
    }

    if (codeRef.current) {
      codeRef.current.innerHTML = highlight(text, Prism.languages[language], language);
    }
  }, [text, fileName]);

  return (
      <div className='h-full w-full overflow-auto flex flex-col primary-border border-separate whitespace-break-spaces no-scrollbar bg-transparent'>

        <div className='text-white text-xl font-bold items-center place-content-center flex p-2 h-15 bg-slate-800'>
          <span className='text-sm md:text-base md:p-1 box-border'>{fileName.split('/').at(-1)}</span>
          <button className='ml-auto  box-border md:p-1 '><FontAwesomeIcon icon={faTimes}  title = {'Close'} onClick={onClose}/></button>
        </div>

        <div ref={codeRef} className='p-2 overflow-auto thin-scrollbar'></div>
      </div>
  );
};

export default CodeDisplay;
