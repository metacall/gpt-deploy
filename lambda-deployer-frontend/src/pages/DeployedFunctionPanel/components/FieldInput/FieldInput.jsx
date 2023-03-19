import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './FieldInput.module.scss';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

const fieldTypeToStyle = {
    'bool': styles.boolFieldType,
    'string': styles.stringFieldType,
    'number': styles.numberFieldType,
    }

const FieldInput = ({ fieldName, setInputValue, inputValue, fieldType }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState(true);
   const isObject = useRef(['object', 'array'].includes(fieldType));
    const displayBoxRef = useRef(null);
    const editBoxRef = useRef(null);
  
const handleOutClick = (e)=>{
    if (editBoxRef.current && !editBoxRef.current.contains(e.target)){
        handleInputBlur();
    }
}
  useEffect(()=>{
    document.addEventListener('click', handleOutClick)
    return ()=>{
        document.removeEventListener('click', handleOutClick)
    }
  },[])
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsValid(true);
  };

  const handleInputBlur = () => {
    if (!isValid) {
      setInputValue('');
    }
    setIsEditing(false);
  };

  useEffect(()=>{
    if (isEditing)
        return ;

    if (isObject.current) {
      const highlightedCode = highlight(inputValue, languages.js, 'js');
      displayBoxRef.current.innerHTML = highlightedCode;
    } else{
        displayBoxRef.current.innerHTML = inputValue;
    }
    
  },[isEditing, inputValue])

  const handleInputKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !isObject.current) {
      handleInputBlur();
    }

    if(e.key === 'Tab' ){
        e.preventDefault();
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const value = e.target.value;
        e.target.value = value.substring(0, start) + "\t" + value.substring(end);
        e.target.selectionStart = e.target.selectionEnd = start + 1;
        setInputValue(e.target.value);
    }
  };

  const handleBoxClick = () => {
      if(!isEditing)
        setIsEditing(true);
      else {
          editBoxRef.current.focus();
    }
  };

  const validateInput = (inputValue) => {
    if (Array.isArray(inputValue)) {
      try {
        JSON.parse(inputValue);
      } catch (e) {
        setIsValid(false);
      }
    } else if (typeof inputValue === 'boolean') {
      setIsValid(true);
    } else if (typeof inputValue === 'object') {
      try {
        JSON.parse(inputValue);
      } catch (e) {
        setIsValid(false);
      }
    } else if (typeof inputValue === 'number') {
      setIsValid(!isNaN(inputValue));
    } else if (typeof inputValue === 'string') {
      setIsValid(true);
    }
  };

  const inputProps = {
    value: inputValue,
    onChange: handleInputChange,
    onBlur: handleInputBlur,
    onKeyDown: handleInputKeyDown,
    className: isValid ? styles.inputValid : styles.inputInvalid,
  };

  return (
    <div className={styles.fieldBox} onClick={handleBoxClick} ref = {editBoxRef}>
      <div className={styles.key}>{fieldName}</div>
      {isEditing ? (
        <div className={styles.inputWrapper}>
          { isObject.current ? (
            <textarea {...inputProps} />
          ) : (
            <input {...inputProps}/>
          )}
        </div>
      ) : (
        <div className={styles.value} ref={displayBoxRef}>
            {""}
        </div>
      )}
    </div>
  );
};

FieldInput.propTypes = {
    fieldName: PropTypes.string.isRequired,
    setInputValue: PropTypes.func.isRequired,
    inputValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired
};

export default FieldInput;
