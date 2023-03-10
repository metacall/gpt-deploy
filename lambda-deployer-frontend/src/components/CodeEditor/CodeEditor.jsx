import React, {useEffect, useRef, useState} from 'react';
import styles from './CodeEditor.module.scss';
import Editor from 'react-simple-code-editor';
import {useSelector , useDispatch} from 'react-redux';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import './prismjsCustom.scss'
import {updateCode , updateCodeTitle} from '../../redux/stores/code.store'
const themes = ['solarized-dark'];
function CodeEditor() {
  const dispatch = useDispatch();
  const {codeTitle, code} = useSelector(state => state.code)
  const [bgcolor , setBgcolor] = useState('solarized-dark');
  const editorRef = useRef(null);

  return (
    <div className={`${styles.editorMain} ${styles[bgcolor]}`} onClick={(e)=>{
      e.stopPropagation();
      e.preventDefault();
      editorRef.current.querySelector('textarea').focus();
    }}>
      <div className={styles.editorWrapper}>
        <div className={styles.editor} ref={editorRef}>
          <Editor
            value={code}
            onValueChange={code => dispatch(updateCode(code))}
            tabSize={4}
            highlight={code => {
              const sv= highlight(code, languages.js);
              return sv;
            }}
            className={`${styles.code} ${styles[bgcolor]}`}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;